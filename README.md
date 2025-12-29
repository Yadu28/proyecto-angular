# Platzi Store - E-commerce Angular Application

Una aplicación de comercio electrónico moderna desarrollada con Angular 21, integrada con la Platzi Fake Store API.

![Angular](https://img.shields.io/badge/Angular-21.0-red)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![SCSS](https://img.shields.io/badge/SCSS-Custom-pink)

##  Demo en Vivo

**URL de Vercel:** [Próximamente]

##  Descripción

 e-commerce que permite a los usuarios:
-  Autenticación con JWT 
-  CRUD completo de productos
-  Carrito de compras con LocalStorage
-  Búsqueda y filtrado de productos


##  Tecnologías Utilizadas

- **Framework:** Angular 21
- **Lenguaje:** TypeScript 5.9
- **Estilos:** CSS 
- **HTTP Client:** Angular HttpClient
- **Formularios:** Reactive Forms
- **Routing:** Angular Router
- **API:** [Platzi Fake Store API](https://fakeapi.platzi.com)

##  Características Principales

### 1. Autenticación JWT
- Login con email y contraseña
- Token almacenado en LocalStorage
- AuthGuard para proteger rutas privadas


### 2. CRUD de Productos
- **Listar:** Vista de todos los productos 
- **Crear:** Formulario con validaciones
- **Editar:** Reutilización del mismo formulario
- **Eliminar:** Confirmación antes de eliminar
- **Buscar:** Filtrado por nombre y descripción
- **Categorías:** Filtrado por categoría

### 3. Carrito de Compras
- Agregar productos al carrito
- Eliminar productos
- Calcular totales
- Persistencia en LocalStorage


### 4. Diseño 
- Animaciones suaves y transiciones
- Notificaciones toastr 
- Responsivo 


##  Arquitectura del Proyecto

```
src/
├── app/
│   ├── core/                      
│   │   ├── guards/
│   │   │   └── auth.guard.ts      # Guard de autenticación
│   │   ├── interceptors/
│   │   │   └── auth.interceptor.ts # Interceptor HTTP
│   │   └── services/
│   │       ├── auth.service.ts    # Servicio de autenticación
│   │       ├── cart.service.ts    # Servicio del carrito
│   │       ├── product.service.ts # Servicio de productos
│   │       └── toast.service.ts   # Servicio de notificaciones
│   ├── features/                  
│   │   ├── auth/
│   │   │   ├── login.component.ts
│   │   │   ├── login.component.html
│   │   │   └── login.component.scss
│   │   ├── products/
│   │   │   ├── product-list.component.*
│   │   │   └── product-form.component.*
│   │   └── cart/
│   │       └── cart.component.*
│   ├── shared/                    # Componentes compartidos
│   │   └── components/
│   │       └── toast/
│   ├── app.config.ts              
│   ├── app.routes.ts              
│   └── app.ts                     
├── styles.scss                    
└── index.html                     
```

##  Instalación y Configuración

### Prerrequisitos

- Node.js (versión 18 o superior)
- npm (versión 9 o superior)

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone [URL-DEL-REPO]
cd proyecto-angular
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Ejecutar en modo desarrollo**
```bash
ng serve
```

Puerto asignado `http://localhost:4200`

##  Credenciales de Prueba

Para iniciar sesión:

- **Gmail:** `john@mail.com`
- **Password:** `changeme`


##  Para Producción

```bash
npm run build
```

##  Despliegue en Vercel



##  Testing

```bash
npm test
```

##  API Endpoints usados

### Autenticación
- `POST /api/v1/auth/login` - Login de usuario
- `GET /api/v1/auth/profile` - Perfil de usuario

### Productos
- `GET /api/v1/products` - Listar productos
- `GET /api/v1/products/:id` - Obtener producto
- `POST /api/v1/products` - Crear producto
- `PUT /api/v1/products/:id` - Actualizar producto
- `DELETE /api/v1/products/:id` - Eliminar producto

### Categorías
- `GET /api/v1/categories` - Listar categorías

