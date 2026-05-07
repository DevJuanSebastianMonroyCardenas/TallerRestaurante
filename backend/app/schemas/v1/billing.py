from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional
from decimal import Decimal


class PaymentBase(BaseModel):
    amount: Decimal
    payment_method: str


class PaymentCreate(PaymentBase):
    invoice_id: int
    reference: Optional[str] = None


class PaymentResponse(PaymentBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    invoice_id: int
    reference: Optional[str]
    created_at: datetime


class InvoiceBase(BaseModel):
    order_id: int
    subtotal: Decimal
    tax: Decimal
    total: Decimal
    payment_method: Optional[str] = None


class InvoiceCreate(BaseModel):
    order_id: int
    tax_rate: Decimal = Decimal("0.10")


class InvoiceUpdate(BaseModel):
    payment_method: Optional[str] = None
    status: Optional[str] = None


class InvoiceResponse(InvoiceBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    invoice_number: str
    status: str
    created_at: datetime


class InvoiceWithPayments(InvoiceResponse):
    payments: list[PaymentResponse] = []
