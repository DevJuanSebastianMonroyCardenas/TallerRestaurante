from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.schemas.v1.billing import PaymentCreate, PaymentResponse
from app.services.billing import PaymentService

router = APIRouter()


@router.get("/payments", response_model=List[PaymentResponse])
def list_payments(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    service = PaymentService(db)
    return service.get_all(skip, limit)


@router.get("/payments/by-invoice/{invoice_id}", response_model=List[PaymentResponse])
def get_payments_by_invoice(invoice_id: int, db: Session = Depends(get_db)):
    service = PaymentService(db)
    return service.get_by_invoice(invoice_id)


@router.post("/payments", response_model=PaymentResponse, status_code=status.HTTP_201_CREATED)
def create_payment(payment_data: PaymentCreate, db: Session = Depends(get_db)):
    service = PaymentService(db)
    try:
        return service.create(payment_data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/payments/{payment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_payment(payment_id: int, db: Session = Depends(get_db)):
    service = PaymentService(db)
    if not service.delete(payment_id):
        raise HTTPException(status_code=404, detail="Payment not found")
    return None
