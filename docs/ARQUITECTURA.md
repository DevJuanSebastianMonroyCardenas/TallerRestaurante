# Arquitectura - Sistema de Gestión de Restaurante

## Visión General

Sistema REST API construido con FastAPI siguiendo arquitectura en capas.

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Client     │────▶│   FastAPI    │────▶│  PostgreSQL │
│  (Frontend) │◀────│   (Backend)  │◀────│    (ORM)    │
└──────────────┘     └──────────────┘     └──────────────┘
```

## Arquitectura en Capas

```
┌────────────────────────────────────────────────────────┐
│                    API Layer (Routers)                  │
│  HTTP Request → Validación → Routing → Response        │
└────────────────────────────┬───────────────────────────┘
                             │
┌────────────────────────────▼───────────────────────────┐
│                  Service Layer                         │
│  Lógica de negocio → Transformación de datos          │
└────────────────────────────┬───────────────────────────┘
                             │
┌────────────────────────────▼───────────────────────────┐
│                Repository Layer                          │
│  Queries SQLAlchemy → Acceso a datos                   │
└────────────────────────────┬───────────────────────────┘
                             │
┌────────────────────────────▼───────────────────────────┐
│                    Model Layer                          │
│  Entidades ORM → Mapeo a tablas PostgreSQL             │
└────────────────────────────────────────────────────────┘
```

## Flujo de Petición

```
1. Cliente → GET /api/v1/users
2. Router (users.py) → Valida endpoint
3. Service → Lógica de negocio
4. Repository → Query a BD
5. Model → SQLAlchemy ejecuta query
6. Response ← Schema Pydantic valida respuesta
7. Cliente ← JSON response
```

## Estructura de Carpetas Explicada

### `app/core/`
Configuración central de la aplicación:
- `config.py` - Variables de entorno (Settings)
- `database.py` - Conexión SQLAlchemy
- `security.py` - Hashing passwords, JWT

### `app/api/v1/`
Rutas HTTP organizadas por dominio:
- `users.py` - CRUD usuarios
- `menus.py` - CRUD menús
- Cada archivo es un "Router" de FastAPI

### `app/models/`
Modelos SQLAlchemy (equivalentes a tablas):
- Cada modelo = una tabla en PostgreSQL
- Definen columnas, tipos, relaciones

### `app/schemas/`
Schemas Pydantic para validación:
- Request schemas - Validar input del cliente
- Response schemas - Formatear output

### `app/services/`
Lógica de negocio:
- Transforma datos entre API y Repository
- Aplicar reglas de negocio

### `app/repositories/`
Acceso a datos:
- Queries SQLAlchemy
- Filtrado, ordenamiento, paginación

---

## Versioning API

Prefix: `/api/v1`

Evolución controlada:
- v1: `/api/v1/users` (actual)
- v2: `/api/v2/users` (futuro)
- Permite mantener múltiples versiones

---

## Patrones Aplicados

### Repository Pattern
Aísla la lógica de acceso a datos.

### Dependency Injection
FastAPI provee `Depends()` para inyección automática.

### Factory Pattern (Settings)
`get_settings()` con `@lru_cache` asegura una sola instancia.

---

## Seguridad Implementada

- **JWT Tokens** para autenticación stateless
- **Bcrypt** para hashing de contraseñas
- **CORS** configurado para frontend
- **Variables de entorno** para secretos

---

## Migraciones Alembic

```
backend/
├── alembic/
│   ├── env.py          # Configuración de migración
│   ├── script.py.mako  # Template de migración
│   └── versions/       # Scripts de migración
└── alembic.ini         # Configuración
```

Flujo de trabajo:
```bash
alembic revision --autogenerate -m "add users table"
alembic upgrade head
```

---

## Ready for Docker

Preparado para contenedorización futura:
- `requirements.txt` para dependencias
- Estructura compatible con multi-stage builds
- Variables de entorno configurables
