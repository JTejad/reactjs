# Clase 15 — Despliegue de la aplicación

## Objetivos
- Asegurar que la app funcione bien en **producción**, no solo en `localhost`
- Repasar los pasos de configuración y los errores típicos del despliegue
- Publicar la app en **Vercel** o **Netlify**
- Conocer la consigna de la **entrega final**

## Temas

### Pruebas de funcionamiento en producción
Que ande en `localhost` no garantiza que ande en producción: hay servidores, CDNs y optimizaciones de por medio. Después de cada deploy, revisar:
- ✔️ **Rutas** — navegar todas las páginas, sobre todo las dinámicas (`/producto/:id`, `/productos-nacionales/:id`), y **refrescarlas con F5**
- ✔️ **Responsividad** — DevTools (F12 → Ctrl + Shift + M) o un celular real; que la grilla de Bootstrap se acomode
- ✔️ **Interactividad** — carrito, login/logout, CRUD del panel de gestión
- ✔️ **Recursos estáticos** — imágenes, estilos y fuentes sin errores 404 (pestaña *Network*)
- ✔️ **Rendimiento** — pestañas *Network* y *Lighthouse*; el build de producción es mucho más liviano que el de desarrollo

### Errores comunes y soluciones
| Problema | Causa | Solución |
|---|---|---|
| **Página en blanco** | Comando de build o directorio de salida mal configurados | Revisar los logs del deploy; build `npm run build` y output **`dist`** (Vite) |
| **404 al refrescar** `/producto/123` | En una SPA las rutas las maneja React Router en el navegador; el servidor busca un archivo que no existe | Redirigir todo a `index.html` (ver abajo) |
| **No anda Firebase / Imgbb** | Las variables de entorno no están cargadas en la plataforma | *Settings → Environment Variables* con los **mismos nombres** que el `.env` |

#### Redirecciones para la SPA
- **Netlify** — archivo `public/_redirects` (sin extensión). Vite lo copia tal cual a `dist/`:
  ```
  /*    /index.html   200
  ```
- **Vercel** — archivo `vercel.json` en la raíz del proyecto:
  ```json
  { "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
  ```

> ⚠️ **Corrección al PDF:** dice que en Vercel "se soluciona automáticamente". Con un proyecto de Vite **no**: nos pasó en la pre-entrega, refrescar `/producto/1` daba 404 hasta que agregamos el `vercel.json` (commit `fix: agrego rewrites de Vercel para las rutas de React Router`).

### Variables de entorno en producción
- En **Vite** las variables tienen que empezar con **`VITE_`** y se leen con `import.meta.env.VITE_...`.
  > ⚠️ **Corrección al PDF:** el ejemplo `REACT_APP_API_KEY` es de *Create React App*; en Vite esa variable **no llega** al código.
- Se **incrustan al hacer el build**: si cambiás una variable en Vercel/Netlify hay que hacer un **redeploy** para que tome el valor nuevo.
- Las claves de Firebase del frontend terminan visibles en el JS publicado (cualquiera las ve en DevTools). No son un secreto: lo que protege los datos son las **reglas de seguridad de Firestore**. Igual van en `.env` para no subirlas a GitHub y poder cambiarlas por entorno.

Variables a cargar (las del `.env.example`):
```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
VITE_IMGBB_API_KEY
```

### Despliegue final
**1. Build de producción**
```bash
npm run build      # genera dist/
npm run preview    # sirve dist/ en local para probarlo antes de subirlo
```

**2. Checklist antes de subir**
- Sacar los `console.log` de prueba (los `console.error` en los `catch` pueden quedar)
- Claves de Firebase / Imgbb en `.env`, nunca en el código, y cargadas en la plataforma
- Código actualizado en GitHub (`git push`)

**3. Deploy**
- Si ya está conectado (como la pre-entrega), **cada `git push` a `main` redeploya solo**
- Si no: *Add New Project* → importar el repo de GitHub → verificar:
  - Build command: `npm run build`
  - Output directory: `dist`
  - Root directory: la carpeta del proyecto si el repo tiene varias (en la pre-entrega es `pre-entrega`)
- *Deploy* → la plataforma devuelve la URL pública

## Ejercicio
Dejar la app de las clases anteriores lista para producción:
1. `vercel.json` con el rewrite (Vercel) y `public/_redirects` (Netlify)
2. Cargar las variables `VITE_*` en la plataforma
3. Deployar y recorrer el checklist de pruebas, refrescando las rutas dinámicas

## Archivos de la clase
- `vercel.json` — rewrite de todas las rutas a `index.html` para Vercel
- `public/_redirects` — lo mismo para Netlify
- El resto es la app de la clase 14 sin cambios (ya no tenía `console.log` de prueba y las claves salen del `.env`)

## Preguntas para reflexionar
1. **¿Ventajas y desventajas entre Vercel y Netlify?** Para una SPA de Vite son casi equivalentes: los dos tienen plan gratis, deploy automático desde GitHub, HTTPS y previews por cada rama o PR. **Vercel** tiene la integración más pulida con frameworks (sobre todo Next.js) y es muy simple de configurar; **Netlify** suma extras sin backend, como formularios y *redirects* en un archivo, y su panel es muy claro. En contra: los dos limitan builds y ancho de banda en el plan gratis, y en ambos hay que configurar las redirecciones para la SPA de Vite.
2. **¿Por qué es crucial `_redirects` en Netlify?** Porque en una SPA existe un solo `index.html` y las rutas las resuelve React Router en el navegador. Si el usuario refresca o entra directo a `/productos-nacionales/abc123`, Netlify busca ese archivo, no lo encuentra y devuelve 404. Con `/* /index.html 200` sirve siempre `index.html` (con código 200, no como redirección visible), React arranca, lee la URL y muestra la página correcta.
3. **¿Qué métricas de Lighthouse son más importantes para el e-commerce?** **LCP** (*Largest Contentful Paint*, cuánto tarda en verse lo principal, típicamente las fotos de productos), **CLS** (*Cumulative Layout Shift*, que la página no "salte" mientras cargan imágenes; se evita fijando el alto de las imágenes) y **TBT/INP** (que los botones respondan rápido). Fuera de *Performance*, también importan **SEO** (títulos y meta con Helmet) y **Accesibilidad**, porque afectan las ventas y el posicionamiento.

## Entrega final — requerimientos
1. **Carrito y autenticación** — `CartContext` (agregar, eliminar, vaciar), `AuthContext`, login/registro con Firebase Auth, rutas protegidas (gestión, perfil)
2. **CRUD con Firebase** — formulario controlado con validaciones (nombre obligatorio, precio > 0), editar y eliminar, **modal de confirmación antes de eliminar**, spinners y mensajes de error si falla la API
3. **Diseño** — grilla de React-Bootstrap, styled-components, React Icons, **React Helmet** para `<title>` y `<meta>`
4. **Búsqueda y paginación** — barra que filtra en tiempo real y paginador
5. **Despliegue** — probar en los principales navegadores, limpiar código redundante y un **README.md** que explique cómo instalar y correr el proyecto en local

Lo que falta respecto de la clase 14 (el modal de confirmación y mostrar los errores al usuario en vez de solo en consola) se agrega en la [clase 16](../clase-16/README.md).
