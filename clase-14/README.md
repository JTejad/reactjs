# Clase 14 — Diseño responsivo y UX

## Objetivos
- Aplicar el enfoque **Mobile-First** con React-Bootstrap
- Buenas prácticas de **UI/UX**: React Icons, feedback visual y accesibilidad
- Revisar `ProductosNacionales`, `Cart` y `Gestion` para mejorar la interacción
- **Paginar** `ProductosNacionales` para manejar muchos productos de Firebase

## Temas

### Diseño Mobile-First
Diseñar **primero para pantallas chicas** y después sumar complejidad para tablets y escritorio.
```jsx
<Col xs={12} sm={6} lg={4} key={producto.id} className="mb-4">
```
- Por defecto (`xs={12}`): un producto debajo del otro, ideal para leer en vertical en el celular
- Desde `sm`: 2 columnas · desde `lg`: 3 columnas
- La grilla se reacomoda sola, **sin media queries manuales**

**Prueba de adaptabilidad:** DevTools (F12) → modo responsive (**Ctrl + Shift + M**) y probar distintos tamaños.

**Beneficios:** mejor rendimiento en celulares, prioriza la usabilidad en pantallas chicas, mejora accesibilidad y SEO.

### ¿Por qué importa la UX?
UX es cómo se **siente** el usuario al usar la app: un mal diseño frustra y espanta, uno claro mejora la conversión y la retención.

Principios clave:
- **Simplicidad** — sin elementos innecesarios
- **Consistencia** — mismo estilo de botones, tipografías y colores
- **Accesibilidad** — fácil de usar para todos
- **Feedback visual** — mostrar estados de carga, confirmaciones y errores

Buenas prácticas:
- **Botones grandes** en pantallas táctiles: `className="btn btn-primary btn-lg w-100"`
- **Formularios claros** — etiquetas (`form-label`), `form-control`, espaciado (`mb-3`), `p-4 border rounded shadow`
- **Espaciado y legibilidad** — suficiente aire entre elementos para no errarle al clic

### Refinando la interacción: styled-components + React Icons en Gestion
```jsx
const ProductoItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #e0e0e0;
  &:hover { background-color: #f8f9fa; }
`;
const ProductoInfo = styled.span`
  flex-grow: 1;
  font-size: 16px;
`;

<ProductoItem key={prod.id}>
  <ProductoInfo>{prod.nombre} - {prod.categoria} - ${prod.precio} - {prod.stock}</ProductoInfo>
  <div>
    <BotonEditar onClick={() => handleEditClick(prod)}><FaEdit /> Editar</BotonEditar>
    <BotonEliminar onClick={() => handleDelete(prod.id)}><FaTrash /> Eliminar</BotonEliminar>
  </div>
</ProductoItem>
```
Colores distintos por acción, hover como feedback, íconos reconocibles, espaciado consistente y flexbox responsive.

### Herramientas para pruebas responsivas
- Modo responsive de Chrome: F12 → Ctrl + Shift + M
- Simuladores online: Responsinator, Google Mobile-Friendly Test

### Accesibilidad: etiquetas ARIA
```jsx
<button className="btn btn-primary" aria-label="Agregar al carrito">🛒 Agregar</button>
```
`aria-label` le da nombre a botones que solo tienen ícono, para los lectores de pantalla.

### Indicadores de carga (Spinner)
Reemplazamos el "Cargando..." de texto por un `Spinner` de React-Bootstrap: feedback inmediato, la espera se percibe más corta y se ve más profesional.
```jsx
import { Spinner } from 'react-bootstrap';

<div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
  <Spinner animation="border" role="status">
    <span className="visually-hidden">Cargando...</span>
  </Spinner>
</div>
```
Variantes: `variant="primary" | "success" | "info"…`, `animation="border" | "grow"`, `size="sm"`, o tamaño propio con `style`.

### Paginador
Divide muchos datos en páginas chicas: en vez de traer todo, trae **N documentos** y ofrece botones para seguir.
- **Límite** — pide solo N documentos
- **Punto de inicio** — usa el último documento cargado como cursor para traer los siguientes
- **Estado** — qué se muestra y si quedan más páginas

¿Por qué? **Rendimiento** (carga inicial más rápida), **UX**, **escalabilidad** y **menos consumo** (memoria, ancho de banda y lecturas de Firebase, que se cobran).

#### En `ProductosNacionales.jsx` (7 pasos)
1. **Estados:** `productos`, `cargando`, `cargandoMas`, `ultimoVisible`, `hayMas`
2. **Configuración:** `const PRODUCTOS_POR_PAGINA = 4;`
3. **Carga inicial:**
```js
const q = query(productosDB, limit(PRODUCTOS_POR_PAGINA));
getDocs(q).then(resp => {
  setProductos(resp.docs.map(doc => ({ ...doc.data(), id: doc.id })));
  setUltimoVisible(resp.docs[resp.docs.length - 1]);
  setHayMas(resp.docs.length === PRODUCTOS_POR_PAGINA);
});
```
4. **Cargar más** — `startAfter(ultimoVisible)` sigue desde el último documento y **se suman** a los anteriores:
```js
const q = query(productosDB, startAfter(ultimoVisible), limit(PRODUCTOS_POR_PAGINA));
setProductos(anteriores => [...anteriores, ...nuevos]);
```
5. **Ver menos** — vuelve a cargar la primera página y hace `window.scrollTo(0, 0)`
6. **Filtro del lado del cliente** — la búsqueda filtra solo los productos **ya cargados**
7. **Botones condicionales** — "Ver menos" si hay más de una página; "Cargar más" (con spinner mientras carga) si `hayMas`; si no, un `Alert` "No hay más productos para mostrar"

## Ejercicio (Talento Lab)
1. **Responsive con Bootstrap y styled-components** — grillas mobile-first en productos, detalle y carrito; filas de Gestion con `ProductoItem`/`ProductoInfo`
2. **React Icons** — carrito en el navbar, papelera en el carrito, editar/eliminar en Gestion, flechas en el paginador
3. **Accesibilidad y SEO** — `aria-label` en botones de íconos, `visually-hidden` en spinners y `Helmet` en el detalle (de la clase 13)
4. **Pruebas para el deploy** — revisar en DevTools que todo se acomode en pantallas chicas y grandes; imágenes con `loading="lazy"`
5. **Paginación** en `ProductosNacionales.jsx` con "Cargar más" / "Ver menos"

## Archivos de la clase
- `src/componentes/Cargando/Cargando.jsx` — spinner reutilizable (lo usan productos, detalle, Gestion y `ProtectedRoute`)
- `src/pages/ProductosNacionales/ProductosNacionales.jsx` — paginador con `query`, `limit` y `startAfter`
- `src/pages/ProductosNacionales/ProductosNacionalesDetalle.jsx` — spinner + botón grande
- `src/componentes/Gestion/Gestion.jsx` — `ProductoItem`, `ProductoInfo` y spinner de la lista
- `src/componentes/Cart/Cart.jsx` — layout mobile-first con `ListGroup`, íconos y `aria-label`
- `src/componentes/Login/Login.jsx` — formulario optimizado (labels, espaciado, botón `w-100`, spinner)

## Preguntas para reflexionar
1. **¿Cómo mejora la UX el enfoque mobile-first?** La mayoría navega desde el celular: diseñar primero para ahí obliga a priorizar lo importante, simplifica la interfaz, carga más rápido y después solo se *agrega* espacio para pantallas grandes (en vez de recortar algo pensado para escritorio).
2. **¿Qué elementos son clave para una navegación intuitiva?** Un navbar claro y consistente (que se colapse en celulares), búsqueda visible, íconos reconocibles, botones grandes, feedback (spinners, confirmaciones, errores claros), migas o links de "volver", y estados vacíos que digan qué hacer ("El carrito está vacío → Ver productos").
3. **¿Cómo evaluar la accesibilidad?** Con **Lighthouse** (pestaña de DevTools) y extensiones como axe, navegando solo con teclado (Tab/Enter), probando un lector de pantalla, revisando contraste de colores, `alt` en imágenes, labels en los inputs y `aria-label` en botones de ícono.
4. **¿Qué estrategias para seguir mejorando la UX?** Escuchar a los usuarios (encuestas, pruebas de usabilidad), analítica (dónde abandonan), toasts en vez de `alert`, skeletons de carga, modo oscuro, guardar el carrito entre sesiones, y medir con Lighthouse / Core Web Vitals.
5. **¿Cómo mejorar el paginador?** Hacer la **búsqueda en Firestore** (hoy filtra solo lo cargado), ordenar con `orderBy` para que el orden sea estable, *scroll infinito* con `IntersectionObserver`, mostrar el total o "página X de Y", cachear las páginas ya pedidas, y anunciar los productos nuevos a lectores de pantalla (`aria-live`).

## Próximos pasos
- Pruebas en el entorno de producción
- Repaso de los pasos de despliegue y configuración
- Deploy en Vercel o Netlify
