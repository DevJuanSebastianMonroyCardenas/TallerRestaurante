from sqlalchemy.orm import Session
from typing import Optional, List
from datetime import datetime
from app.models.reservation import Table, Reservation
from app.schemas.v1.reservation import TableCreate, TableUpdate, ReservationCreate, ReservationUpdate


class TableRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, table_id: int) -> Optional[Table]:
        return self.db.query(Table).filter(Table.id == table_id).first()

    def get_by_number(self, table_number: int) -> Optional[Table]:
        return self.db.query(Table).filter(Table.table_number == table_number).first()

    def get_all(self, skip: int = 0, limit: int = 100, available_only: bool = False) -> List[Table]:
        query = self.db.query(Table)
        if available_only:
            query = query.filter(Table.is_available == True)
        return query.offset(skip).limit(limit).all()

    def create(self, table_data: TableCreate) -> Table:
        if self.get_by_number(table_data.table_number):
            raise ValueError("Table number already exists")
        db_table = Table(
            table_number=table_data.table_number,
            capacity=table_data.capacity,
        )
        self.db.add(db_table)
        self.db.commit()
        self.db.refresh(db_table)
        return db_table

    def update(self, table_id: int, table_data: TableUpdate) -> Optional[Table]:
        table = self.get_by_id(table_id)
        if not table:
            return None
        update_data = table_data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(table, key, value)
        self.db.commit()
        self.db.refresh(table)
        return table

    def delete(self, table_id: int) -> bool:
        table = self.get_by_id(table_id)
        if not table:
            return False
        self.db.delete(table)
        self.db.commit()
        return True


class ReservationRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, reservation_id: int) -> Optional[Reservation]:
        return self.db.query(Reservation).filter(Reservation.id == reservation_id).first()

    def get_all(
        self,
        skip: int = 0,
        limit: int = 100,
        date: Optional[datetime] = None,
        status: Optional[str] = None,
    ) -> List[Reservation]:
        query = self.db.query(Reservation)
        if date:
            query = query.filter(Reservation.reservation_date == date)
        if status:
            query = query.filter(Reservation.status == status)
        return query.order_by(Reservation.reservation_date).offset(skip).limit(limit).all()

    def create(self, reservation_data: ReservationCreate) -> Reservation:
        db_reservation = Reservation(
            customer_name=reservation_data.customer_name,
            customer_phone=reservation_data.customer_phone,
            customer_email=reservation_data.customer_email,
            table_id=reservation_data.table_id,
            reservation_date=reservation_data.reservation_date,
            duration_minutes=reservation_data.duration_minutes,
            notes=reservation_data.notes,
            status="confirmed",
        )
        self.db.add(db_reservation)
        self.db.commit()
        self.db.refresh(db_reservation)
        return db_reservation

    def update(self, reservation_id: int, reservation_data: ReservationUpdate) -> Optional[Reservation]:
        reservation = self.get_by_id(reservation_id)
        if not reservation:
            return None
        update_data = reservation_data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(reservation, key, value)
        self.db.commit()
        self.db.refresh(reservation)
        return reservation

    def update_status(self, reservation_id: int, status: str) -> Optional[Reservation]:
        reservation = self.get_by_id(reservation_id)
        if not reservation:
            return None
        reservation.status = status
        self.db.commit()
        self.db.refresh(reservation)
        return reservation

    def delete(self, reservation_id: int) -> bool:
        reservation = self.get_by_id(reservation_id)
        if not reservation:
            return False
        self.db.delete(reservation)
        self.db.commit()
        return True
