import os

from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./nuara.db")
CORS_ORIGINS = [
    origem.strip()
    for origem in os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")
    if origem.strip()
]

JWT_SECRET = os.getenv("JWT_SECRET", "")
JWT_EXPIRE_MINUTES = int(os.getenv("JWT_EXPIRE_MINUTES", "480"))
ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", "").strip().lower()
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "")


def validate_config() -> None:
    # "Falhar fechado": sem uma chave forte, a API recusa subir em vez de
    # rodar com uma chave padrão que qualquer um poderia adivinhar.
    if len(JWT_SECRET) < 32:
        raise RuntimeError(
            "JWT_SECRET ausente ou curta demais (mínimo 32 caracteres). "
            "Gere uma com: python -c \"import secrets; print(secrets.token_urlsafe(48))\" "
            "e coloque no arquivo .env"
        )