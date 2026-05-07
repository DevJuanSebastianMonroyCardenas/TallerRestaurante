# Sistema de Gestión de Restaurante

Sistema académico REST API con arquitectura modular profesional.

## Stack Tecnológico

| Componente | Tecnología | Propósito |
|------------|------------|-----------|
| Backend | FastAPI | API REST con autodocumentación |
| ORM | SQLAlchemy 2.0 | Mapeo objeto-relacional |
| Migraciones | Alembic | Control de versiones del esquema |
| Base de datos | PostgreSQL | Almacenamiento relacional |
| Validación | Pydantic | Validación de datos automática |
| Auth | JWT + Bcrypt | Autenticación stateless |

## Módulos Implementados

| Módulo | Endpoints | Descripción |
|--------|----------|-------------|
| **Users** | 6 | Auth + CRUD usuarios |
| **Categories** | 5 | CRUD categorías |
| **Menu Items** | 5 | CRUD platillos |
| **Tables** | 5 | CRUD mesas |
| **Orders** | 7 | Órdenes con estados |
| **Reservations** | 7 | Reservaciones |
| **Invoices** | 8 | Facturación |
| **Payments** | 4 | Pagos |
| **Reports** | 3 | Reportes de ventas |

**Total: 49 endpoints REST**

## Estructura del Proyecto

```
TallerRestaurante/
├── backend/
│   ├── app/
│   │   ├── api/v1/       # 9 routers REST
│   │   ├── core/         # config, database, security
│   │   ├── models/       # 5 modelos SQLAlchemy
│   │   ├── schemas/v1/  # 6 schemas Pydantic
│   │   ├── services/    # 6 services
│   │   ├── repositories/# 6 repositories
│   │   └── main.py       # FastAPI entry point
│   ├── alembic/          # Migraciones
│   └── requirements.txt
├── docs/
│   ├── ARQUITECTURA.md   # Diseño técnico
│   └── LINEA_BASE.md    # Documentación línea base
└── README.md
```

## Inicio Rápido

### Requisitos
- Python 3.12+
- PostgreSQL 15+

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Configurar .env
cp .env.example .env
# Editar DATABASE_URL con credenciales PostgreSQL

# Crear base de datos
createdb restaurant_db

# Ejecutar migraciones
alembic upgrade head

# Iniciar servidor
uvicorn app.main:app --reload --port 8001
```

### Verificar API
```bash
# Health check
curl http://localhost:8001/health

# Documentación Swagger
open http://localhost:8001/docs

# Documentación ReDoc
open http://localhost:8001/redoc
```

## API Endpoints

### Autenticación
```
POST /api/v1/auth/login  - Login con JWT
```

### Gestión de Usuarios
```
GET    /api/v1/users              - Listar usuarios
GET    /api/v1/users/{id}        - Obtener usuario
POST   /api/v1/users             - Crear usuario
PUT    /api/v1/users/{id}        - Actualizar usuario
DELETE /api/v1/users/{id}        - Eliminar usuario
```

### Catálogo
```
GET    /api/v1/categories         - Listar categorías
POST   /api/v1/categories         - Crear categoría
GET    /api/v1/menu-items         - Listar platillos
POST   /api/v1/menu-items        - Crear platillo
```

### Mesas y Pedidos
```
GET    /api/v1/tables            - Listar mesas
GET    /api/v1/orders            - Listar pedidos
POST   /api/v1/orders            - Crear pedido
PATCH /api/v1/orders/{id}/status - Cambiar estado
```

### Reservaciones
```
GET    /api/v1/reservations      - Listar reservaciones
POST   /api/v1/reservations      - Crear reservación
```

### Facturación
```
POST   /api/v1/invoices          - Generar factura
POST   /api/v1/invoices/{id}/pay - Marcar pagada
POST   /api/v1/payments          - Registrar pago
```

### Reportes
```
GET    /api/v1/reports/sales     - Reporte de ventas
GET    /api/v1/reports/popular-items - Platillos populares
```

## Control de Versiones

### Ramas
- `main` - Producción estable
- `develop` - Desarrollo activo

### Tags
- `v1.0.0-base` - Línea base con módulos completos

### Conventional Commits
- `feat:` Nueva funcionalidad
- `fix:` Corrección de bugs
- `docs:` Documentación
- `refactor:` Refactorización
- `chore:` Mantenimiento

## Licencia
Académica - Propósito educativo
