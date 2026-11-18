# Clase 16 — Revisión final, optimización y presentación

## Objetivos
- Revisar a fondo el código y la funcionalidad antes de entregar
- Detectar y resolver errores típicos de producción y optimizar el rendimiento
- Armar una presentación clara del proyecto
- Conocer los criterios de evaluación y prepararse para el feedback

## Temas

### Checklist de revisión funcional
Correr el proyecto en local (y después en la URL deployada) y verificar punto por punto:

**Autenticación**
- [ ] El registro crea usuarios nuevos
- [ ] El login valida credenciales y redirige
- [ ] Las rutas protegidas no se pueden abrir sin sesión (probar pegando `/gestion` en la barra)
- [ ] El logout limpia el estado y vuelve al inicio

**CRUD de productos**
- [ ] **Read** — el catálogo muestra los productos de Firebase y el detalle abre bien
- [ ] **Create** — el alta aparece en la lista y en la consola de Firestore
- [ ] **Update** — el formulario se completa con el producto elegido y los cambios se guardan
- [ ] **Delete** — se borra de la vista y de la base

**Carrito (Context API)**
- [ ] Se agregan productos desde el catálogo
- [ ] El `CartWidget` (badge del navbar) se actualiza al instante
- [ ] El carrito muestra productos, precios y cantidades correctos
- [ ] Se puede eliminar un producto y vaciar el carrito

**UI/UX**
- [ ] Se adapta a celular, tablet y escritorio
- [ ] Todos los links y botones funcionan
- [ ] Las notificaciones (React Toastify) y los íconos ayudan al usuario

### Errores comunes en producción
- **Variables de entorno** sin cargar en Vercel/Netlify → Firebase no conecta. Cargar las `VITE_*` y redeployar.
- **404 al refrescar rutas dinámicas** → configurar el rewrite a `index.html` (`vercel.json` / `_redirects`, ver [clase 15](../clase-15/README.md)).

### Estrategias de optimización
- **Google Lighthouse** (DevTools → *Lighthouse*), sobre la URL deployada y no sobre `npm run dev`:
  - *Performance* — tiempos de carga, imágenes
  - *Accessibility* — contraste, etiquetas ARIA
  - *Best Practices* — HTTPS, vulnerabilidades
  - *SEO* — meta tags, títulos descriptivos
- **Imágenes** comprimidas y en formatos modernos (`.webp`); `loading="lazy"` en las que no se ven al principio.
- **Code splitting** con `React.lazy()` + `Suspense`: el código se divide en *chunks* que se descargan cuando hacen falta.

```jsx
import { lazy } from 'react';
const Gestion = lazy(() => import('./componentes/Gestion/Gestion'));

// En Layout: mientras baja el chunk se muestra el fallback
<Suspense fallback={<Cargando />}>
  <Outlet />
</Suspense>
```
- `lazy` necesita un componente con **export default**.
- Conviene poner el `Suspense` **adentro del Layout** (alrededor del `<Outlet />`): si envuelve todo `<Routes>`, mientras carga desaparecen también el header y el footer.

Resultado en este proyecto (`vite build`): `Gestion` (con el formulario, styled-components y el modal) sale en un chunk aparte de ~33 kB, y `Perfil` y `GestionCupones` en los suyos. Un cliente que solo compra nunca los descarga.

### Notificaciones con React Toastify
El checklist menciona **React Toastify**, que no se vio en clases anteriores. Reemplaza los `alert()`, que bloquean la página, por avisos que aparecen en una esquina y se van solos.
```bash
npm install react-toastify
```
```jsx
// main.jsx: un único contenedor para toda la app
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
<ToastContainer position="bottom-right" autoClose={3000} />

// En cualquier componente
import { toast } from 'react-toastify';
toast.success('Producto guardado con éxito.');
toast.warning('El precio debe ser un número mayor que cero.');
toast.error('No se pudo eliminar el producto.');
```

### Modal de confirmación (requerimiento de la entrega final)
`window.confirm` funciona pero es feo y no se puede estilizar. Con el `Modal` de React-Bootstrap el borrado pasa a ser en **dos pasos**:
1. El botón *Eliminar* solo guarda el producto en `productoAEliminar` → el modal se abre (`show={!!productoAEliminar}`).
2. *Confirmar* llama a `deleteDoc`; *Cancelar*, la X o Esc vuelven `productoAEliminar` a `null` y el modal se cierra.

Es el mismo patrón que `productoAEditar` de la clase 11: **un estado que guarda "sobre qué producto estoy actuando"**, y la UI se deriva de ese estado.

### Presentación final (8–11 minutos)
1. **Introducción (1')** — nombre y objetivo del proyecto
2. **Flujo de usuario (3–4')** — catálogo, buscador, carrito y compra simulada; achicar la ventana para mostrar el responsive
3. **Flujo de administrador (2–3')** — login como admin, entrar a `/gestion` y hacer el CRUD en vivo: crear, editar y eliminar
4. **Aspectos técnicos (1–2')** — React, Firebase, Context API, React Router y por qué; el desafío más interesante que resolviste
5. **Conclusiones (1')** — qué aprendiste y cómo seguirías (pasarela de pago real, reseñas, etc.)

> Tip: tener un usuario admin ya creado, datos de prueba cargados y la app deployada abierta en una pestaña. Si algo falla en vivo, tener a mano `npm run dev` como plan B.

### Criterios de evaluación
- **Funcionalidades** — CRUD, autenticación, carrito y el resto de los requisitos
- **Calidad del código** — estructura de componentes, manejo de estado, buenas prácticas
- **UX/UI** — intuitiva, prolija y funcional en distintos dispositivos
- **Resolución de problemas** — identificar, depurar y solucionar errores
- **Presentación** — claridad y profesionalismo

## Archivos de la clase
Parte de la app de la clase 15 y suma lo que pide la entrega final:
- `src/componentes/ModalConfirmacion/ModalConfirmacion.jsx` — modal reutilizable de React-Bootstrap (título, mensaje, spinner mientras procesa)
- `src/componentes/Gestion/Gestion.jsx` — borrado con modal (`productoAEliminar`), toasts en vez de `alert`, `Alert` si falla la carga y mensaje si la lista está vacía
- `src/componentes/GestionCupones/GestionCupones.jsx` — mismo modal y toasts
- `src/App.jsx` — `Gestion`, `GestionCupones` y `Perfil` con `React.lazy`
- `src/componentes/layout/Layout.jsx` — `Suspense` con el spinner alrededor del `<Outlet />`
- `src/main.jsx` — `ToastContainer` y su CSS
- `src/pages/ProductosNacionales/ProductosNacionales.jsx` — si falla "Cargar más", se avisa con un toast (antes solo iba a la consola)
- `src/componentes/Cart/Cart.jsx` y `src/pages/ProductoDetalle/ProductoDetalle.jsx` — toasts en vez de `alert`

## Dependencias
```bash
npm install react-router-dom firebase react-bootstrap bootstrap styled-components react-icons react-helmet react-toastify
```

## Preguntas para reflexionar
Son personales; estas son ideas a partir de lo que fuimos resolviendo en el curso:
1. **¿Cuál fue el mayor desafío técnico y cómo lo superaste?** Por ejemplo: el 404 al refrescar rutas en Vercel (entender que en una SPA las rutas existen solo en el navegador y agregar el rewrite); el bucle infinito del `useEffect` con `[productos]` como dependencia; o el `ProtectedRoute` que esperaba a que Firebase confirme la sesión (`loading`) antes de redirigir al login.
2. **¿Qué harías distinto si empezaras de nuevo?** Definir desde el principio la estructura de carpetas y los datos de Firestore (nombres de colecciones sin espacios, como `productos` en vez de `Productos nacionales`); usar React-Bootstrap desde el inicio en vez de migrar los estilos; poner las claves en `.env` desde el primer día y escribir las reglas de seguridad de Firestore junto con el CRUD.
3. **¿Qué concepto será más valioso a futuro?** Pensar la UI como **función del estado** (`useState`, Context, renderizado condicional) es la base de React y de casi todos los frameworks modernos. También el ciclo completo: código → GitHub → deploy automático con variables de entorno.
