from datetime import datetime, timedelta, timezone
from typing import Optional

import jwt
from pwdlib import PasswordHash

from .config import JWT_EXPIRE_MINUTES, JWT_SECRET

# Argon2: algoritmo recomendado hoje pra guardar senhas (lento de propósito,
# pra tornar inviável testar milhões de senhas por segundo).
_hasher = PasswordHash.recommended()

# Hash falso, usado quando o e-mail não existe: assim o login leva o mesmo
# tempo com e-mail certo ou errado, e ninguém descobre quais e-mails existem.
DUMMY_HASH = _hasher.hash("senha-falsa-so-para-igualar-o-tempo")


def hash_password(senha: str) -> str:
    return _hasher.hash(senha)


def verify_password(senha: str, hash_salvo: str) -> bool:
    return _hasher.verify(senha, hash_salvo)


def create_access_token(admin_id: int) -> str:
    expira_em = datetime.now(timezone.utc) + timedelta(minutes=JWT_EXPIRE_MINUTES)
    return jwt.encode({"sub": str(admin_id), "exp": expira_em}, JWT_SECRET, algorithm="HS256")


def decode_access_token(token: str) -> Optional[int]:
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        return int(payload["sub"])
    except (jwt.PyJWTError, KeyError, ValueError):
        return None  # token inválido, adulterado ou expirado