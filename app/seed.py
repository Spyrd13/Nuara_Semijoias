from sqlmodel import Session, select

from .models import Product

# Mesmos 8 produtos de teste do frontend (src/data/products.js).
PRODUTOS_INICIAIS = [
    dict(name="Colar Suspiro", price=129.90, icon="✦", category="colar", stock=12,
         description="Um colar delicado, com caimento suave para o dia a dia ou para dar aquele toque especial em qualquer look."),
    dict(name="Anel Carícia", price=79.90, icon="◐", category="anel", stock=8,
         description="Anel fino e discreto, perfeito para combinar com outras peças ou usar sozinho."),
    dict(name="Brinco Orvalho", price=89.90, icon="✧", category="brinco", stock=5,
         description="Brinco leve com brilho suave, inspirado nas primeiras luzes da manhã."),
    dict(name="Pulseira Verso", price=99.90, icon="〰", category="pulseira", stock=0,
         description="Pulseira de elos finos, pensada para ser usada todos os dias sem perder o brilho."),
    dict(name="Anel Lírio", price=74.90, icon="◑", category="anel", stock=15,
         description="Design minimalista com um leve relevo floral, discreto e elegante."),
    dict(name="Colar Aurora", price=139.90, icon="✦", category="colar", stock=3,
         description="Peça de destaque, com pingente delicado que reflete luz de vários ângulos."),
    dict(name="Brinco Marear", price=84.90, icon="✧", category="brinco", stock=9,
         description="Brinco leve em formato de gota, inspirado no movimento do mar."),
    dict(name="Pulseira Fio de Luz", price=94.90, icon="〰", category="pulseira", stock=10,
         description="Pulseira fina, ideal para compor com outras peças no mesmo braço."),
]


def seed_products(session: Session) -> None:
    # Só popula se a tabela estiver vazia — nunca sobrescreve dados reais.
    if session.exec(select(Product)).first():
        return
    for dados in PRODUTOS_INICIAIS:
        session.add(Product(**dados))
    session.commit()