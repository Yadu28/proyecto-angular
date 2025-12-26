# Guía de Desarrollo - Platzi Store

## 📚 Estructura del Proyecto

### Organización de Carpetas

```
src/app/
├── core/                           # Funcionalidad central compartida
│   ├── guards/                     # Guards de rutas
│   │   └── auth.guard.ts           # Protección de rutas privadas
│   ├── interceptors/               # Interceptores HTTP
│   │   └── auth.interceptor.ts     # Añade token JWT a las peticiones
│   └── services/                   # Servicios principales
│       ├── auth.service.ts         # Autenticación y gestión de sesión
│       ├── cart.service.ts         # Gestión del carrito de compras
│       ├── product.service.ts      # Opera con productos de la API
│       └── toast.service.ts        # Sistema de notificaciones
│
├── features/                       # Módulos por característica
│   ├── auth/                       # Módulo de autenticación
│   │   ├── login.component.ts
│   │   ├── login.component.html
│   │   └── login.component.scss
│   ├── products/                   # Módulo de productos
│   │   ├── product-list.component.*
│   │   └── product-form.component.*
│   └── cart/                       # Módulo del carrito
│       └── cart.component.*
│
└── shared/                         # Componentes compartidos
    └── components/
        └── toast/                  # Notificaciones toast
```

## 🔐 Autenticación

### Flujo de Autenticación

1. **Login:**
   - Usuario ingresa email y password
   - Se envía POST a `/api/v1/auth/login`
   - API retorna `access_token` y `refresh_token`
   - Tokens se guardan en LocalStorage
   - Se carga perfil de usuario

2. **Autorización:**
   - Interceptor añade header `Authorization: Bearer {token}` a todas las peticiones
   - AuthGuard protege rutas privadas
   - Si no hay token válido, redirige a `/login`

3. **Logout:**
   - Se eliminan tokens del LocalStorage
   - Se limpia estado del usuario
   - Redirige a página de login

### Credenciales de Prueba

```json
{
  "email": "john@mail.com",
  "password": "changeme"
}
```

## 🛒 Gestión del Carrito

### Almacenamiento

El carrito se almacena en LocalStorage con la siguiente estructura:

```typescript
interface CartItem {
  product: Product;
  quantity: number;
}
```

### Operaciones Disponibles

```typescript
// Agregar producto
cartService.addToCart(product, quantity);

// Actualizar cantidad
cartService.updateQuantity(productId, newQuantity);

// Eliminar producto
cartService.removeFromCart(productId);

// Vaciar carrito
cartService.clearCart();

// Obtener totales
const total = cartService.getCartTotal();
const count = cartService.getCartItemCount();
```

## 📦 API de Productos

### Endpoints Utilizados

```typescript
// Listar todos los productos
GET /api/v1/products
// Query params: limit, offset

// Obtener un producto
GET /api/v1/products/:id

// Crear producto (requiere autenticación)
POST /api/v1/products
Body: {
  title: string;
  price: number;
  description: string;
  categoryId: number;
  images: string[];
}

// Actualizar producto (requiere autenticación)
PUT /api/v1/products/:id
Body: UpdateProductDto

// Eliminar producto (requiere autenticación)
DELETE /api/v1/products/:id

// Obtener categorías
GET /api/v1/categories
```

## 🎨 Sistema de Diseño

### Paleta de Colores

```scss
// Colores Principales
$primary: #667eea;
$primary-dark: #764ba2;

// Estados
$success: #48bb78;
$error: #f56565;
$warning: #ed8936;
$info: #4299e1;

// Escalas de Grises
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

### Tipografía

```scss
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

**Tamaños:**
- Headings: 1.5rem - 2rem (600-700 weight)
- Body: 0.95rem - 1rem (400 weight)
- Small: 0.85rem - 0.9rem (500 weight)

### Espaciado

```scss
$spacing-xs: 0.5rem;   // 8px
$spacing-sm: 1rem;     // 16px
$spacing-md: 1.5rem;   // 24px
$spacing-lg: 2rem;     // 32px
$spacing-xl: 2.5rem;   // 40px
```

### Radios de Esquinas

```scss
$radius-sm: 8px;
$radius-md: 12px;
$radius-lg: 16px;
$radius-xl: 20px;
$radius-full: 50%;
```

## 🔧 Configuración de Desarrollo

### Variables de Entorno

No se requieren variables de entorno. La URL de la API está hardcoded:

```typescript
private readonly API_URL = 'https://api.escuelajs.co/api/v1';
```

### Scripts NPM

```json
{
  "start": "ng serve",           // Servidor de desarrollo
  "build": "ng build",           // Build de producción
  "watch": "ng build --watch",   // Build incremental
  "test": "ng test"              // Tests unitarios
}
```

### Configuración de Angular

**angular.json:**
- SCSS habilitado por defecto
- Budgets de bundle configurados
- Optimizaciones de producción activadas

## 📱 Responsive Design

### Breakpoints

```scss
// Mobile First Approach
$mobile: 0px;
$tablet: 640px;
$desktop: 1024px;
$wide: 1400px;

@media (max-width: 640px) { /* Mobile */ }
@media (min-width: 641px) and (max-width: 1024px) { /* Tablet */ }
@media (min-width: 1025px) { /* Desktop */ }
```

### Grid System

Usamos CSS Grid nativo:

```scss
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}
```

## 🧪 Testing (Configuración Básica)

### Estructura de Tests

```
*.spec.ts - Tests unitarios junto a cada componente/servicio
```

### Ejecutar Tests

```bash
npm test
```

## 🚀 Despliegue

### Proceso de Build

1. **Ejecutar build:**
```bash
npm run build
```

2. **Archivos generados:**
```
dist/proyecto-angular/browser/
├── index.html
├── main-{hash}.js
├── polyfills-{hash}.js
└── styles-{hash}.css
```

3. **Subir a Vercel:**
```bash
vercel --prod
```

### Configuración de Vercel

El archivo `vercel.json` ya está configurado con:
- Output directory correcto
- Rewrites para SPA routing
- Security headers

## 🔒 Seguridad

### Medidas Implementadas

1. **JWT Tokens:** Almacenados en LocalStorage (considerar HttpOnly cookies en producción)
2. **HTTP Interceptor:** Añade token automáticamente
3. **Route Guards:** Protege rutas privadas
4. **Security Headers:** Configurados en Vercel
   - X-Content-Type-Options
   - X-Frame-Options
   - X-XSS-Protection

### Consideraciones de Producción

- [ ] Implementar refresh token logic
- [ ] Mover tokens a HttpOnly cookies
- [ ] Implementar rate limiting
- [ ] Añadir CSRF protection
- [ ] Implementar Content Security Policy

## 📊 Optimizaciones de Performance

### Implementadas

1. **Lazy Loading:** Rutas cargadas bajo demanda
2. **Standalone Components:** Reducción de bundle size
3. **Change Detection:** OnPush donde sea posible
4. **Build Optimizations:** Tree-shaking, minification
5. **Image Optimization:** Object-fit, loading lazy

### Futuras Mejoras

- [ ] Implement virtual scrolling para listas grandes
- [ ] Añadir service workers (PWA)
- [ ] Implementar caching estratégico
- [ ] Optimizar imágenes con CDN

## 🐛 Debugging

### Herramientas Angular DevTools

Instala Angular DevTools extension para Chrome/Firefox:
- Inspección de componentes
- Profiling de performance
- Dependency injection tree
- Router tree

### Logs de Desarrollo

Los servicios tienen console.error para debugging:

```typescript
this.productService.getProducts().subscribe({
  next: (products) => { /* ... */ },
  error: (error) => {
    console.error('Error loading products:', error);
  }
});
```

## 📈 Métricas y Monitoreo

### Para Implementar en Producción

1. **Google Analytics:** Tracking de rutas y eventos
2. **Sentry:** Error monitoring
3. **Lighthouse:** Performance audits
4. **Web Vitals:** Core metrics monitoring

## 🤝 Contribuciones

### Workflow de Git

```bash
# Crear feature branch
git checkout -b feature/nueva-funcionalidad

# Hacer commits descriptivos
git commit -m "feat: agregar filtro por precio"

# Push y PR
git push origin feature/nueva-funcionalidad
```

### Convenciones de Código

- **TypeScript:** Strict mode habilitado
- **Naming:** camelCase para variables, PascalCase para clases
- **Formatting:** Prettier configurado
- **Linting:** ESLint con reglas de Angular

## 📚 Recursos Adicionales

- [Angular Documentation](https://angular.io/docs)
- [Platzi Fake API Docs](https://fakeapi.platzi.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [SCSS Guide](https://sass-lang.com/guide)

---

**Última actualización:** Diciembre 2024
**Versión:** 1.0.0
