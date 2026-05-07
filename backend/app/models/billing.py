from sqlalchemy import Column, Integer, String, Numeric, DateTime, ForeignKey
from datetime import datetime
from app.core.database import Base


class Invoice(Base):
    __tablename__ = "invoices"

    id = Column(Integer, primary_key=True, index=True)
    invoice_number = Column(String(20), unique=True, nullable=False)
    order_id = Column(Integer, ForeignKey("orders.id"))
    subtotal = Column(Numeric(10, 2))
    tax = Column(Numeric(10, 2))
    total = Column(Numeric(10, 2))
    payment_method = Column(String(20))
    status = Column(String(20), default="pending")
    created_at = Column(DateTime, default=datetime.utcnow)


class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    invoice_id = Column(Integer, ForeignKey("invoices.id"))
    amount = Column(Numeric(10, 2))
    payment_method = Column(String(20))
    reference = Column(String(50))
    created_at = Column(DateTime, default=datetime.utcnow)
