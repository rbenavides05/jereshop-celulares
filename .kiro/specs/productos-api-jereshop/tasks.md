# Implementation Plan: API de Productos Jereshop

## Overview

Este plan implementa una API REST para gestionar productos de celulares con operaciones CRUD completas. La arquitectura sigue un patrón de 4 capas (Routes → Controllers → Services → Data Access) usando Node.js, Express 5.2.1 y SQLite con better-sqlite3. Se incluyen validaciones robustas, manejo de errores consistente, y testing dual (property-based + unit tests).

## Tasks

- [x] 1. Configurar dependencias y estructura base del proyecto
  - Instalar dependencias: better-sqlite3, cors
  - Instalar dependencias de desarrollo: jest, supertest, fast-check, @types/jest
  - Crear estructura de directorios (routes, controllers, services, db, middleware, utils, tests)
  - _Requirements: 6.1, 6.4, 10.1_

- [x] 2. Implementar capa de base de datos y conexión
  - [ ] 2.1 Crear módulo de conexión a SQLite
    - Implementar `db/connection.js` con funciones getDb(), initialize(), close()
    - Crear base de datos en `database/jereshop.db`
    - Ejecutar schema.sql para crear tabla products
    - _Requirements: 6.1, 6.2, 6.4_
  
  - [ ] 2.2 Implementar repositorio de productos
    - Crear `db/productRepository.js` con métodos: findAll(), findById(), create(), update(), delete()
    - Implementar queries SQL usando better-sqlite3
    - Manejar errores de base de datos
    - _Requirements: 1.1, 2.1, 3.1, 4.1, 5.1, 6.3_
  
  - [ ]* 2.3 Escribir tests unitarios para repositorio
    - Test findAll() con base de datos vacía
    - Test create() y verificar datos insertados
    - Test findById() con ID existente y no existente
    - Test update() y delete()
    - _Requirements: 6.3_

- [ ] 3. Implementar capa de servicios y validación
  - [ ] 3.1 Crear utilidades de validación
    - Implementar `utils/validators.js` con funciones: isValidName(), isValidPrice(), isValidImageUrl(), isValidWhatsAppLink()
    - Validar formato de WhatsApp link (debe empezar con https://wa.me/)
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 7.3_
  
  - [ ] 3.2 Implementar servicio de productos
    - Crear `services/productService.js` con métodos: getAllProducts(), getProductById(), createProduct(), updateProduct(), deleteProduct()
    - Aplicar validaciones de negocio usando validators.js
    - Lanzar errores personalizados (ValidationError, NotFoundError)
    - _Requirements: 1.2, 2.2, 3.2, 4.2, 5.2, 9.5_
  
  - [ ]* 3.3 Escribir property test para validación de precio
    - **Property 9: Price Validation**
    - **Validates: Requirements 3.6, 4.6, 9.2**
    - Generar precios inválidos (negativos, cero, NaN, strings)
    - Verificar que createProduct() y updateProduct() lancen ValidationError
    - _Requirements: 3.6, 4.6, 9.2_
  
  - [ ]* 3.4 Escribir property test para validación de WhatsApp link
    - **Property 12: WhatsApp Link Format Validation**
    - **Validates: Requirements 7.3, 7.4, 9.4**
    - Generar links inválidos (sin https://wa.me/, formatos incorrectos)
    - Verificar que createProduct() y updateProduct() lancen ValidationError
    - _Requirements: 7.3, 7.4, 9.4_
  
  - [ ]* 3.5 Escribir tests unitarios para servicio
    - Test getAllProducts() con múltiples productos
    - Test getProductById() con ID no existente (debe lanzar NotFoundError)
    - Test createProduct() con datos válidos
    - Test updateProduct() con actualización parcial
    - Test deleteProduct() con ID no existente
    - _Requirements: 1.2, 2.3, 3.2, 4.4, 5.4_

- [ ] 4. Checkpoint - Verificar capa de datos y servicios
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 5. Implementar middleware de validación y manejo de errores
  - [ ] 5.1 Crear middleware de validación de entrada
    - Implementar `middleware/validator.js` con: validateProductCreate(), validateProductUpdate(), validateIdParam()
    - Validar tipos de datos y campos requeridos
    - Retornar 400 con detalles de campos inválidos
    - _Requirements: 3.4, 3.5, 9.5, 2.4_
  
  - [ ] 5.2 Crear middleware de manejo de errores global
    - Implementar `middleware/errorHandler.js`
    - Mapear tipos de error a códigos HTTP: ValidationError → 400, NotFoundError → 404, DatabaseError → 500
    - Formatear respuestas de error consistentes con campo "error"
    - Logging de errores a consola
    - _Requirements: 8.1, 8.2, 8.3, 8.4_
  
  - [ ]* 5.3 Escribir property test para formato de respuesta de error
    - **Property 15: Error Response Format Consistency**
    - **Validates: Requirements 8.1, 8.2, 9.5**
    - Generar diferentes tipos de errores (validación, not found, server)
    - Verificar que todas las respuestas tengan campo "error" y código HTTP apropiado
    - _Requirements: 8.1, 8.2, 9.5_

- [ ] 6. Implementar capa de controladores
  - [ ] 6.1 Crear controlador de productos
    - Implementar `controllers/productController.js` con: getAllProducts(), getProductById(), createProduct(), updateProduct(), deleteProduct()
    - Extraer parámetros de req (body, params)
    - Invocar servicios y formatear respuestas HTTP
    - Pasar errores a next() para error handler
    - _Requirements: 1.2, 1.5, 2.2, 3.2, 3.3, 4.2, 4.3, 5.2, 5.3_
  
  - [ ]* 6.2 Escribir tests unitarios para controladores
    - Test getAllProducts() retorna array con status 200
    - Test getProductById() con ID válido retorna producto con status 200
    - Test createProduct() retorna producto creado con status 201
    - Test updateProduct() retorna producto actualizado con status 200
    - Test deleteProduct() retorna mensaje de confirmación con status 200
    - Mock de servicios para aislar controladores
    - _Requirements: 1.5, 2.2, 3.2, 4.2, 5.2_

- [ ] 7. Implementar capa de rutas y configurar Express
  - [ ] 7.1 Crear rutas de productos
    - Implementar `routes/products.js` con endpoints: GET /api/products, GET /api/products/:id, POST /api/products, PUT /api/products/:id, DELETE /api/products/:id
    - Aplicar middleware de validación a cada ruta
    - Conectar rutas con controladores
    - _Requirements: 1.1, 2.1, 3.1, 4.1, 5.1_
  
  - [ ] 7.2 Actualizar app.js con configuración completa
    - Configurar CORS middleware
    - Configurar express.json() para parsing de JSON
    - Montar rutas de productos en /api/products
    - Aplicar error handler global al final
    - _Requirements: 10.1, 10.2, 10.3_
  
  - [ ] 7.3 Crear server.js para inicialización
    - Separar inicialización de servidor de app.js
    - Inicializar base de datos antes de iniciar servidor
    - Manejar señales de cierre (SIGINT, SIGTERM) para cerrar DB
    - _Requirements: 6.2_

- [ ] 8. Implementar property tests de integración CRUD
  - [ ]* 8.1 Property test: Product Creation Round-Trip
    - **Property 1: Product Creation Round-Trip**
    - **Validates: Requirements 3.2, 3.3, 2.2**
    - Generar datos de producto válidos aleatorios
    - POST /api/products y luego GET /api/products/:id
    - Verificar que datos coincidan exactamente
    - _Requirements: 3.2, 3.3, 2.2_
  
  - [ ]* 8.2 Property test: Product List Completeness
    - **Property 2: Product List Completeness**
    - **Validates: Requirements 1.2, 1.4, 1.5**
    - Crear conjunto aleatorio de productos
    - GET /api/products
    - Verificar que todos los productos creados estén en la respuesta con todos los campos
    - _Requirements: 1.2, 1.4, 1.5_
  
  - [ ]* 8.3 Property test: Product Update Persistence
    - **Property 3: Product Update Persistence**
    - **Validates: Requirements 4.2, 4.3**
    - Crear producto, generar datos de actualización aleatorios
    - PUT /api/products/:id y luego GET /api/products/:id
    - Verificar que cambios se reflejen correctamente
    - _Requirements: 4.2, 4.3_
  
  - [ ]* 8.4 Property test: Partial Update Preservation
    - **Property 4: Partial Update Preservation**
    - **Validates: Requirements 4.5**
    - Crear producto, actualizar solo un subconjunto de campos
    - Verificar que solo campos proporcionados cambien
    - _Requirements: 4.5_
  
  - [ ]* 8.5 Property test: Product Deletion Removal
    - **Property 5: Product Deletion Removal**
    - **Validates: Requirements 5.2, 5.3**
    - Crear producto, DELETE /api/products/:id
    - Verificar que GET retorne 404 y no aparezca en lista
    - _Requirements: 5.2, 5.3_
  
  - [ ]* 8.6 Property test: Non-Existent ID Returns 404
    - **Property 6: Non-Existent ID Returns 404**
    - **Validates: Requirements 2.3, 4.4, 5.4**
    - Generar IDs no existentes aleatorios
    - Probar GET, PUT, DELETE con esos IDs
    - Verificar que todos retornen 404
    - _Requirements: 2.3, 4.4, 5.4_
  
  - [ ]* 8.7 Property test: Invalid ID Format Returns 400
    - **Property 7: Invalid ID Format Returns 400**
    - **Validates: Requirements 2.4**
    - Generar IDs inválidos (strings, negativos, decimales)
    - GET /api/products/:id con IDs inválidos
    - Verificar que retorne 400
    - _Requirements: 2.4_
  
  - [ ]* 8.8 Property test: Required Fields Validation
    - **Property 8: Required Fields Validation**
    - **Validates: Requirements 3.4, 3.5**
    - Generar requests con campos faltantes aleatorios
    - POST /api/products con datos incompletos
    - Verificar que retorne 400 indicando campos requeridos
    - _Requirements: 3.4, 3.5_
  
  - [ ]* 8.9 Property test: Name Validation
    - **Property 10: Name Validation**
    - **Validates: Requirements 9.1**
    - Generar nombres inválidos (vacíos, solo espacios)
    - POST/PUT con nombres inválidos
    - Verificar que retorne 400
    - _Requirements: 9.1_
  
  - [ ]* 8.10 Property test: Image URL Validation
    - **Property 11: Image URL Validation**
    - **Validates: Requirements 9.3**
    - Generar image_url inválidos (vacíos, solo espacios)
    - POST/PUT con image_url inválidos
    - Verificar que retorne 400
    - _Requirements: 9.3_
  
  - [ ]* 8.11 Property test: WhatsApp Link Preservation
    - **Property 13: WhatsApp Link Preservation**
    - **Validates: Requirements 7.1, 7.2**
    - Generar WhatsApp links con query parameters aleatorios
    - Crear producto y recuperarlo
    - Verificar que link se preserve exactamente incluyendo query params
    - _Requirements: 7.1, 7.2_
  
  - [ ]* 8.12 Property test: CORS Headers Presence
    - **Property 16: CORS Headers Presence**
    - **Validates: Requirements 10.3**
    - Hacer requests a diferentes endpoints
    - Verificar que todos incluyan headers CORS apropiados
    - _Requirements: 10.3_

- [ ] 9. Implementar tests de integración end-to-end
  - [ ]* 9.1 Test de integración: Flujo completo CRUD
    - Iniciar servidor de test con base de datos en memoria
    - Crear producto → Listar productos → Obtener por ID → Actualizar → Eliminar
    - Verificar cada paso con supertest
    - _Requirements: 1.1, 2.1, 3.1, 4.1, 5.1_
  
  - [ ]* 9.2 Test de integración: Persistencia tras reinicio
    - **Property 14: Persistence Across Restarts**
    - **Validates: Requirements 6.2**
    - Crear productos, cerrar conexión DB, reinicializar
    - Verificar que productos sigan disponibles
    - _Requirements: 6.2_
  
  - [ ]* 9.3 Test de integración: Manejo de errores de base de datos
    - Simular fallo de base de datos
    - Verificar que API retorne 500 con mensaje de error
    - _Requirements: 8.2, 8.3_
  
  - [ ]* 9.4 Test de integración: Base de datos vacía
    - Limpiar base de datos completamente
    - GET /api/products
    - Verificar que retorne array vacío con status 200
    - _Requirements: 1.3_

- [ ] 10. Checkpoint final - Verificar implementación completa
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 11. Configurar scripts de testing en package.json
  - Agregar script "test" para ejecutar Jest
  - Agregar script "test:unit" para tests unitarios
  - Agregar script "test:properties" para property tests
  - Agregar script "test:integration" para tests de integración
  - Configurar Jest con coverage
  - _Requirements: All_

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Property tests validate universal correctness properties with 100+ iterations
- Unit tests validate specific examples and edge cases
- Integration tests verify end-to-end flows
- Checkpoints ensure incremental validation
- All property tests must include tags: `// Feature: productos-api-jereshop, Property {N}: {title}`
- Use supertest for HTTP testing and fast-check for property-based testing
- Database should be SQLite file at `database/jereshop.db`
