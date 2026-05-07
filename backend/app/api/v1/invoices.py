from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.schemas.v1.billing import InvoiceCreate, InvoiceUpdate, InvoiceResponse
from app.services.billing import InvoiceService

router = APIRouter()


@router.get("/invoices", response_model=List[InvoiceResponse])
def list_invoices(
    skip: int = 0,
    limit: int = 100,
    status_filter: Optional[str] = None,
    db: Session = Depends(get_db),
):
    service = InvoiceService(db)
    try:
        return service.get_all(skip, limit, status_filter)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/invoices/{invoice_id}", response_model=InvoiceResponse)
def get_invoice(invoice_id: int, db: Session = Depends(get_db)):
    service = InvoiceService(db)
    invoice = service.get_by_id(invoice_id)
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    return invoice


@router.get("/invoices/by-order/{order_id}", response_model=InvoiceResponse)
def get_invoice_by_order(order_id: int, db: Session = Depends(get_db)):
    service = InvoiceService(db)
    invoice = service.get_by_order(order_id)
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found for this order")
    return invoice


@router.post("/invoices", response_model=InvoiceResponse, status_code=status.HTTP_201_CREATED)
def create_invoice(invoice_data: InvoiceCreate, db: Session = Depends(get_db)):
    service = InvoiceService(db)
    try:
        return service.create_from_order(invoice_data.order_id, invoice_data.tax_rate)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.put("/invoices/{invoice_id}", response_model=InvoiceResponse)
def update_invoice(
    invoice_id: int,
    invoice_data: InvoiceUpdate,
    db: Session = Depends(get_db),
):
    service = InvoiceService(db)
    invoice = service.update(invoice_id, invoice_data)
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    return invoice


@router.post("/invoices/{invoice_id}/pay")
def mark_invoice_paid(invoice_id: int, db: Session = Depends(get_db)):
    service = InvoiceService(db)
    invoice = service.mark_as_paid(invoice_id)
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    return invoice


@router.post("/invoices/{invoice_id}/cancel")
def cancel_invoice(invoice_id: int, db: Session = Depends(get_db)):
    service = InvoiceService(db)
    invoice = service.cancel(invoice_id)
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    return invoice


@router.delete("/invoices/{invoice_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_invoice(invoice_id: int, db: Session = Depends(get_db)):
    service = InvoiceService(db)
    if not service.delete(invoice_id):
        raise HTTPException(status_code=404, detail="Invoice not found")
    return None
