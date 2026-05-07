from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.schemas.v1.menu import CategoryCreate, CategoryUpdate, CategoryResponse
from app.services.menu import CategoryService

router = APIRouter()


@router.get("/categories", response_model=List[CategoryResponse])
def list_categories(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    service = CategoryService(db)
    return service.get_all(skip, limit)


@router.get("/categories/{category_id}", response_model=CategoryResponse)
def get_category(category_id: int, db: Session = Depends(get_db)):
    service = CategoryService(db)
    category = service.get_by_id(category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category


@router.post("/categories", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
def create_category(category_data: CategoryCreate, db: Session = Depends(get_db)):
    service = CategoryService(db)
    try:
        return service.create(category_data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.put("/categories/{category_id}", response_model=CategoryResponse)
def update_category(
    category_id: int,
    category_data: CategoryUpdate,
    db: Session = Depends(get_db),
):
    service = CategoryService(db)
    category = service.update(category_id, category_data)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category


@router.delete("/categories/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_category(category_id: int, db: Session = Depends(get_db)):
    service = CategoryService(db)
    if not service.delete(category_id):
        raise HTTPException(status_code=404, detail="Category not found")
    return None
