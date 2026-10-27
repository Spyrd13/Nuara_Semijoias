from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from ..db import get_session
from ..models import Product, ProductRead

router = APIRouter(prefix="/products", tags=["produtos"])


@router.get("", response_model=list[ProductRead])
def list_products(session: Session = Depends(get_session)):
    # Vitrine pública: só produto ativo e com estoque (peças únicas
    # esgotadas saem do catálogo). O admin verá tudo, mas isso é a etapa 3.
    consulta = (
        select(Product)
        .where(Product.ativo == True, Product.stock > 0)  # noqa: E712
        .order_by(Product.id)
    )
    return session.exec(consulta).all()


@router.get("/{product_id}", response_model=ProductRead)
def get_product(product_id: int, session: Session = Depends(get_session)):
    produto = session.get(Product, product_id)
    if not produto or not produto.ativo:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    return produto