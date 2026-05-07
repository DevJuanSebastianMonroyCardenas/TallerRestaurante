from sqlalchemy.orm import Session
from typing import Optional, List
from datetime import datetime
from app.models.reservation import Table, Reservation
from app.schemas.v1.reservation import TableCreate, TableUpdate, ReservationCreate, ReservationUpdate
from app.repositories.reservation import TableRepository, ReservationRepository


class TableService:
    def __init__(self, db: Session):
        self.repository = TableRepository(db)

    def get_by_id(self, table_id: int) -> Optional[Table]:
        return self.repository.get_by_id(table_id)

    def get_all(self, skip: int = 0, limit: int = 100, available_only: bool = False) -> List[Table]:
        return self.repository.get_all(skip, limit, available_only)

    def create(self, table_data: TableCreate) -> Table:
        return self.repository.create(table_data)

    def update(self, table_id: int, table_data: TableUpdate) -> Optional[Table]:
        return self.repository.update(table_id, table_data)

    def delete(self, table_id: int) -> bool:
        return self.repository.delete(table_id)


class ReservationService:
    STATUS_VALUES = ["confirmed", "seated", "completed", "cancelled", "no_show"]

    def __init__(self, db: Session):
        self.repository = ReservationRepository(db)

    def get_by_id(self, reservation_id: int) -> Optional[Reservation]:
        return self.repository.get_by_id(reservation_id)

    def get_all(
        self,
        skip: int = 0,
        limit: int = 100,
        date: Optional[datetime] = None,
        status: Optional[str] = None,
    ) -> List[Reservation]:
        if status and status not in self.STATUS_VALUES:
            raise ValueError(f"Invalid status. Must be one of: {self.STATUS_VALUES}")
        return self.repository.get_all(skip, limit, date, status)

    def create(self, reservation_data: ReservationCreate) -> Reservation:
        return self.repository.create(reservation_data)

    def update(self, reservation_id: int, reservation_data: ReservationUpdate) -> Optional[Reservation]:
        return self.repository.update(reservation_id, reservation_data)

    def update_status(self, reservation_id: int, status: str) -> Optional[Reservation]:
        if status not in self.STATUS_VALUES:
            raise ValueError(f"Invalid status. Must be one of: {self.STATUS_VALUES}")
        return self.repository.update_status(reservation_id, status)

    def cancel(self, reservation_id: int) -> Optional[Reservation]:
        return self.repository.update_status(reservation_id, "cancelled")

    def delete(self, reservation_id: int) -> bool:
        return self.repository.delete(reservation_id)
