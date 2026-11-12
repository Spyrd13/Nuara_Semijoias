# Único lugar que sabe ONDE as fotos ficam guardadas (hoje: pasta no disco).
# Para migrar para Cloudflare R2 / S3 no futuro, basta reescrever
# save_image e delete_image — o resto da API não muda.
import uuid
from pathlib import Path
from typing import Optional

from .config import UPLOAD_DIR


def detect_ext(inicio: bytes) -> Optional[str]:
    # Confere o conteúdo real do arquivo (os primeiros bytes), não o nome nem o
    # Content-Type que o cliente diz — esses dois podem ser falsificados.
    if inicio.startswith(b"\xff\xd8\xff"):
        return ".jpg"
    if inicio.startswith(b"\x89PNG\r\n\x1a\n"):
        return ".png"
    if inicio[:4] == b"RIFF" and inicio[8:12] == b"WEBP":
        return ".webp"
    return None


def save_image(dados: bytes, ext: str) -> str:
    # Nome aleatório gerado por nós: nunca usa o nome enviado pelo usuário.
    nome = f"{uuid.uuid4().hex}{ext}"
    (Path(UPLOAD_DIR) / nome).write_bytes(dados)
    return f"/uploads/{nome}"


def delete_image(url: str) -> None:
    (Path(UPLOAD_DIR) / Path(url).name).unlink(missing_ok=True)