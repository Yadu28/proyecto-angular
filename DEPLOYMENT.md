# Guía de Despliegue en Vercel - Platzi Store



##  Pre-requisitos

- [ ] Cuenta en GitHub
- [ ] Cuenta en Vercel (puedes registrarte con GitHub)
- [ ] Código del proyecto en un repositorio de GitHub

## Opción 1: Despliegue desde el Dashboard de Vercel (Recomendado)

### Paso 1: Subir tu código a GitHub

Si aún no lo has hecho:

```bash
# Inicializar git (si no está inicializado)
git init

# Agregar todos los archivos
git add .

# Hacer commit
git commit -m "Initial commit - Platzi Store"

# Conectar con tu repositorio remoto
git remote add origin [URL-DE-TU-REPO]

# Subir el código
git push -u origin main
```

### Paso 2: Importar en Vercel

1. Ve a [https://vercel.com](https://vercel.com)
2. Haz clic en "New Project"
3. Conecta tu cuenta de GitHub (si no lo has hecho)
4. Selecciona el repositorio `proyecto-angular`

### Paso 3: Configurar el Proyecto

Vercel debería detectar automáticamente que es un proyecto Angular, pero verifica que la configuración sea:

```
Framework Preset: Angular
Build Command: npm run build
Output Directory: dist/proyecto-angular/browser
Install Command: npm install
```

### Paso 4: Variables de Entorno (Opcional)

No necesitamos variables de entorno para este proyecto, pero si en el futuro las necesitas:

1. Ve a "Environment Variables"
2. Agrega las variables necesarias
3. Asegúrate de seleccionar en qué entornos aplicarán (Production, Preview, Development)

### Paso 5: Desplegar

1. Haz clic en "Deploy"
2. Espera a que termine el proceso (aprox. 2-3 minutos)
3. ¡Listo! Tu aplicación estará en línea

## Opción 2: Despliegue con Vercel CLI

### Instalación de Vercel CLI

```bash
npm install -g vercel
```

### Autenticación

```bash
vercel login
```

Sigue las instrucciones en pantalla para autenticarte.

### Primer Despliegue

Desde la raíz de tu proyecto:

```bash
vercel
```

Responde las siguientes preguntas:

```
? Set up and deploy "~/proyecto-angular"? [Y/n] Y
? Which scope do you want to deploy to? [Tu usuario/organización]
? Link to existing project? [y/N] N
? What's your project's name? platzi-store
? In which directory is your code located? ./
? Want to override the settings? [y/N] N
```

### Despliegue a Producción

Para desplegar a producción:

```bash
vercel --prod
```

##  Configuración Avanzada

### Archivo vercel.json

El proyecto ya incluye un archivo `vercel.json` con la configuración óptima:

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
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

### Dominios Personalizados

Una vez desplegado, puedes agregar un dominio personalizado:

1. Ve a tu proyecto en el dashboard de Vercel
2. Haz clic en "Settings" → "Domains"
3. Agrega tu dominio personalizado
4. Sigue las instrucciones para configurar DNS

## 📊 Monitoreo del Despliegue

### Durante el Build

Vercel te mostrará en tiempo real:

- ✅ Instalación de dependencias
- ✅ Ejecución del build
- ✅ Optimización de assets
- ✅ Despliegue a CDN

### Después del Despliegue

En el dashboard podrás ver:

- **Deployment URL:** URL temporal para este despliegue
- **Production URL:** URL permanente de producción
- **Build Logs:** Logs completos del proceso
- **Analytics:** Estadísticas de uso (plan Pro)

## 🔄 Actualizaciones Automáticas

### Git Integration

Vercel automáticamente desplegará:

- **Production:** Cada push a la rama `main`
- **Preview:** Cada push a otras ramas
- **PR Deployments:** Cada Pull Request

### Configurar Branch para Producción

1. Ve a "Settings" → "Git"
2. En "Production Branch" selecciona la rama (usualmente `main`)
3. Guarda cambios

## ✅ Verificación Post-Despliegue

### Checklist

- [ ] La aplicación carga correctamente
- [ ] El login funciona (prueba con john@mail.com / changeme)
- [ ] Se pueden listar productos
- [ ] Puedes agregar productos al carrito
- [ ] Las rutas funcionan correctamente (refresca en diferentes páginas)
- [ ] Los estilos se cargan bien
- [ ] No hay errores en la consola del navegador

### Pruebas de Funcionalidad

1. **Login:**
   ```
   URL: https://tu-app.vercel.app/login
   Email: john@mail.com
   Password: changeme
   ```

2. **Productos:**
   ```
   - Navega a /products
   - Verifica que se carguen los productos
   - Prueba el buscador
   - Prueba los filtros
   ```

3. **CRUD:**
   ```
   - Crea un nuevo producto
   - Edita un producto existente
   - Elimina un producto (con cuidado)
   ```

4. **Carrito:**
   ```
   - Agrega productos al carrito
   - Modifica cantidades
   - Verifica que persista al recargar
   ```

## 🐛 Solución de Problemas

### Error: Build Failed

**Síntoma:** El build falla en Vercel

**Solución:**

1. Verifica que el build funcione localmente:
```bash
npm run build
```

2. Revisa los logs de Vercel para el error específico

3. Verifica que `dist/proyecto-angular/browser` se genere correctamente

### Error: 404 al Navegar

**Síntoma:** Funciona en `/` pero al navegar a otras rutas da 404

**Solución:**

1. Verifica que `vercel.json` tenga los rewrites:
```json
"rewrites": [
  {
    "source": "/(.*)",
    "destination": "/index.html"
  }
]
```

2. Asegúrate de que `<base href="/">` esté en `index.html`

### Error: API Calls Failing

**Síntoma:** Las llamadas a la API fallan en producción

**Solución:**

1. Verifica que la URL de la API sea correcta (HTTPS)
2. Revisa la consola del navegador para errores CORS
3. La API de Platzi debe aceptar requests desde cualquier origen

### Error: Assets No Se Cargan

**Síntoma:** Imágenes, fuentes o estilos no se cargan

**Solución:**

1. Verifica que los assets estén en `public/` o `src/assets/`
2. Usa rutas relativas o absolutas desde la raíz (`/assets/...`)
3. Revisa el output directory en la configuración

## 📈 Optimizaciones para Producción

### Performance

El build de Angular ya incluye:
- ✅ Tree-shaking
- ✅ Minification
- ✅ Lazy loading
- ✅ AOT compilation

### SEO

Vercel automáticamente proporciona:
- ✅ CDN global
- ✅ Compresión Gzip/Brotli
- ✅ HTTP/2
- ✅ SSL gratis

### Lighthouse Score

Después del despliegue, verifica tu score:

1. Abre Chrome DevTools
2. Ve a la pestaña "Lighthouse"
3. Selecciona "Performance" y "SEO"
4. Haz clic en "Generate report"

Objetivo: >90 en todas las categorías

## 📝 Actualizar README con URL

Una vez desplegado, actualiza el README.md:

```markdown
## 🚀 Demo en Vivo

**URL de Vercel:** https://tu-app.vercel.app
```

Haz commit y push:

```bash
git add README.md
git commit -m "docs: add Vercel deployment URL"
git push
```

## 🎯 Próximos Pasos

Después del primer despliegue:

1. [ ] Configura un dominio personalizado
2. [ ] Habilita Analytics de Vercel (si tienes plan Pro)
3. [ ] Configura notificaciones de despliegue
4. [ ] Implementa monitoreo de errores (Sentry)
5. [ ] Agrega Google Analytics

## 📞 Soporte

Si tienes problemas con Vercel:

- **Documentación:** https://vercel.com/docs
- **Discord:** https://vercel.com/discord
- **Support:** https://vercel.com/support

---

¡Felicidades! 🎉 Tu aplicación Angular ahora está en producción con Vercel.

**URL de ejemplo:** https://platzi-store-angular.vercel.app

## 🔖 Badge para tu README

Agrega este badge a tu README.md:

```markdown
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/tu-usuario/proyecto-angular)
```

¡Disfruta de tu app en producción! 🚀
