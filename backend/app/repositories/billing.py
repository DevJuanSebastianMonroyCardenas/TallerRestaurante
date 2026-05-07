from sqlalchemy.orm import Session
from typing import Optional, List
from decimal import Decimal
from app.models.billing import Invoice, Payment
from app.models.order import Order
from app.schemas.v1.billing import InvoiceCreate, InvoiceUpdate, PaymentCreate


class InvoiceRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, invoice_id: int) -> Optional[Invoice]:
        return self.db.query(Invoice).filter(Invoice.id == invoice_id).first()

    def get_by_number(self, invoice_number: str) -> Optional[Invoice]:
        return self.db.query(Invoice).filter(Invoice.invoice_number == invoice_number).first()

    def get_by_order(self, order_id: int) -> Optional[Invoice]:
        return self.db.query(Invoice).filter(Invoice.order_id == order_id).first()

    def get_all(
        self,
        skip: int = 0,
        limit: int = 100,
        status: Optional[str] = None,
    ) -> List[Invoice]:
        query = self.db.query(Invoice)
        if status:
            query = query.filter(Invoice.status == status)
        return query.order_by(Invoice.created_at.desc()).offset(skip).limit(limit).all()

    def create_from_order(self, order_id: int, tax_rate: Decimal = Decimal("0.10")) -> Invoice:
        order = self.db.query(Order).filter(Order.id == order_id).first()
        if not order:
            raise ValueError("Order not found")

        if self.get_by_order(order_id):
            raise ValueError("Invoice already exists for this order")

        subtotal = order.total
        tax = subtotal * tax_rate
        total = subtotal + tax

        invoice_count = self.db.query(Invoice).count()
        invoice_number = f"INV-{invoice_count + 1:06d}"

        db_invoice = Invoice(
            invoice_number=invoice_number,
            order_id=order_id,
            subtotal=subtotal,
            tax=tax,
            total=total,
            status="pending",
        )
        self.db.add(db_invoice)
        self.db.commit()
        self.db.refresh(db_invoice)
        return db_invoice

    def update(self, invoice_id: int, invoice_data: InvoiceUpdate) -> Optional[Invoice]:
        invoice = self.get_by_id(invoice_id)
        if not invoice:
            return None
        update_data = invoice_data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(invoice, key, value)
        self.db.commit()
        self.db.refresh(invoice)
        return invoice

    def update_status(self, invoice_id: int, status: str) -> Optional[Invoice]:
        invoice = self.get_by_id(invoice_id)
        if not invoice:
            return None
        invoice.status = status
        self.db.commit()
        self.db.refresh(invoice)
        return invoice

    def delete(self, invoice_id: int) -> bool:
        invoice = self.get_by_id(invoice_id)
        if not invoice:
            return False
        self.db.query(Payment).filter(Payment.invoice_id == invoice_id).delete()
        self.db.delete(invoice)
        self.db.commit()
        return True


class PaymentRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, payment_id: int) -> Optional[Payment]:
        return self.db.query(Payment).filter(Payment.id == payment_id).first()

    def get_by_invoice(self, invoice_id: int) -> List[Payment]:
        return self.db.query(Payment).filter(Payment.invoice_id == invoice_id).all()

    def get_all(self, skip: int = 0, limit: int = 100) -> List[Payment]:
        return self.db.query(Payment).order_by(Payment.created_at.desc()).offset(skip).limit(limit).all()

    def create(self, payment_data: PaymentCreate) -> Payment:
        db_payment = Payment(
            invoice_id=payment_data.invoice_id,
            amount=payment_data.amount,
            payment_method=payment_data.payment_method,
            reference=payment_data.reference,
        )
        self.db.add(db_payment)
        self.db.commit()
        self.db.refresh(db_payment)
        return db_payment

    def delete(self, payment_id: int) -> bool:
        payment = self.get_by_id(payment_id)
        if not payment:
            return False
        self.db.delete(payment)
        self.db.commit()
        return True
