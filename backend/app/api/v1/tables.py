from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.schemas.v1.reservation import TableCreate, TableUpdate, TableResponse
from app.services.reservation import TableService

router = APIRouter()


@router.get("/tables", response_model=List[TableResponse])
def list_tables(
    skip: int = 0,
    limit: int = 100,
    available_only: bool = False,
    db: Session = Depends(get_db),
):
    service = TableService(db)
    return service.get_all(skip, limit, available_only)


@router.get("/tables/{table_id}", response_model=TableResponse)
def get_table(table_id: int, db: Session = Depends(get_db)):
    service = TableService(db)
    table = service.get_by_id(table_id)
    if not table:
        raise HTTPException(status_code=404, detail="Table not found")
    return table


@router.post("/tables", response_model=TableResponse, status_code=status.HTTP_201_CREATED)
def create_table(table_data: TableCreate, db: Session = Depends(get_db)):
    service = TableService(db)
    try:
        return service.create(table_data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.put("/tables/{table_id}", response_model=TableResponse)
def update_table(
    table_id: int,
    table_data: TableUpdate,
    db: Session = Depends(get_db),
):
    service = TableService(db)
    table = service.update(table_id, table_data)
    if not table:
        raise HTTPException(status_code=404, detail="Table not found")
    return table


@router.delete("/tables/{table_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_table(table_id: int, db: Session = Depends(get_db)):
    service = TableService(db)
    if not service.delete(table_id):
        raise HTTPException(status_code=404, detail="Table not found")
    return None
