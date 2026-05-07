from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.schemas.v1.menu import MenuItemCreate, MenuItemUpdate, MenuItemResponse
from app.services.menu import MenuItemService

router = APIRouter()


@router.get("/menu-items", response_model=List[MenuItemResponse])
def list_menu_items(
    skip: int = 0,
    limit: int = 100,
    category_id: Optional[int] = None,
    available_only: bool = False,
    db: Session = Depends(get_db),
):
    service = MenuItemService(db)
    return service.get_all(skip, limit, category_id, available_only)


@router.get("/menu-items/{item_id}", response_model=MenuItemResponse)
def get_menu_item(item_id: int, db: Session = Depends(get_db)):
    service = MenuItemService(db)
    item = service.get_by_id(item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Menu item not found")
    return item


@router.post("/menu-items", response_model=MenuItemResponse, status_code=status.HTTP_201_CREATED)
def create_menu_item(item_data: MenuItemCreate, db: Session = Depends(get_db)):
    service = MenuItemService(db)
    try:
        return service.create(item_data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.put("/menu-items/{item_id}", response_model=MenuItemResponse)
def update_menu_item(
    item_id: int,
    item_data: MenuItemUpdate,
    db: Session = Depends(get_db),
):
    service = MenuItemService(db)
    item = service.update(item_id, item_data)
    if not item:
        raise HTTPException(status_code=404, detail="Menu item not found")
    return item


@router.delete("/menu-items/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_menu_item(item_id: int, db: Session = Depends(get_db)):
    service = MenuItemService(db)
    if not service.delete(item_id):
        raise HTTPException(status_code=404, detail="Menu item not found")
    return None
