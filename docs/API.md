# API Documentation - Sistema de Gestión de Restaurante

## Base URL
```
http://localhost:8001/api/v1
```

## Autenticación

Todos los endpoints excepto `/auth/login` requieren JWT Bearer Token.

### Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "secret"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer"
}
```

### Usar Token
```http
Authorization: Bearer <access_token>
```

---

## Users

### Listar Usuarios
```http
GET /api/v1/users?skip=0&limit=100
```

### Obtener Usuario
```http
GET /api/v1/users/{user_id}
```

### Crear Usuario
```http
POST /api/v1/users
Content-Type: application/json

{
  "username": "juan",
  "email": "juan@email.com",
  "password": "secret123",
  "full_name": "Juan Pérez",
  "role": "user"
}
```

### Actualizar Usuario
```http
PUT /api/v1/users/{user_id}
Content-Type: application/json

{
  "email": "juan.nuevo@email.com",
  "role": "admin"
}
```

### Eliminar Usuario
```http
DELETE /api/v1/users/{user_id}
```

---

## Categories

### Listar Categorías
```http
GET /api/v1/categories?skip=0&limit=100
```

### Obtener Categoría
```http
GET /api/v1/categories/{category_id}
```

### Crear Categoría
```http
POST /api/v1/categories
Content-Type: application/json

{
  "name": "Entradas",
  "description": "Platillos de entrada"
}
```

### Actualizar Categoría
```http
PUT /api/v1/categories/{category_id}
Content-Type: application/json

{
  "name": "Entradas frias",
  "is_active": true
}
```

### Eliminar Categoría
```http
DELETE /api/v1/categories/{category_id}
```

---

## Menu Items

### Listar Platillos
```http
GET /api/v1/menu-items?skip=0&limit=100&category_id=1&available_only=true
```

### Obtener Platillo
```http
GET /api/v1/menu-items/{item_id}
```

### Crear Platillo
```http
POST /api/v1/menu-items
Content-Type: application/json

{
  "name": "Ceviche",
  "description": "Ceviche clásico peruano",
  "price": 45.00,
  "category_id": 2,
  "image_url": "https://...",
  "is_available": true
}
```

### Actualizar Platillo
```http
PUT /api/v1/menu-items/{item_id}
Content-Type: application/json

{
  "price": 48.00,
  "is_available": false
}
```

### Eliminar Platillo
```http
DELETE /api/v1/menu-items/{item_id}
```

---

## Tables

### Listar Mesas
```http
GET /api/v1/tables?skip=0&limit=100&available_only=true
```

### Obtener Mesa
```http
GET /api/v1/tables/{table_id}
```

### Crear Mesa
```http
POST /api/v1/tables
Content-Type: application/json

{
  "table_number": 5,
  "capacity": 6,
  "is_available": true
}
```

### Actualizar Mesa
```http
PUT /api/v1/tables/{table_id}
Content-Type: application/json

{
  "capacity": 8,
  "is_available": false
}
```

### Eliminar Mesa
```http
DELETE /api/v1/tables/{table_id}
```

---

## Orders

### Listar Pedidos
```http
GET /api/v1/orders?skip=0&limit=100&status_filter=pending
```

**Filtros de status:** `pending`, `confirmed`, `preparing`, `ready`, `delivered`, `cancelled`

### Obtener Pedido
```http
GET /api/v1/orders/{order_id}
```

### Crear Pedido
```http
POST /api/v1/orders
Content-Type: application/json

{
  "table_number": 5,
  "customer_name": "María García",
  "items": [
    {"menu_item_id": 1, "quantity": 2},
    {"menu_item_id": 3, "quantity": 1}
  ]
}
```

### Actualizar Pedido
```http
PUT /api/v1/orders/{order_id}
Content-Type: application/json

{
  "customer_name": "María López",
  "status": "confirmed"
}
```

### Cambiar Estado
```http
PATCH /api/v1/orders/{order_id}/status?status=preparing
```

### Cancelar Pedido
```http
POST /api/v1/orders/{order_id}/cancel
```

### Eliminar Pedido
```http
DELETE /api/v1/orders/{order_id}
```

---

## Reservations

### Listar Reservaciones
```http
GET /api/v1/reservations?skip=0&limit=100&date=2026-05-10T00:00:00&status_filter=confirmed
```

### Obtener Reservación
```http
GET /api/v1/reservations/{reservation_id}
```

### Crear Reservación
```http
POST /api/v1/reservations
Content-Type: application/json

{
  "customer_name": "Carlos Ruiz",
  "customer_phone": "+51 999 123 456",
  "customer_email": "carlos@email.com",
  "table_id": 3,
  "reservation_date": "2026-05-15T19:00:00",
  "duration_minutes": 120,
  "notes": "Mesa junto a la ventana"
}
```

### Actualizar Reservación
```http
PUT /api/v1/reservations/{reservation_id}
Content-Type: application/json

{
  "customer_phone": "+51 999 654 321",
  "duration_minutes": 90
}
```

### Cambiar Estado
```http
PATCH /api/v1/reservations/{reservation_id}/status?status=seated
```

**Filtros de status:** `confirmed`, `seated`, `completed`, `cancelled`, `no_show`

### Cancelar Reservación
```http
POST /api/v1/reservations/{reservation_id}/cancel
```

### Eliminar Reservación
```http
DELETE /api/v1/reservations/{reservation_id}
```

---

## Invoices

### Listar Facturas
```http
GET /api/v1/invoices?skip=0&limit=100&status_filter=pending
```

**Filtros de status:** `pending`, `paid`, `cancelled`, `refunded`

### Obtener Factura
```http
GET /api/v1/invoices/{invoice_id}
```

### Obtener Factura por Orden
```http
GET /api/v1/invoices/by-order/{order_id}
```

### Crear Factura
```http
POST /api/v1/invoices
Content-Type: application/json

{
  "order_id": 1,
  "tax_rate": 0.10
}
```

**Response:**
```json
{
  "id": 1,
  "invoice_number": "INV-000001",
  "order_id": 1,
  "subtotal": "150.00",
  "tax": "15.00",
  "total": "165.00",
  "status": "pending"
}
```

### Actualizar Factura
```http
PUT /api/v1/invoices/{invoice_id}
Content-Type: application/json

{
  "payment_method": "card"
}
```

### Marcar como Pagada
```http
POST /api/v1/invoices/{invoice_id}/pay
```

### Cancelar Factura
```http
POST /api/v1/invoices/{invoice_id}/cancel
```

### Eliminar Factura
```http
DELETE /api/v1/invoices/{invoice_id}
```

---

## Payments

### Listar Pagos
```http
GET /api/v1/payments?skip=0&limit=100
```

### Pagos por Factura
```http
GET /api/v1/payments/by-invoice/{invoice_id}
```

### Registrar Pago
```http
POST /api/v1/payments
Content-Type: application/json

{
  "invoice_id": 1,
  "amount": 165.00,
  "payment_method": "card",
  "reference": "TXN-123456"
}
```

**Métodos de pago:** `cash`, `card`, `transfer`, `yape`, `plin`

### Eliminar Pago
```http
DELETE /api/v1/payments/{payment_id}
```

---

## Reports

### Reporte de Ventas
```http
GET /api/v1/reports/sales?start_date=2026-01-01T00:00:00&end_date=2026-12-31T23:59:59
```

**Response:**
```json
{
  "start_date": "2026-01-01T00:00:00",
  "end_date": "2026-12-31T23:59:59",
  "summary": {
    "total_orders": 150,
    "total_revenue": "15000.00",
    "total_tax": "1500.00",
    "average_order": "100.00"
  },
  "daily_sales": [
    {"date": "2026-01-01T00:00:00", "orders_count": 10, "revenue": "1000.00"}
  ]
}
```

### Platillos Populares
```http
GET /api/v1/reports/popular-items?start_date=2026-01-01T00:00:00&end_date=2026-12-31T23:59:59&limit=10
```

**Response:**
```json
{
  "start_date": "2026-01-01T00:00:00",
  "end_date": "2026-12-31T23:59:59",
  "top_items": [
    {"menu_item_id": 1, "menu_item_name": "Ceviche", "quantity_sold": 45, "revenue": "2025.00"}
  ]
}
```

### Ventas por Categoría
```http
GET /api/v1/reports/category-sales?start_date=2026-01-01T00:00:00&end_date=2026-12-31T23:59:59
```

**Response:**
```json
{
  "start_date": "2026-01-01T00:00:00",
  "end_date": "2026-12-31T23:59:59",
  "categories": [
    {"category_id": 1, "category_name": "Entradas", "items_sold": 120, "revenue": "3600.00"}
  ]
}
```

---

## Códigos de Estado HTTP

| Código | Descripción |
|--------|-------------|
| 200 | OK |
| 201 | Creado |
| 204 | Sin contenido (DELETE exitoso) |
| 400 | Bad Request - Error de validación |
| 401 | Unauthorized - Token inválido |
| 404 | Not Found - Recurso no existe |
| 422 | Unprocessable Entity - Datos inválidos |
| 500 | Internal Server Error |

---

## Ejemplo Completo

### 1. Login
```bash
curl -X POST http://localhost:8001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "secret"}'
```

### 2. Crear Categoría
```bash
curl -X POST http://localhost:8001/api/v1/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -d '{"name": "Platos de Fondo", "description": "Platos principales"}'
```

### 3. Crear Platillo
```bash
curl -X POST http://localhost:8001/api/v1/menu-items \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -d '{"name": "Lomo Saltado", "price": 35.00, "category_id": 1}'
```

### 4. Crear Pedido
```bash
curl -X POST http://localhost:8001/api/v1/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -d '{"table_number": 3, "customer_name": "Pedro", "items": [{"menu_item_id": 1, "quantity": 2}]}'
```
