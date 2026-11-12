from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlmodel import Session

import os

from .config import CORS_ORIGINS, UPLOAD_DIR, validate_config
from .db import create_db_and_tables, engine
from .routers import admin_orders, admin_products, auth, orders, products
from .seed import seed_admin, seed_products


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Roda uma vez quando a API sobe.
    validate_config()  # recusa subir sem JWT_SECRET forte
    create_db_and_tables()
    with Session(engine) as session:
        seed_products(session)
        seed_admin(session)
    yield


app = FastAPI(title="Nüara API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(products.router)
app.include_router(auth.router)
app.include_router(admin_products.router)
app.include_router(orders.router)
app.include_router(admin_orders.router)

# Entrega as fotos em /uploads/<arquivo>. A pasta é criada se não existir.
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")


@app.get("/health")
def health():
    return {"status": "ok"}