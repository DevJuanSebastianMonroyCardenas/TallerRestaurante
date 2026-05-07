# Línea Base - Sistema de Gestión de Restaurante v1.0.0-base

## Fecha de Creación
Mayo 2026

## Objetivo
Línea base estable con backend FastAPI modular completo y profesional.

---

## Endpoints API (49 total)

| Módulo | Endpoints | Descripción |
|--------|----------|-------------|
| Users | 6 | Auth + CRUD |
| Categories | 5 | CRUD categorías |
| Menu Items | 5 | CRUD platillos |
| Tables | 5 | CRUD mesas |
| Orders | 7 | CRUD + estados |
| Reservations | 7 | CRUD + estados |
| Invoices | 8 | Facturación |
| Payments | 4 | Pagos |
| Reports | 3 | Reportes |

---

## Módulos Implementados

### Users
- JWT Authentication (`/api/v1/auth/login`)
- User CRUD with Bcrypt password hashing
- OAuth2PasswordBearer protection

### Categories
- CRUD operations for menu categories
- Active/Inactive status management

### Menu Items
- Full CRUD with category association
- Price, availability, and image management
- Filtering by category and availability

### Tables
- Restaurant table management
- Capacity and availability tracking

### Orders
- Order creation with multiple items
- Status workflow: `pending → confirmed → preparing → ready → delivered`
- Automatic total calculation from items
- Cancellation support

### Reservations
- Customer reservation management
- Status workflow: `confirmed → seated → completed`
- Duration and notes tracking
- Date-based filtering

### Invoices
- Auto-generation from orders
- Tax calculation (10% default)
- Invoice numbering (INV-000001)
- Status: pending → paid → cancelled

### Payments
- Multiple payment methods: cash, card, transfer, yape, plin
- Payment tracking per invoice
- Reference number support

### Reports
- Sales report with daily breakdown
- Popular items report
- Category sales analysis

---

## Artefactos Versionados

### Backend Core
```
backend/app/
├── api/v1/              # 9 routers (users, categories, menu_items, tables, orders, reservations, invoices, payments, reports)
├── core/
│   ├── config.py       # Settings con Pydantic BaseSettings
│   ├── database.py     # SQLAlchemy SessionLocal
│   └── security.py    # JWT + Bcrypt utilities
├── models/             # 5 modelos ORM (user, menu, order, reservation, billing)
├── schemas/v1/         # 6 schemas Pydantic (user, menu, order, reservation, billing, reports)
├── services/           # 6 services (user, menu, order, reservation, billing, reports)
├── repositories/       # 6 repositories
└── main.py            # FastAPI app entry point
```

### Configuración
| Archivo | Propósito |
|---------|----------|
| `backend/requirements.txt` | Dependencias Python exactas |
| `backend/alembic.ini` | Configuración migraciones |
| `backend/.env.example` | Variables de entorno template |
| `.gitignore` | Exclusiones profesionales |

---

## Artefactos NO Versionados

```
.env                     # Secretos reales
node_modules/           # Dependencias npm
venv/                   # Entorno virtual Python
__pycache__/            # Bytecode Python
.pytest_cache/          # Cache de tests
*.log                   # Archivos de logs
dist/                   # Build de producción
```

---

## Dependencias Bloqueadas

```
fastapi==0.111.0
uvicorn[standard]==0.30.1
sqlalchemy==2.0.31
psycopg2-binary==2.9.9
alembbic==1.13.2
pydantic==2.8.2
pydantic-settings==2.3.4
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-dotenv==1.0.1
email-validator==2.1.1
```

---

## Git Estado

### Ramas
- `main` - Producción estable (merged)
- `develop` - Desarrollo activo

### Tags
- `v1.0.0-base` - Línea base final con todos los módulos

### Commits
```
d271ecc fix: register reports router in main app
6fbfb4a feat: add reports module
bc5bbfb feat: add billing module
aec40a8 feat: add reservation management module
0ee79a4 feat: add order management module
10699c2 feat: add menu management module
49c5ff4 feat: add user authentication and CRUD module
19e87ed chore: initial project structure - v1.0.0 baseline
```

---

## Estrategia de Ramas Futuras

```
main (producción)
└── develop (desarrollo)
    ├── feature/auth-enhancements
    ├── feature/docker-setup
    ├── feature/frontend-react
    └── ...
```

---

## Control de Versiones API

- **Prefix:** `/api/v1`
- **Futura evolución:** `/api/v2` sin romper compatibilidad

---

## Próximos Pasos Sugeridos

1. **FASE 9:** Configurar PostgreSQL y ejecutar migraciones
2. **FASE 10:** Setup frontend React + Vite
3. **FASE 11:** Docker setup
4. **FASE 12:** Tests unitarios

---

**Tag:** `v1.0.0-base`
**Rama:** `main`
**Fecha:** Mayo 2026
