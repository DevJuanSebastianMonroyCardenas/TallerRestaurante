from sqlalchemy.orm import Session
from typing import Optional, List
from decimal import Decimal
from app.models.billing import Invoice, Payment
from app.schemas.v1.billing import InvoiceCreate, InvoiceUpdate, PaymentCreate
from app.repositories.billing import InvoiceRepository, PaymentRepository


class InvoiceService:
    STATUS_VALUES = ["pending", "paid", "cancelled", "refunded"]

    def __init__(self, db: Session):
        self.repository = InvoiceRepository(db)

    def get_by_id(self, invoice_id: int) -> Optional[Invoice]:
        return self.repository.get_by_id(invoice_id)

    def get_by_order(self, order_id: int) -> Optional[Invoice]:
        return self.repository.get_by_order(order_id)

    def get_all(self, skip: int = 0, limit: int = 100, status: Optional[str] = None) -> List[Invoice]:
        if status and status not in self.STATUS_VALUES:
            raise ValueError(f"Invalid status. Must be one of: {self.STATUS_VALUES}")
        return self.repository.get_all(skip, limit, status)

    def create_from_order(self, order_id: int, tax_rate: Decimal = Decimal("0.10")) -> Invoice:
        return self.repository.create_from_order(order_id, tax_rate)

    def update(self, invoice_id: int, invoice_data: InvoiceUpdate) -> Optional[Invoice]:
        return self.repository.update(invoice_id, invoice_data)

    def mark_as_paid(self, invoice_id: int) -> Optional[Invoice]:
        return self.repository.update_status(invoice_id, "paid")

    def cancel(self, invoice_id: int) -> Optional[Invoice]:
        return self.repository.update_status(invoice_id, "cancelled")

    def delete(self, invoice_id: int) -> bool:
        return self.repository.delete(invoice_id)


class PaymentService:
    PAYMENT_METHODS = ["cash", "card", "transfer", "yape", "plin"]

    def __init__(self, db: Session):
        self.repository = PaymentRepository(db)

    def get_by_id(self, payment_id: int) -> Optional[Payment]:
        return self.repository.get_by_id(payment_id)

    def get_by_invoice(self, invoice_id: int) -> List[Payment]:
        return self.repository.get_by_invoice(invoice_id)

    def get_all(self, skip: int = 0, limit: int = 100) -> List[Payment]:
        return self.repository.get_all(skip, limit)

    def create(self, payment_data: PaymentCreate) -> Payment:
        if payment_data.payment_method not in self.PAYMENT_METHODS:
            raise ValueError(f"Invalid payment method. Must be one of: {self.PAYMENT_METHODS}")
        return self.repository.create(payment_data)

    def delete(self, payment_id: int) -> bool:
        return self.repository.delete(payment_id)
