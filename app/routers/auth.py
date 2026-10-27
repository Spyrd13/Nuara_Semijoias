from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session, select

from ..db import get_session
from ..deps import get_current_admin
from ..models import AdminUser, Token
from ..security import DUMMY_HASH, create_access_token, verify_password

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=Token)
def login(
    form: OAuth2PasswordRequestForm = Depends(),
    session: Session = Depends(get_session),
):
    # O formulário padrão do OAuth2 chama o e-mail de "username".
    admin = session.exec(
        select(AdminUser).where(AdminUser.email == form.username.strip().lower())
    ).first()
    senha_ok = verify_password(form.password, admin.password_hash if admin else DUMMY_HASH)
    if not admin or not senha_ok:
        # Mesma mensagem pros dois casos: não revela se o e-mail existe.
        raise HTTPException(
            status_code=401,
            detail="E-mail ou senha incorretos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return Token(access_token=create_access_token(admin.id))


@router.get("/me")
def me(admin: AdminUser = Depends(get_current_admin)):
    return {"email": admin.email}