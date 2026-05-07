from sqlalchemy.orm import Session
from typing import Optional, List
from app.models.user import User
from app.schemas.v1.user import UserCreate, UserUpdate
from app.repositories.user import UserRepository
from app.core.security import verify_password


class UserService:
    def __init__(self, db: Session):
        self.repository = UserRepository(db)

    def get_user_by_id(self, user_id: int) -> Optional[User]:
        return self.repository.get_by_id(user_id)

    def get_user_by_username(self, username: str) -> Optional[User]:
        return self.repository.get_by_username(username)

    def get_all_users(self, skip: int = 0, limit: int = 100) -> List[User]:
        return self.repository.get_all(skip, limit)

    def create_user(self, user_data: UserCreate) -> User:
        if self.repository.get_by_username(user_data.username):
            raise ValueError("Username already exists")
        if self.repository.get_by_email(user_data.email):
            raise ValueError("Email already exists")
        return self.repository.create(user_data)

    def update_user(self, user_id: int, user_data: UserUpdate) -> Optional[User]:
        return self.repository.update(user_id, user_data)

    def delete_user(self, user_id: int) -> bool:
        return self.repository.delete(user_id)

    def authenticate(self, username: str, password: str) -> Optional[User]:
        user = self.repository.get_by_username(username)
        if not user:
            return None
        if not verify_password(password, user.hashed_password):
            return None
        if not user.is_active:
            return None
        return user
