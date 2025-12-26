# Platzi Store - E-commerce Angular Application

Una aplicación de comercio electrónico moderna desarrollada con Angular 21, integrada con la Platzi Fake Store API.

![Angular](https://img.shields.io/badge/Angular-21.0-red)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![SCSS](https://img.shields.io/badge/SCSS-Custom-pink)

## 🚀 Demo en Vivo

**URL de Vercel:** [Próximamente]

## 📋 Descripción

Aplicación completa de e-commerce que permite a los usuarios:
- ✅ Autenticación con JWT (Login/Logout)
- ✅ CRUD completo de productos
- ✅ Carrito de compras con LocalStorage
- ✅ Búsqueda y filtrado de productos
- ✅ Diseño moderno y responsivo
- ✅ Notificaciones en tiempo real

## 🛠️ Tecnologías Utilizadas

- **Framework:** Angular 21
- **Lenguaje:** TypeScript 5.9
- **Estilos:** SCSS (sin librerías de UI)
- **HTTP Client:** Angular HttpClient
- **Formularios:** Reactive Forms
- **Routing:** Angular Router
- **API:** [Platzi Fake Store API](https://fakeapi.platzi.com)

## 📦 Características Principales

### 1. Autenticación JWT
- Login con email y contraseña
- Token almacenado en LocalStorage
- Interceptor HTTP para agregar token automáticamente
- AuthGuard para proteger rutas privadas
- Gestión de sesión de usuario

### 2. CRUD de Productos
- **Listar:** Vista en grid con paginación
- **Crear:** Formulario con validaciones reactivas
- **Editar:** Reutilización del mismo formulario
- **Eliminar:** Confirmación antes de eliminar
- **Buscar:** Filtrado por nombre y descripción
- **Categorías:** Filtrado por categoría

### 3. Carrito de Compras
- Agregar productos al carrito
- Modificar cantidades
- Eliminar productos
- Calcular totales
- Persistencia en LocalStorage
- Proceso de checkout

### 4. Diseño y UX
- Diseño moderno inspirado en [BeliBeli](https://dribbble.com/shots/22159545)
- Animaciones suaves y transiciones
- Notificaciones toast personalizadas
- Totalmente responsivo (Mobile, Tablet, Desktop)
- Dark mode en login

## 🏗️ Arquitectura del Proyecto

```
src/
├── app/
│   ├── core/                      # Funcionalidad core
│   │   ├── guards/
│   │   │   └── auth.guard.ts      # Guard de autenticación
│   │   ├── interceptors/
│   │   │   └── auth.interceptor.ts # Interceptor HTTP
│   │   └── services/
│   │       ├── auth.service.ts    # Servicio de autenticación
│   │       ├── cart.service.ts    # Servicio del carrito
│   │       ├── product.service.ts # Servicio de productos
│   │       └── toast.service.ts   # Servicio de notificaciones
│   ├── features/                  # Módulos de características
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
│   ├── app.config.ts              # Configuración de la app
│   ├── app.routes.ts              # Rutas de la aplicación
│   └── app.ts                     # Componente raíz
├── styles.scss                    # Estilos globales
└── index.html                     # HTML principal
```

## 🚦 Instalación y Configuración

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
npm start
```

La aplicación estará disponible en `http://localhost:4200`

## 🔑 Credenciales de Prueba

Para iniciar sesión, usa las siguientes credenciales:

- **Email:** `john@mail.com`
- **Password:** `changeme`

## 📖 Guía de Uso

### 1. Iniciar Sesión
1. Navega a `/login`
2. Ingresa las credenciales de prueba
3. Serás redirigido al catálogo de productos

### 2. Explorar Productos
- Usa la barra de búsqueda para filtrar por nombre
- Selecciona una categoría del dropdown
- Haz clic en un producto para ver más detalles
- Usa los botones de acción para editar o eliminar

### 3. Gestionar Productos
- **Crear:** Clic en "Nuevo Producto" → Llenar formulario
- **Editar:** Clic en el icono de edición → Modificar datos
- **Eliminar:** Clic en el icono de eliminar → Confirmar

### 4. Carrito de Compras
- Clic en "Agregar" en cualquier producto
- Accede al carrito desde el icono superior
- Modifica cantidades con +/-
- Procede al checkout o vacía el carrito

## 🏭 Construcción para Producción

```bash
npm run build
```

Los archivos compilados estarán en el directorio `dist/`.

## 🚀 Despliegue en Vercel

### Opción 1: CLI de Vercel

1. **Instalar Vercel CLI**
```bash
npm install -g vercel
```

2. **Iniciar sesión**
```bash
vercel login
```

3. **Desplegar**
```bash
vercel --prod
```

### Opción 2: Dashboard de Vercel

1. Sube el proyecto a GitHub
2. Importa el repositorio en [Vercel](https://vercel.com)
3. Configura el proyecto:
   - **Framework Preset:** Angular
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist/proyecto-angular/browser`
4. Despliega

### Configuración de Vercel

Crea un archivo `vercel.json` en la raíz:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist/proyecto-angular/browser",
  "framework": "angular",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

## 🧪 Testing

```bash
npm test
```

## 📝 Buenas Prácticas Implementadas

- ✅ **Arquitectura modular** - Separación por features
- ✅ **Servicios reutilizables** - Lógica desacoplada
- ✅ **Reactive Forms** - Validaciones robustas
- ✅ **Guards y interceptores** - Seguridad en rutas
- ✅ **Lazy Loading** - Carga optimizada de módulos
- ✅ **TypeScript strict** - Tipado fuerte
- ✅ **SCSS organizado** - Estilos mantenibles
- ✅ **Standalone Components** - Angular moderno
- ✅ **Signals-ready** - Preparado para el futuro

## 🔌 API Endpoints Utilizados

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

## 🎨 Paleta de Colores

```scss
$primary: #667eea;
$secondary: #764ba2;
$success: #48bb78;
$error: #f56565;
$warning: #ed8936;
$info: #4299e1;
$gray-50: #f7fafc;
$gray-100: #edf2f7;
$gray-200: #e2e8f0;
$gray-300: #cbd5e0;
$gray-400: #a0aec0;
$gray-500: #718096;
$gray-600: #4a5568;
$gray-700: #2d3748;
$gray-800: #1a202c;
```

## 📱 Responsive Breakpoints

- **Mobile:** < 640px
- **Tablet:** 640px - 1024px
- **Desktop:** > 1024px

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la [Licencia MIT](LICENSE).

## 👤 Autor

Desarrollado como parte del ejercicio de integración con Platzi Fake Store API.

## 🙏 Agradecimientos

- [Platzi](https://platzi.com) por la API de prueba
- [Angular Team](https://angular.io) por el framework
- Diseños inspirados en [Dribbble](https://dribbble.com)

## 📞 Soporte

Para soporte, contacta a [tu-email@ejemplo.com] o abre un issue en GitHub.

---

⭐ Si te gustó este proyecto, ¡dale una estrella en GitHub!
