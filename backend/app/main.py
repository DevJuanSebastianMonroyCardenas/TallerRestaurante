from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import get_settings
from app.api.v1 import users, orders, reservations, reports, categories, menu_items, tables, invoices, payments

settings = get_settings()

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router, prefix=settings.API_V1_PREFIX, tags=["Users"])
app.include_router(categories.router, prefix=settings.API_V1_PREFIX, tags=["Categories"])
app.include_router(menu_items.router, prefix=settings.API_V1_PREFIX, tags=["Menu Items"])
app.include_router(tables.router, prefix=settings.API_V1_PREFIX, tags=["Tables"])
app.include_router(orders.router, prefix=settings.API_V1_PREFIX, tags=["Orders"])
app.include_router(reservations.router, prefix=settings.API_V1_PREFIX, tags=["Reservations"])
app.include_router(invoices.router, prefix=settings.API_V1_PREFIX, tags=["Invoices"])
app.include_router(payments.router, prefix=settings.API_V1_PREFIX, tags=["Payments"])
app.include_router(reports.router, prefix=settings.API_V1_PREFIX, tags=["Reports"])


@app.get("/")
def root():
    return {"message": "Sistema de Gestión de Restaurante API", "version": settings.APP_VERSION}


@app.get("/health")
def health_check():
    return {"status": "healthy"}
