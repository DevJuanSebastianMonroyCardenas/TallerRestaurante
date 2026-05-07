# Línea Base - Sistema de Gestión de Restaurante v1.0.0

## Fecha de Creación
Mayo 2026

## Objetivo
Establecer una línea base estable con la estructura modular profesional para el desarrollo del sistema.

---

## Artefactos Versionados

### Código Fuente
| Archivo | Descripción |
|---------|-------------|
| `backend/app/main.py` | Punto de entrada FastAPI |
| `backend/app/core/config.py` | Configuración central |
| `backend/app/core/database.py` | Conexión PostgreSQL |
| `backend/app/core/security.py` | Autenticación JWT |
| `backend/app/models/*.py` | Modelos ORM |
| `backend/app/api/v1/*.py` | Rutas REST placeholder |

### Configuración
| Archivo | Propósito |
|---------|----------|
| `backend/requirements.txt` | Dependencias Python exactas |
| `backend/alembic.ini` | Configuración migraciones |
| `backend/.env.example` | Variables de entorno template |
| `.gitignore` | Exclusiones Git |

### Documentación
| Archivo | Contenido |
|---------|----------|
| `README.md` | Guía rápida del proyecto |
| `docs/ARQUITECTURA.md` | Diseño técnico detallado |
| `docs/LINEA_BASE.md` | Este documento |

---

## Artefactos NO Versionados

```
❌ .env                    # Secretos reales
❌ node_modules/           # Dependencias npm
❌ venv/                   # Entorno virtual Python
❌ __pycache__/            # Bytecode Python
❌ .pytest_cache/          # Cache de tests
❌ *.log                   # Archivos de logs
❌ dist/                   # Build de producción
```

---

## Módulos Implementados (Placeholders)

1. **Users** - API base para gestión de usuarios
2. **Menus** - API base para catálogo de platillos
3. **Orders** - API base para órdenes
4. **Reservations** - API base para reservaciones
5. **Billing** - API base para facturación
6. **Reports** - API base para reportes

---

## Dependencias Bloqueadas

```
fastapi==0.111.0
sqlalchemy==2.0.31
pydantic==2.8.2
alembbic==1.13.2
```

---

## Siguiente Fase

**FASE 2:** Implementar autenticación JWT completa y CRUD de usuarios.

---

**Tag:** `v1.0.0`  
**Rama:** `develop` → `main` (al finalizar FASE 2)
