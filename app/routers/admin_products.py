from fastapi import APIRouter, Depends, File, HTTPException, Response, UploadFile
from sqlmodel import Session, select

from ..config import MAX_IMAGES_PER_PRODUCT, MAX_UPLOAD_MB
from ..db import get_session
from ..deps import get_current_admin
from ..models import Product, ProductCreate, ProductRead, ProductUpdate
from ..storage import delete_image, detect_ext, save_image

# "dependencies=[...]" protege TODAS as rotas deste arquivo de uma vez:
# sem um token de admin válido, qualquer uma delas devolve 401.
router = APIRouter(
    prefix="/admin/products",
    tags=["admin: produtos"],
    dependencies=[Depends(get_current_admin)],
)


def _buscar_ou_404(session: Session, product_id: int) -> Product:
    produto = session.get(Product, product_id)
    if not produto:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    return produto


@router.get("", response_model=list[ProductRead])
def list_all(session: Session = Depends(get_session)):
    # Diferente da vitrine pública: o admin vê TUDO (inativos e esgotados).
    return session.exec(select(Product).order_by(Product.id)).all()


@router.get("/{product_id}", response_model=ProductRead)
def get_one(product_id: int, session: Session = Depends(get_session)):
    return _buscar_ou_404(session, product_id)


@router.post("", response_model=ProductRead, status_code=201)
def create(dados: ProductCreate, session: Session = Depends(get_session)):
    produto = Product(**dados.model_dump())
    session.add(produto)
    session.commit()
    session.refresh(produto)
    return produto


@router.patch("/{product_id}", response_model=ProductRead)
def update(product_id: int, dados: ProductUpdate, session: Session = Depends(get_session)):
    produto = _buscar_ou_404(session, product_id)
    # exclude_unset: só mexe no que veio no corpo (enviar null limpa o campo).
    mudancas = dados.model_dump(exclude_unset=True)
    for campo, valor in mudancas.items():
        # Campos obrigatórios não aceitam null.
        if valor is None and campo != "precoPromocional":
            raise HTTPException(status_code=422, detail=f"'{campo}' não pode ser nulo")
        setattr(produto, campo, valor)
    # Valida o resultado final (ex.: mudar só o price pode invalidar a promo).
    if produto.precoPromocional is not None and produto.precoPromocional >= produto.price:
        raise HTTPException(status_code=422, detail="precoPromocional deve ser menor que price")
    session.add(produto)
    session.commit()
    session.refresh(produto)
    return produto


@router.delete("/{product_id}", status_code=204)
def delete(product_id: int, session: Session = Depends(get_session)):
    produto = _buscar_ou_404(session, product_id)
    fotos = list(produto.images)
    session.delete(produto)
    session.commit()
    for url in fotos:  # não deixa fotos órfãs ocupando disco
        delete_image(url)
    return Response(status_code=204)


@router.post("/{product_id}/images", response_model=ProductRead, status_code=201)
def upload_image(
    product_id: int,
    arquivo: UploadFile = File(...),
    session: Session = Depends(get_session),
):
    produto = _buscar_ou_404(session, product_id)
    if len(produto.images) >= MAX_IMAGES_PER_PRODUCT:
        raise HTTPException(status_code=400, detail=f"Máximo de {MAX_IMAGES_PER_PRODUCT} fotos por produto")

    # Lê no máximo (limite + 1) bytes: se passou do limite, recusa sem
    # carregar um arquivo gigante inteiro na memória.
    limite = MAX_UPLOAD_MB * 1024 * 1024
    dados = arquivo.file.read(limite + 1)
    if len(dados) > limite:
        raise HTTPException(status_code=413, detail=f"Foto maior que {MAX_UPLOAD_MB} MB")

    ext = detect_ext(dados[:12])
    if not ext:
        raise HTTPException(status_code=415, detail="Formato não suportado (use JPG, PNG ou WebP)")

    url = save_image(dados, ext)
    # Atribui uma lista NOVA: o SQLAlchemy não percebe .append() numa coluna JSON.
    produto.images = [*produto.images, url]
    session.add(produto)
    session.commit()
    session.refresh(produto)
    return produto


@router.delete("/{product_id}/images/{filename}", response_model=ProductRead)
def delete_product_image(product_id: int, filename: str, session: Session = Depends(get_session)):
    produto = _buscar_ou_404(session, product_id)
    url = f"/uploads/{filename}"
    # Só apaga o que está de fato na lista deste produto (sem brecha pra
    # apagar arquivo qualquer do servidor).
    if url not in produto.images:
        raise HTTPException(status_code=404, detail="Foto não encontrada neste produto")
    produto.images = [i for i in produto.images if i != url]
    session.add(produto)
    session.commit()
    session.refresh(produto)
    delete_image(url)
    return produto