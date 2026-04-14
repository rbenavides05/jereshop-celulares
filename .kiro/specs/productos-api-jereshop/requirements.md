# Requirements Document

## Introduction

Este documento define los requisitos para la API de productos de Jereshop, un catálogo de celulares. La API permitirá gestionar productos con información básica (nombre, precio, imagen, enlace de WhatsApp) y proporcionará endpoints REST para operaciones CRUD. El frontend consumirá esta API para mostrar el catálogo y permitir contacto directo vía WhatsApp.

## Glossary

- **API**: El sistema backend que expone endpoints REST para gestionar productos
- **Product**: Entidad que representa un celular en el catálogo con nombre, precio, imagen y enlace de WhatsApp
- **Database**: Sistema de almacenamiento persistente para los productos
- **Frontend**: Aplicación cliente que consume la API para mostrar productos
- **WhatsApp_Link**: URL formateada que abre WhatsApp con un mensaje predefinido

## Requirements

### Requirement 1: Listar Productos

**User Story:** Como desarrollador del frontend, quiero obtener la lista completa de productos, para que pueda mostrar el catálogo de celulares a los usuarios.

#### Acceptance Criteria

1. THE API SHALL provide a GET endpoint at /api/products that returns all products
2. WHEN the GET /api/products endpoint is called, THE API SHALL return a JSON array of Product objects
3. WHEN the GET /api/products endpoint is called and no products exist, THE API SHALL return an empty array with HTTP status 200
4. THE API SHALL include the following fields in each Product object: id, name, price, image_url, whatsapp_link
5. WHEN the GET /api/products endpoint is called, THE API SHALL return HTTP status 200 on success

### Requirement 2: Obtener Producto Individual

**User Story:** Como desarrollador del frontend, quiero obtener los detalles de un producto específico, para que pueda mostrar información detallada cuando sea necesario.

#### Acceptance Criteria

1. THE API SHALL provide a GET endpoint at /api/products/:id that returns a single product
2. WHEN the GET /api/products/:id endpoint is called with a valid product ID, THE API SHALL return the Product object with HTTP status 200
3. IF the product ID does not exist, THEN THE API SHALL return HTTP status 404 with an error message
4. IF the product ID format is invalid, THEN THE API SHALL return HTTP status 400 with an error message

### Requirement 3: Crear Producto

**User Story:** Como administrador del catálogo, quiero agregar nuevos productos al sistema, para que pueda mantener el catálogo actualizado con nuevos celulares.

#### Acceptance Criteria

1. THE API SHALL provide a POST endpoint at /api/products that creates a new product
2. WHEN the POST /api/products endpoint is called with valid product data, THE API SHALL create the product in the Database and return HTTP status 201
3. WHEN a product is created, THE API SHALL return the created Product object including the generated id
4. IF required fields are missing, THEN THE API SHALL return HTTP status 400 with an error message indicating which fields are required
5. THE API SHALL require the following fields for product creation: name, price, image_url, whatsapp_link
6. IF the price value is not a positive number, THEN THE API SHALL return HTTP status 400 with an error message

### Requirement 4: Actualizar Producto

**User Story:** Como administrador del catálogo, quiero modificar la información de productos existentes, para que pueda corregir errores o actualizar precios e imágenes.

#### Acceptance Criteria

1. THE API SHALL provide a PUT endpoint at /api/products/:id that updates an existing product
2. WHEN the PUT /api/products/:id endpoint is called with valid product data, THE API SHALL update the product in the Database and return HTTP status 200
3. WHEN a product is updated, THE API SHALL return the updated Product object
4. IF the product ID does not exist, THEN THE API SHALL return HTTP status 404 with an error message
5. THE API SHALL allow partial updates where only provided fields are modified
6. IF the price value is provided and is not a positive number, THEN THE API SHALL return HTTP status 400 with an error message

### Requirement 5: Eliminar Producto

**User Story:** Como administrador del catálogo, quiero eliminar productos del sistema, para que pueda remover celulares que ya no están disponibles.

#### Acceptance Criteria

1. THE API SHALL provide a DELETE endpoint at /api/products/:id that removes a product
2. WHEN the DELETE /api/products/:id endpoint is called with a valid product ID, THE API SHALL remove the product from the Database and return HTTP status 200
3. WHEN a product is deleted, THE API SHALL return a confirmation message
4. IF the product ID does not exist, THEN THE API SHALL return HTTP status 404 with an error message

### Requirement 6: Persistencia de Datos

**User Story:** Como administrador del sistema, quiero que los productos se almacenen de forma persistente, para que la información no se pierda cuando el servidor se reinicie.

#### Acceptance Criteria

1. THE API SHALL store all Product data in the Database
2. WHEN the API server restarts, THE API SHALL retrieve existing products from the Database
3. THE Database SHALL maintain data integrity for all CRUD operations
4. THE Database SHALL use a schema that supports the Product fields: id, name, price, image_url, whatsapp_link

### Requirement 7: Formato de Enlace de WhatsApp

**User Story:** Como usuario del catálogo, quiero que cada producto tenga un enlace de WhatsApp funcional, para que pueda contactar fácilmente sobre el producto que me interesa.

#### Acceptance Criteria

1. THE API SHALL accept WhatsApp_Link values in the format: https://wa.me/[phone_number]?text=[encoded_message]
2. WHEN storing a WhatsApp_Link, THE API SHALL preserve the complete URL including query parameters
3. THE API SHALL validate that WhatsApp_Link values start with https://wa.me/
4. IF the WhatsApp_Link format is invalid, THEN THE API SHALL return HTTP status 400 with an error message

### Requirement 8: Manejo de Errores

**User Story:** Como desarrollador del frontend, quiero recibir mensajes de error claros y consistentes, para que pueda manejar errores apropiadamente en la interfaz de usuario.

#### Acceptance Criteria

1. WHEN an error occurs, THE API SHALL return a JSON response with an error field containing a descriptive message
2. THE API SHALL use appropriate HTTP status codes for different error types: 400 for validation errors, 404 for not found, 500 for server errors
3. IF a database operation fails, THEN THE API SHALL return HTTP status 500 with an error message
4. THE API SHALL log all errors to the console for debugging purposes

### Requirement 9: Validación de Datos

**User Story:** Como administrador del sistema, quiero que la API valide los datos de entrada, para que se mantenga la integridad de la información en el catálogo.

#### Acceptance Criteria

1. WHEN creating or updating a product, THE API SHALL validate that name is a non-empty string
2. WHEN creating or updating a product, THE API SHALL validate that price is a positive number
3. WHEN creating or updating a product, THE API SHALL validate that image_url is a non-empty string
4. WHEN creating or updating a product, THE API SHALL validate that whatsapp_link follows the WhatsApp URL format
5. IF any validation fails, THEN THE API SHALL return HTTP status 400 with a specific error message for each invalid field

### Requirement 10: Configuración CORS

**User Story:** Como desarrollador del frontend, quiero que la API permita solicitudes desde el frontend, para que pueda consumir los endpoints sin problemas de CORS.

#### Acceptance Criteria

1. THE API SHALL enable CORS to allow requests from the Frontend
2. THE API SHALL accept requests with Content-Type application/json
3. THE API SHALL include appropriate CORS headers in all responses
