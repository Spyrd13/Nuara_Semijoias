from typing import Optional

from sqlalchemy import JSON, Column
from sqlmodel import Field, SQLModel


# Os nomes dos campos são os MESMOS que o frontend já usa
# (precoPromocional, tipoBanho, ativo...). Assim, na hora de ligar o
# React na API, nenhum componente precisa mudar.
class ProductBase(SQLModel):
    name: str
    price: float
    precoPromocional: Optional[float] = None
    stock: int = 0
    category: str
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


# O que a API devolve. "images" fica vazio até a etapa 3 (upload de fotos).
class ProductRead(ProductBase):
    id: int
    tags: list[str] = []
    images: list[str] = []

class AdminUser(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(index=True, unique=True)
    # Nunca a senha em si: só o "hash" (impossível de reverter).
    password_hash: str


class Token(SQLModel):
    access_token: str
    token_type: str = "bearer"    