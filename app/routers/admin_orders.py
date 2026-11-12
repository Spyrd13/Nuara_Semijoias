from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import update
from sqlmodel import Session, select

from ..db import get_session
from ..deps import get_current_admin
from ..models import Order, OrderItem, OrderRead, OrderStatusUpdate, Product, StatusPedido
from .orders import montar_pedido

router = APIRouter(
    prefix="/admin/orders",
    tags=["admin: pedidos"],
    dependencies=[Depends(get_current_admin)],
)

# O pedido só avança nesta ordem (pode pular etapas). "cancelado" é um desvio.
ORDEM = ["novo", "confirmado", "enviado", "entregue"]


def _buscar_ou_404(session: Session, order_id: int) -> Order:
    pedido = session.get(Order, order_id)
    if not pedido:
        raise HTTPException(status_code=404, detail="Pedido não encontrado")
    return pedido


@router.get("", response_model=list[OrderRead])
def list_orders(status: Optional[StatusPedido] = None, session: Session = Depends(get_session)):
    consulta = select(Order).order_by(Order.id.desc())  # mais recentes primeiro
    if status:
        consulta = consulta.where(Order.status == status)
    return [montar_pedido(session, p) for p in session.exec(consulta).all()]


@router.get("/{order_id}", response_model=OrderRead)
def get_order(order_id: int, session: Session = Depends(get_session)):
    return montar_pedido(session, _buscar_ou_404(session, order_id))


@router.patch("/{order_id}/status", response_model=OrderRead)
def update_status(order_id: int, dados: OrderStatusUpdate, session: Session = Depends(get_session)):
    pedido = _buscar_ou_404(session, order_id)
    atual, novo = pedido.status, dados.status

    if atual in ("entregue", "cancelado"):
        raise HTTPException(status_code=409, detail=f"Pedido {atual} não pode mais mudar de status")

    if novo == "cancelado":
        # Cancelar devolve as peças ao estoque (só acontece uma vez: cancelado é final).
        itens = session.exec(select(OrderItem).where(OrderItem.order_id == pedido.id)).all()
        for item in itens:
            session.execute(
                update(Product).where(Product.id == item.product_id).values(stock=Product.stock + item.quantity)
            )
    elif ORDEM.index(novo) <= ORDEM.index(atual):
        raise HTTPException(status_code=409, detail=f"O status só avança (atual: {atual})")

    pedido.status = novo
    session.add(pedido)
    session.commit()
    session.refresh(pedido)
    return montar_pedido(session, pedido)