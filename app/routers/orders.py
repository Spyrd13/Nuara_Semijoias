from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import update
from sqlmodel import Session, select

from ..db import get_session
from ..models import Order, OrderCreate, OrderItem, OrderItemRead, OrderRead, Product

router = APIRouter(prefix="/orders", tags=["pedidos"])


def preco_efetivo(produto: Product) -> float:
    # Mesma regra do frontend (utils/pricing.js): usa a promoção se ela existir
    # e for realmente menor que o preço normal.
    promo = produto.precoPromocional
    if promo is not None and promo < produto.price:
        return round(promo, 2)
    return round(produto.price, 2)


def montar_pedido(session: Session, pedido: Order) -> OrderRead:
    itens = session.exec(select(OrderItem).where(OrderItem.order_id == pedido.id).order_by(OrderItem.id)).all()
    return OrderRead(
        id=pedido.id,
        created_at=pedido.created_at,
        status=pedido.status,
        nome=pedido.nome,
        sobrenome=pedido.sobrenome,
        telefone=pedido.telefone,
        total=pedido.total,
        items=[OrderItemRead(product_id=i.product_id, name=i.name, unit_price=i.unit_price, quantity=i.quantity) for i in itens],
    )


@router.post("", response_model=OrderRead, status_code=201)
def create_order(dados: OrderCreate, session: Session = Depends(get_session)):
    # Junta itens repetidos do mesmo produto (ex.: 1 + 1 vira 2).
    quantidades: dict[int, int] = {}
    for item in dados.items:
        quantidades[item.product_id] = quantidades.get(item.product_id, 0) + item.quantity

    produtos = {
        p.id: p
        for p in session.exec(select(Product).where(Product.id.in_(list(quantidades)))).all()
    }
    for pid in quantidades:
        produto = produtos.get(pid)
        if not produto or not produto.ativo:
            raise HTTPException(status_code=422, detail=f"Produto {pid} indisponível")

    # Baixa de estoque ATÔMICA: o próprio banco só desconta se ainda houver
    # estoque suficiente ("WHERE stock >= quantidade"). Assim, dois clientes
    # comprando a última peça ao mesmo tempo não conseguem vender duas vezes.
    for pid, qtd in quantidades.items():
        resultado = session.execute(
            update(Product).where(Product.id == pid, Product.stock >= qtd).values(stock=Product.stock - qtd)
        )
        if resultado.rowcount == 0:
            session.rollback()  # desfaz também os descontos dos itens anteriores
            raise HTTPException(status_code=409, detail=f"Estoque insuficiente para '{produtos[pid].name}'")

    total = round(sum(preco_efetivo(produtos[pid]) * qtd for pid, qtd in quantidades.items()), 2)
    pedido = Order(
        nome=dados.customer.nome.strip(),
        sobrenome=dados.customer.sobrenome.strip(),
        telefone=dados.customer.telefone,
        total=total,
    )
    session.add(pedido)
    session.flush()  # gera o pedido.id sem encerrar a transação
    for pid, qtd in quantidades.items():
        session.add(OrderItem(
            order_id=pedido.id, product_id=pid, name=produtos[pid].name,
            unit_price=preco_efetivo(produtos[pid]), quantity=qtd,
        ))
    session.commit()  # estoque + pedido + itens: tudo junto ou nada
    session.refresh(pedido)
    return montar_pedido(session, pedido)