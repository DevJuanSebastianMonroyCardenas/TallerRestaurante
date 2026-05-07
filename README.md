# Sistema de Gestión de Restaurante

Sistema académico para gestionar operaciones de restaurante con arquitectura modular profesional.

## Stack Tecnológico

| Componente | Tecnología | Propósito |
|------------|------------|-----------|
| Backend | FastAPI | API REST con autodocumentación |
| ORM | SQLAlchemy 2.0 | Mapeo objeto-relacional |
| Migraciones | Alembic | Control de versiones del esquema |
| Frontend | React + Vite | Interfaz de usuario |
| Base de datos | PostgreSQL | Almacenamiento relacional |
| Validación | Pydantic | Validación de datos automática |

## Estructura del Proyecto

```
TallerRestaurante/
├── backend/
│   ├── app/
│   │   ├── api/v1/       # Rutas REST
│   │   ├── core/         # Configuración central
│   │   ├── models/       # Modelos SQLAlchemy
│   │   ├── schemas/      # Schemas Pydantic
│   │   ├── services/     # Lógica de negocio
│   │   └── repositories/ # Acceso a datos
│   ├── alembic/          # Migraciones
│   └── requirements.txt
├── frontend/             # React + Vite
└── docs/                 # Documentación técnica
```

## Módulos

1. **Users** - Gestión de usuarios y autenticación
2. **Menus** - Catálogo de platillos y categorías
3. **Orders** - Órdenes de clientes
4. **Reservations** - Reservaciones de mesas
5. **Billing** - Facturación y pagos
6. **Reports** - Reportes y estadísticas

## Desarrollo Local

### Requisitos
- Python 3.12+
- PostgreSQL 15+
- Node.js 20+

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8001
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## API Documentation

- Swagger UI: `http://localhost:8001/docs`
- ReDoc: `http://localhost:8001/redoc`

## Control de Versiones

- Rama `main`: Producción estable
- Rama `develop`: Desarrollo activo
- Tags: `v1.0.0` - Línea base inicial

## Commits Convencionales

- `feat:` Nueva funcionalidad
- `fix:` Corrección de bugs
- `docs:` Documentación
- `refactor:` Refactorización
- `chore:` Mantenimiento

---

**Versión:** 1.0.0 | **Estado:** Línea Base
