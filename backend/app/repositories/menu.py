from sqlalchemy.orm import Session
from typing import Optional, List
from app.models.menu import Category, MenuItem
from app.schemas.v1.menu import CategoryCreate, CategoryUpdate, MenuItemCreate, MenuItemUpdate


class CategoryRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, category_id: int) -> Optional[Category]:
        return self.db.query(Category).filter(Category.id == category_id).first()

    def get_by_name(self, name: str) -> Optional[Category]:
        return self.db.query(Category).filter(Category.name == name).first()

    def get_all(self, skip: int = 0, limit: int = 100, active_only: bool = True) -> List[Category]:
        query = self.db.query(Category)
        if active_only:
            query = query.filter(Category.is_active == True)
        return query.offset(skip).limit(limit).all()

    def create(self, category_data: CategoryCreate) -> Category:
        db_category = Category(
            name=category_data.name,
            description=category_data.description,
        )
        self.db.add(db_category)
        self.db.commit()
        self.db.refresh(db_category)
        return db_category

    def update(self, category_id: int, category_data: CategoryUpdate) -> Optional[Category]:
        category = self.get_by_id(category_id)
        if not category:
            return None
        update_data = category_data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(category, key, value)
        self.db.commit()
        self.db.refresh(category)
        return category

    def delete(self, category_id: int) -> bool:
        category = self.get_by_id(category_id)
        if not category:
            return False
        self.db.delete(category)
        self.db.commit()
        return True


class MenuItemRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, item_id: int) -> Optional[MenuItem]:
        return self.db.query(MenuItem).filter(MenuItem.id == item_id).first()

    def get_by_name(self, name: str) -> Optional[MenuItem]:
        return self.db.query(MenuItem).filter(MenuItem.name == name).first()

    def get_all(
        self,
        skip: int = 0,
        limit: int = 100,
        category_id: Optional[int] = None,
        available_only: bool = False,
    ) -> List[MenuItem]:
        query = self.db.query(MenuItem)
        if category_id:
            query = query.filter(MenuItem.category_id == category_id)
        if available_only:
            query = query.filter(MenuItem.is_available == True)
        return query.offset(skip).limit(limit).all()

    def create(self, item_data: MenuItemCreate) -> MenuItem:
        db_item = MenuItem(
            name=item_data.name,
            description=item_data.description,
            price=item_data.price,
            category_id=item_data.category_id,
            image_url=item_data.image_url,
        )
        self.db.add(db_item)
        self.db.commit()
        self.db.refresh(db_item)
        return db_item

    def update(self, item_id: int, item_data: MenuItemUpdate) -> Optional[MenuItem]:
        item = self.get_by_id(item_id)
        if not item:
            return None
        update_data = item_data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(item, key, value)
        self.db.commit()
        self.db.refresh(item)
        return item

    def delete(self, item_id: int) -> bool:
        item = self.get_by_id(item_id)
        if not item:
            return False
        self.db.delete(item)
        self.db.commit()
        return True
