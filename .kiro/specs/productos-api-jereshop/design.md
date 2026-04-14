# Design Document: API de Productos Jereshop

## Overview

La API de productos de Jereshop es un servicio REST que gestiona un catálogo de celulares. Proporciona endpoints para operaciones CRUD (Create, Read, Update, Delete) sobre productos, cada uno con información básica: nombre, precio, imagen y enlace de WhatsApp para contacto directo.

El sistema está construido sobre Node.js con Express 5.2.1 y utiliza una base de datos relacional para persistencia. La arquitectura sigue el patrón de capas separando rutas, controladores, servicios y acceso a datos, facilitando mantenibilidad y testing.

El diseño prioriza:
- Validación robusta de datos de entrada
- Manejo consistente de errores con códigos HTTP apropiados
- Persistencia confiable en base de datos
- Compatibilidad CORS para consumo desde frontend
- Simplicidad en la estructura para facilitar extensiones futuras

## Architecture

### Layered Architecture

El sistema implementa una arquitectura de 4 capas:

```
┌─────────────────────────────────────┐
│         Routes Layer                │  Express routes, HTTP handling
├─────────────────────────────────────┤
│       Controllers Layer             │  Request validation, response formatting
├─────────────────────────────────────┤
│        Services Layer               │  Business logic, data transformation
├─────────────────────────────────────┤
│      Data Access Layer              │  Database queries, connection management
└─────────────────────────────────────┘
```

### Technology Stack

- Runtime: Node.js
- Framework: Express 5.2.1
- Database: SQLite (simple, file-based, no servidor externo requerido)
- Database Client: better-sqlite3 (síncrono, más simple que async drivers)

### Project Structure

```
backend/
├── src/
│   ├── app.js                 # Express app setup, middleware
│   ├── server.js              # Server startup
│   ├── routes/
│   │   └── products.js        # Product endpoints
│   ├── controllers/
│   │   └── productController.js  # Request handlers
│   ├── services/
│   │   └── productService.js     # Business logic
│   ├── db/
│   │   ├── connection.js      # Database connection
│   │   └── productRepository.js  # Data access
│   ├── middleware/
│   │   ├── errorHandler.js    # Global error handling
│   │   └── validator.js       # Input validation
│   └── utils/
│       └── validators.js      # Validation helpers
database/
└── schema.sql                 # Database schema
```

## Components and Interfaces

### 1. Routes Layer (`routes/products.js`)

Define los endpoints REST y mapea a controladores:

```javascript
// GET /api/products - List all products
// GET /api/products/:id - Get single product
// POST /api/products - Create product
// PUT /api/products/:id - Update product
// DELETE /api/products/:id - Delete product
```

### 2. Controllers Layer (`controllers/productController.js`)

Maneja requests HTTP, valida entrada, invoca servicios y formatea respuestas:

```javascript
interface ProductController {
  getAllProducts(req, res, next): void
  getProductById(req, res, next): void
  createProduct(req, res, next): void
  updateProduct(req, res, next): void
  deleteProduct(req, res, next): void
}
```

Responsabilidades:
- Extraer parámetros de request (body, params, query)
- Validar formato de entrada usando middleware
- Invocar servicios de negocio
- Formatear respuestas con códigos HTTP apropiados
- Pasar errores al error handler

### 3. Services Layer (`services/productService.js`)

Implementa lógica de negocio y transformaciones:

```javascript
interface ProductService {
  getAllProducts(): Product[]
  getProductById(id: number): Product | null
  createProduct(productData: ProductInput): Product
  updateProduct(id: number, productData: Partial<ProductInput>): Product | null
  deleteProduct(id: number): boolean
}
```

Responsabilidades:
- Validación de reglas de negocio (precio positivo, formato WhatsApp)
- Transformación de datos entre capas
- Coordinación de operaciones de repositorio
- Lanzar errores de negocio específicos

### 4. Data Access Layer (`db/productRepository.js`)

Encapsula acceso a base de datos:

```javascript
interface ProductRepository {
  findAll(): Product[]
  findById(id: number): Product | null
  create(product: ProductInput): Product
  update(id: number, product: Partial<ProductInput>): Product | null
  delete(id: number): boolean
}
```

Responsabilidades:
- Ejecutar queries SQL
- Mapear resultados a objetos Product
- Manejar errores de base de datos
- Gestionar transacciones si es necesario

### 5. Middleware

#### Error Handler (`middleware/errorHandler.js`)

Middleware global para manejo consistente de errores:

```javascript
interface ErrorHandler {
  (err: Error, req: Request, res: Response, next: NextFunction): void
}
```

Mapea errores a respuestas HTTP:
- ValidationError → 400
- NotFoundError → 404
- DatabaseError → 500
- Error genérico → 500

#### Validator (`middleware/validator.js`)

Middleware para validación de entrada:

```javascript
interface Validator {
  validateProductCreate(req, res, next): void
  validateProductUpdate(req, res, next): void
  validateIdParam(req, res, next): void
}
```

### 6. Database Connection (`db/connection.js`)

Gestiona conexión a SQLite:

```javascript
interface DatabaseConnection {
  getDb(): Database
  initialize(): void
  close(): void
}
```

## Data Models

### Product Entity

Representa un celular en el catálogo:

```javascript
interface Product {
  id: number              // Auto-incremental, primary key
  name: string            // Nombre del celular, required, non-empty
  price: number           // Precio en unidad monetaria, required, > 0
  image_url: string       // URL de imagen, required, non-empty
  whatsapp_link: string   // URL de WhatsApp, required, formato específico
}
```

### ProductInput

Datos para crear/actualizar producto (sin id):

```javascript
interface ProductInput {
  name: string
  price: number
  image_url: string
  whatsapp_link: string
}
```

### Database Schema

```sql
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  price REAL NOT NULL CHECK(price > 0),
  image_url TEXT NOT NULL,
  whatsapp_link TEXT NOT NULL
);
```

### Error Response Format

```javascript
interface ErrorResponse {
  error: string           // Mensaje descriptivo del error
  details?: string[]      // Detalles adicionales (ej: campos inválidos)
}
```

### Success Response Formats

List products:
```javascript
{
  products: Product[]
}
```

Single product:
```javascript
Product
```

Create/Update product:
```javascript
Product  // Incluye id generado
```

Delete product:
```javascript
{
  message: string
}
```

### Validation Rules

1. **name**: 
   - Type: string
   - Required: yes
   - Constraints: non-empty after trim, max 200 chars

2. **price**:
   - Type: number
   - Required: yes
   - Constraints: > 0, finite

3. **image_url**:
   - Type: string
   - Required: yes
   - Constraints: non-empty after trim, max 500 chars

4. **whatsapp_link**:
   - Type: string
   - Required: yes
   - Constraints: must start with "https://wa.me/", max 500 chars


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Product Creation Round-Trip

*For any* valid product data (name, price, image_url, whatsapp_link), when creating a product via POST /api/products and then retrieving it via GET /api/products/:id, the retrieved product should contain the same data with an assigned id.

**Validates: Requirements 3.2, 3.3, 2.2**

### Property 2: Product List Completeness

*For any* set of products created in the database, when calling GET /api/products, the response should be a JSON array containing all created products with all required fields (id, name, price, image_url, whatsapp_link).

**Validates: Requirements 1.2, 1.4, 1.5**

### Property 3: Product Update Persistence

*For any* existing product and valid update data, when updating via PUT /api/products/:id, the updated product should be retrievable via GET /api/products/:id with the modified fields reflected and unmodified fields preserved.

**Validates: Requirements 4.2, 4.3**

### Property 4: Partial Update Preservation

*For any* existing product, when updating via PUT /api/products/:id with only a subset of fields, only the provided fields should be modified and all other fields should remain unchanged.

**Validates: Requirements 4.5**

### Property 5: Product Deletion Removal

*For any* existing product, when deleting via DELETE /api/products/:id, subsequent attempts to retrieve that product via GET /api/products/:id should return HTTP status 404, and the product should not appear in GET /api/products list.

**Validates: Requirements 5.2, 5.3**

### Property 6: Non-Existent ID Returns 404

*For any* non-existent product ID, when calling GET /api/products/:id, PUT /api/products/:id, or DELETE /api/products/:id, the API should return HTTP status 404 with an error message in JSON format.

**Validates: Requirements 2.3, 4.4, 5.4**

### Property 7: Invalid ID Format Returns 400

*For any* invalid ID format (non-numeric, negative, or non-integer), when calling GET /api/products/:id, the API should return HTTP status 400 with an error message.

**Validates: Requirements 2.4**

### Property 8: Required Fields Validation

*For any* product creation or update request missing required fields (name, price, image_url, whatsapp_link), the API should return HTTP status 400 with an error message indicating which fields are required.

**Validates: Requirements 3.4, 3.5**

### Property 9: Price Validation

*For any* product creation or update request where price is not a positive number (zero, negative, or non-numeric), the API should return HTTP status 400 with an error message.

**Validates: Requirements 3.6, 4.6, 9.2**

### Property 10: Name Validation

*For any* product creation or update request where name is empty or contains only whitespace, the API should return HTTP status 400 with an error message.

**Validates: Requirements 9.1**

### Property 11: Image URL Validation

*For any* product creation or update request where image_url is empty or contains only whitespace, the API should return HTTP status 400 with an error message.

**Validates: Requirements 9.3**

### Property 12: WhatsApp Link Format Validation

*For any* product creation or update request where whatsapp_link does not start with "https://wa.me/", the API should return HTTP status 400 with an error message.

**Validates: Requirements 7.3, 7.4, 9.4**

### Property 13: WhatsApp Link Preservation

*For any* valid WhatsApp link including query parameters, when creating a product and then retrieving it, the whatsapp_link should be preserved exactly including all query parameters.

**Validates: Requirements 7.1, 7.2**

### Property 14: Persistence Across Restarts

*For any* set of products created before server restart, after restarting the API server, all products should still be retrievable via GET /api/products with all data intact.

**Validates: Requirements 6.2**

### Property 15: Error Response Format Consistency

*For any* error condition (validation error, not found, server error), the API should return a JSON response with an "error" field containing a descriptive message and the appropriate HTTP status code (400 for validation, 404 for not found, 500 for server errors).

**Validates: Requirements 8.1, 8.2, 9.5**

### Property 16: CORS Headers Presence

*For any* request to the API, the response should include appropriate CORS headers allowing cross-origin requests.

**Validates: Requirements 10.3**

## Error Handling

### Error Categories

1. **Validation Errors (400)**
   - Missing required fields
   - Invalid data types
   - Invalid data formats (WhatsApp link, price)
   - Empty or whitespace-only strings

2. **Not Found Errors (404)**
   - Product ID does not exist
   - Invalid resource path

3. **Server Errors (500)**
   - Database connection failures
   - Unexpected exceptions
   - Query execution errors

### Error Response Structure

All errors return JSON with consistent structure:

```javascript
{
  error: "Descriptive error message",
  details: ["Optional array of specific issues"]  // For validation errors
}
```

### Error Handling Strategy

1. **Validation Layer**: Middleware validates input before reaching controllers
   - Catches format/type errors early
   - Returns 400 with specific field errors
   - Prevents invalid data from reaching business logic

2. **Service Layer**: Business logic validation
   - Throws custom error classes (ValidationError, NotFoundError)
   - Provides detailed error messages
   - Maintains separation from HTTP concerns

3. **Global Error Handler**: Catches all errors
   - Maps error types to HTTP status codes
   - Formats consistent error responses
   - Logs errors for debugging
   - Prevents error details leakage in production

4. **Database Layer**: Wraps database errors
   - Catches SQLite errors
   - Converts to application errors
   - Logs database issues
   - Returns 500 for database failures

### Logging Strategy

- All errors logged to console with timestamp
- Include request details (method, path, body)
- Log stack traces for 500 errors
- Sanitize sensitive data before logging

## Testing Strategy

### Dual Testing Approach

This feature requires both unit tests and property-based tests for comprehensive coverage:

- **Unit tests**: Verify specific examples, edge cases, and error conditions
- **Property-based tests**: Verify universal properties across randomized inputs

Both approaches are complementary and necessary. Unit tests catch concrete bugs and validate specific scenarios, while property-based tests verify general correctness across a wide input space.

### Property-Based Testing

**Library**: fast-check (JavaScript property-based testing library)

**Configuration**:
- Minimum 100 iterations per property test
- Each test must reference its design document property
- Tag format: `// Feature: productos-api-jereshop, Property {number}: {property_text}`

**Test Organization**:
```
backend/
└── tests/
    ├── properties/
    │   ├── product-crud.properties.test.js
    │   ├── validation.properties.test.js
    │   └── persistence.properties.test.js
    └── unit/
        ├── controllers/
        ├── services/
        └── repositories/
```

**Property Test Examples**:

1. **Property 1 - Product Creation Round-Trip**:
   - Generate random valid product data
   - POST to create product
   - GET by returned id
   - Assert all fields match

2. **Property 9 - Price Validation**:
   - Generate random invalid prices (negative, zero, NaN, strings)
   - POST/PUT with invalid price
   - Assert 400 response with error message

3. **Property 13 - WhatsApp Link Preservation**:
   - Generate random WhatsApp links with various query params
   - Create product with link
   - Retrieve product
   - Assert link exactly matches including query string

### Unit Testing

**Library**: Jest (JavaScript testing framework)

**Focus Areas**:
- Specific examples demonstrating correct behavior
- Edge cases (empty database, empty strings, boundary values)
- Error conditions (database failures, malformed requests)
- Integration between layers (routes → controllers → services → repository)

**Unit Test Examples**:

1. **Empty Database Edge Case**:
   - Clear database
   - GET /api/products
   - Assert empty array with 200 status

2. **CORS Configuration**:
   - Make request to any endpoint
   - Assert CORS headers present in response

3. **Partial Update Example**:
   - Create product with all fields
   - Update only price field
   - Assert only price changed, other fields unchanged

### Test Data Generation

For property-based tests, use fast-check arbitraries:

```javascript
const productArbitrary = fc.record({
  name: fc.string({ minLength: 1, maxLength: 200 }),
  price: fc.double({ min: 0.01, max: 999999, noNaN: true }),
  image_url: fc.webUrl(),
  whatsapp_link: fc.string().map(text => 
    `https://wa.me/1234567890?text=${encodeURIComponent(text)}`
  )
});
```

### Integration Testing

Test complete request/response cycles:
- Start test server with in-memory database
- Execute HTTP requests using supertest
- Verify responses and database state
- Clean up between tests

### Coverage Goals

- Line coverage: > 80%
- Branch coverage: > 75%
- Property tests: All 16 properties implemented
- Unit tests: All edge cases and error conditions covered

### Continuous Testing

- Run unit tests on every commit
- Run property tests on every commit (with 100 iterations)
- Run integration tests before merge to main
- Monitor test execution time (property tests may be slower)

