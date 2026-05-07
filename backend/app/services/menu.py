from sqlalchemy.orm import Session
from typing import Optional, List
from app.models.menu import Category, MenuItem
from app.schemas.v1.menu import CategoryCreate, CategoryUpdate, MenuItemCreate, MenuItemUpdate
from app.repositories.menu import CategoryRepository, MenuItemRepository


class CategoryService:
    def __init__(self, db: Session):
        self.repository = CategoryRepository(db)

    def get_by_id(self, category_id: int) -> Optional[Category]:
        return self.repository.get_by_id(category_id)

    def get_all(self, skip: int = 0, limit: int = 100) -> List[Category]:
        return self.repository.get_all(skip, limit)

    def create(self, category_data: CategoryCreate) -> Category:
        if self.repository.get_by_name(category_data.name):
            raise ValueError("Category name already exists")
        return self.repository.create(category_data)

    def update(self, category_id: int, category_data: CategoryUpdate) -> Optional[Category]:
        return self.repository.update(category_id, category_data)

    def delete(self, category_id: int) -> bool:
        return self.repository.delete(category_id)


class MenuItemService:
    def __init__(self, db: Session):
        self.repository = MenuItemRepository(db)

    def get_by_id(self, item_id: int) -> Optional[MenuItem]:
        return self.repository.get_by_id(item_id)

    def get_all(
        self,
        skip: int = 0,
        limit: int = 100,
        category_id: Optional[int] = None,
        available_only: bool = False,
    ) -> List[MenuItem]:
        return self.repository.get_all(skip, limit, category_id, available_only)

    def create(self, item_data: MenuItemCreate) -> MenuItem:
        if self.repository.get_by_name(item_data.name):
            raise ValueError("Menu item name already exists")
        return self.repository.create(item_data)

    def update(self, item_id: int, item_data: MenuItemUpdate) -> Optional[MenuItem]:
        return self.repository.update(item_id, item_data)

    def delete(self, item_id: int) -> bool:
        return self.repository.delete(item_id)
