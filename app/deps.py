from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlmodel import Session

from .db import get_session
from .models import AdminUser
from .security import decode_access_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


# Qualquer rota que declare "admin = Depends(get_current_admin)" só
# funciona com um token válido. É assim que as rotas do admin (etapa 3
# em diante) vão ser protegidas.
def get_current_admin(
    token: str = Depends(oauth2_scheme),
    session: Session = Depends(get_session),
) -> AdminUser:
    admin_id = decode_access_token(token)
    admin = session.get(AdminUser, admin_id) if admin_id else None
    if not admin:
        raise HTTPException(
            status_code=401,
            detail="Não autenticado",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return admin