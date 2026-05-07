from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from app.core.database import get_db
from app.schemas.v1.reservation import ReservationCreate, ReservationUpdate, ReservationResponse
from app.services.reservation import ReservationService

router = APIRouter()


@router.get("/reservations", response_model=List[ReservationResponse])
def list_reservations(
    skip: int = 0,
    limit: int = 100,
    date: Optional[datetime] = Query(None),
    status_filter: Optional[str] = None,
    db: Session = Depends(get_db),
):
    service = ReservationService(db)
    try:
        return service.get_all(skip, limit, date, status_filter)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/reservations/{reservation_id}", response_model=ReservationResponse)
def get_reservation(reservation_id: int, db: Session = Depends(get_db)):
    service = ReservationService(db)
    reservation = service.get_by_id(reservation_id)
    if not reservation:
        raise HTTPException(status_code=404, detail="Reservation not found")
    return reservation


@router.post("/reservations", response_model=ReservationResponse, status_code=status.HTTP_201_CREATED)
def create_reservation(reservation_data: ReservationCreate, db: Session = Depends(get_db)):
    service = ReservationService(db)
    try:
        return service.create(reservation_data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.put("/reservations/{reservation_id}", response_model=ReservationResponse)
def update_reservation(
    reservation_id: int,
    reservation_data: ReservationUpdate,
    db: Session = Depends(get_db),
):
    service = ReservationService(db)
    reservation = service.update(reservation_id, reservation_data)
    if not reservation:
        raise HTTPException(status_code=404, detail="Reservation not found")
    return reservation


@router.patch("/reservations/{reservation_id}/status")
def update_reservation_status(
    reservation_id: int,
    status: str,
    db: Session = Depends(get_db),
):
    service = ReservationService(db)
    try:
        reservation = service.update_status(reservation_id, status)
        if not reservation:
            raise HTTPException(status_code=404, detail="Reservation not found")
        return reservation
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/reservations/{reservation_id}/cancel")
def cancel_reservation(reservation_id: int, db: Session = Depends(get_db)):
    service = ReservationService(db)
    reservation = service.cancel(reservation_id)
    if not reservation:
        raise HTTPException(status_code=404, detail="Reservation not found")
    return reservation


@router.delete("/reservations/{reservation_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_reservation(reservation_id: int, db: Session = Depends(get_db)):
    service = ReservationService(db)
    if not service.delete(reservation_id):
        raise HTTPException(status_code=404, detail="Reservation not found")
    return None
