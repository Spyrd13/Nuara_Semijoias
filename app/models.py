import re
from datetime import datetime, timezone
from typing import Literal, Optional

from pydantic import field_validator, model_validator

from sqlalchemy import JSON, Column
from sqlmodel import Field, SQLModel


# Os nomes dos campos são os MESMOS que o frontend já usa
# (precoPromocional, tipoBanho, ativo...). Assim, na hora de ligar o
# React na API, nenhum componente precisa mudar.
class ProductBase(SQLModel):
    name: str = Field(min_length=1)
    price: float = Field(ge=0)
    precoPromocional: Optional[float] = Field(default=None, ge=0)
    stock: int = Field(default=0, ge=0)
    category: str = Field(min_length=1)
    description: str = ""
    ativo: bool = True
    sku: str = ""
    material: str = ""
    tipoBanho: str = ""
    medidas: str = ""
    garantia: str = ""
    icon: str = "✦"  # provisório: some quando o upload de fotos existir


class Product(ProductBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    tags: list[str] = Field(default_factory=list, sa_column=Column(JSON))
    # URLs das fotos (ex.: "/uploads/ab12.jpg"). Só muda pelas rotas de upload.
    images: list[str] = Field(default_factory=list, sa_column=Column(JSON))


# O que a API devolve.
class ProductRead(ProductBase):
    id: int
    tags: list[str] = []
    images: list[str] = []

# Corpo do POST do admin: mesmos campos do produto + tags.
class ProductCreate(ProductBase):
    tags: list[str] = []

    @model_validator(mode="after")
    def promo_menor_que_preco(self):
        if self.precoPromocional is not None and self.precoPromocional >= self.price:
            raise ValueError("precoPromocional deve ser menor que price")
        return self


# Corpo do PATCH: tudo opcional; só os campos enviados são alterados.
class ProductUpdate(SQLModel):
    name: Optional[str] = Field(default=None, min_length=1)
    price: Optional[float] = Field(default=None, ge=0)
    precoPromocional: Optional[float] = Field(default=None, ge=0)
    stock: Optional[int] = Field(default=None, ge=0)
    category: Optional[str] = Field(default=None, min_length=1)
    description: Optional[str] = None
    ativo: Optional[bool] = None
    sku: Optional[str] = None
    material: Optional[str] = None
    tipoBanho: Optional[str] = None
    medidas: Optional[str] = None
    garantia: Optional[str] = None
    icon: Optional[str] = None
    tags: Optional[list[str]] = None


class AdminUser(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(index=True, unique=True)
    # Nunca a senha em si: só o "hash" (impossível de reverter).
    password_hash: str


class Token(SQLModel):
    access_token: str
    token_type: str = "bearer"


# ---------------------------------------------------------------- pedidos
StatusPedido = Literal["novo", "confirmado", "enviado", "entregue", "cancelado"]


# "orders" (e não "order"): ORDER é palavra reservada do SQL.
class Order(SQLModel, table=True):
    __tablename__ = "orders"
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    status: str = "novo"
    nome: str
    sobrenome: str = ""
    telefone: str
    total: float


# Cada item guarda uma "foto" do nome e do preço no momento da compra:
# se o produto mudar de preço depois, o pedido antigo continua certo.
class OrderItem(SQLModel, table=True):
    __tablename__ = "order_items"
    id: Optional[int] = Field(default=None, primary_key=True)
    order_id: int = Field(foreign_key="orders.id", index=True)
    product_id: int = Field(foreign_key="product.id", index=True)
    name: str
    unit_price: float
    quantity: int


# O que o cliente envia: só QUAL produto e QUANTAS peças. O preço nunca vem de fora.
class OrderItemIn(SQLModel):
    product_id: int
    quantity: int = Field(ge=1, le=99)


class CustomerIn(SQLModel):
    nome: str = Field(min_length=1, max_length=80)
    sobrenome: str = Field(default="", max_length=80)
    telefone: str

    @field_validator("telefone")
    @classmethod
    def so_digitos(cls, v: str) -> str:
        digitos = re.sub(r"\D", "", v)  # aceita "(31) 99999-8888" e guarda só os números
        if not 10 <= len(digitos) <= 13:
            raise ValueError("telefone inválido (use DDD + número)")
        return digitos


class OrderCreate(SQLModel):
    customer: CustomerIn
    items: list[OrderItemIn] = Field(min_length=1, max_length=20)


class OrderItemRead(SQLModel):
    product_id: int
    name: str
    unit_price: float
    quantity: int


class OrderRead(SQLModel):
    id: int
    created_at: datetime
    status: str
    nome: str
    sobrenome: str
    telefone: str
    total: float
    items: list[OrderItemRead]


class OrderStatusUpdate(SQLModel):
    status: StatusPedido