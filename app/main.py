from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session

from .config import CORS_ORIGINS
from .db import create_db_and_tables, engine
from .routers import products
from .seed import seed_products


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Roda uma vez quando a API sobe: cria as tabelas e popula os produtos de teste.
    create_db_and_tables()
    with Session(engine) as session:
        seed_products(session)
    yield


app = FastAPI(title="Nüara API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(products.router)


@app.get("/health")
def health():
    return {"status": "ok"}