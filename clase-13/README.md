# Clase 13 — Estilización con Bootstrap o styled-components

## Objetivos
- Mejorar el diseño y la **responsividad** con **React-Bootstrap** y **styled-components**
- Mejorar la UX con **React Icons**
- SEO básico con **React Helmet**
- **Barra de búsqueda** que filtra productos en tiempo real

## Dependencias de la clase
```bash
npm install react-bootstrap bootstrap styled-components react-icons react-helmet
```

## Temas

### React-Bootstrap
En vez de escribir clases de Bootstrap en `className`, usamos **componentes ya armados**: código más limpio, menos errores de tipeo y un enfoque declarativo.

Hay que importar el CSS una vez en el punto de entrada (`main.jsx`):
```js
import 'bootstrap/dist/css/bootstrap.min.css'; // ⚠️ sin esto, los componentes se ven sin estilos
```

Componentes principales:
- **`Container`** — agrupa el contenido con márgenes automáticos
- **`Row`** — una fila
- **`Col`** — columnas que se adaptan al ancho de pantalla
- **`Card`** — tarjeta con imagen, título y botón

```jsx
<Container className="mt-4">
  <Row>
    {productos.map(prod => (
      <Col key={prod.id} xs={12} md={6} lg={4} className="mb-4">
        <Card className="h-100">
          <Card.Img variant="top" src={prod.imagen} />
          <Card.Body className="d-flex flex-column">
            <Card.Title>{prod.nombre}</Card.Title>
            <Card.Text>${prod.precio}</Card.Text>
            <Button as={Link} to={`/productos-nacionales/${prod.id}`} className="mt-auto">Ver detalle</Button>
          </Card.Body>
        </Card>
      </Col>
    ))}
  </Row>
</Container>
```
- **`xs={12}`** → en celulares, 1 columna · **`md={6}`** → en tablets, 2 · **`lg={4}`** → en escritorio, 3
- **Grid de 12 columnas**, expresado como props de `Col`
- **Breakpoints:** `xs`, `sm`, `md`, `lg`, `xl` (de menor a mayor)
- Se pueden seguir usando las clases utilitarias (`mt-4`, `d-flex`, `h-100`…)
- `as={Link}` hace que el `Button` de Bootstrap navegue con React Router

### styled-components
Para un diseño más **personalizado**: componentes de React con estilos **encapsulados** (no afectan a otros elementos) y reutilizables.
```jsx
import styled from 'styled-components';

const BotonAccion = styled.button`
  background-color: transparent;
  border: 1px solid #ccc;
  border-radius: 5px;
  &:hover { transform: translateY(-2px); }
`;

// styled(Base) hereda los estilos y agrega/sobrescribe
const BotonEditar = styled(BotonAccion)`
  border-color: #ffc107;
  color: #ffc107;
  &:hover { background-color: #ffc107; color: white; }
`;

<BotonEditar onClick={() => handleEditClick(prod)}>Editar</BotonEditar>
```
**Ventajas:** estilos acoplados al componente (fáciles de mantener), reutilización con variantes (principio **DRY**), pseudoclases (`:hover`, `:focus`) naturales y legibilidad (ves cómo luce sin saltar a un `.css`).

### React Icons
Íconos SVG como componentes de React:
```jsx
import { FaEdit, FaTrash } from 'react-icons/fa';

<BotonEditar><FaEdit style={{ marginRight: '5px' }} /> Editar</BotonEditar>
```
Se estilizan como cualquier elemento: con `className` y CSS, o con `style` en línea (`<FaTrash style={{ color: 'red', fontSize: '18px' }} />`).

### SEO con React Helmet
Las SPA tienen un único `<head>` estático, malo para que Google distinga las páginas. Helmet permite que cada ruta tenga su propio `<title>` y `<meta>`:
```jsx
import { Helmet } from 'react-helmet';

{prod && (
  <Helmet>
    <title>Mi Tienda | {prod.nombre}</title>
    <meta name="description" content={`Detalles y precio del producto ${prod.nombre}.`} />
  </Helmet>
)}
```
Se puede verificar en el inspector: el `<meta name="description">` cambia según el producto.

> `react-helmet` ya no se mantiene y con React 18 en `StrictMode` tira un warning de `UNSAFE_componentWillMount`. La alternativa actual es **`react-helmet-async`** (misma API, pero con `<HelmetProvider>` envolviendo la app), y desde React 19 se puede poner `<title>`/`<meta>` directo en el JSX. En el repo se deja `react-helmet` para seguir el curso.

### Barra de búsqueda
Un `useState` guarda lo que se tipea y, **antes de renderizar**, se filtra la lista:
```jsx
const [searchTerm, setSearchTerm] = useState('');

const productosFiltrados = productos.filter(prod =>
  prod.nombre.toLowerCase().includes(searchTerm.toLowerCase()) // sin distinguir mayúsculas
);

<input type="text" className="form-control" onChange={(e) => setSearchTerm(e.target.value)} />
{productosFiltrados.map(...)}
```

### Búsqueda global con Context API
Para usar la búsqueda desde cualquier parte (por ejemplo, el navbar):
```jsx
// context/SearchContext.jsx
export function SearchProvider({ children }) {
  const [busqueda, setBusqueda] = useState('');
  return <SearchContext.Provider value={{ busqueda, setBusqueda }}>{children}</SearchContext.Provider>;
}
export function useSearch() { return useContext(SearchContext); }
```
Se envuelve la app con `<SearchProvider>` (en `App.jsx`) y cada componente usa `const { busqueda, setBusqueda } = useSearch()`.

## Ejercicio (Talento Lab)
1. **Interfaz responsiva** — grilla de Bootstrap en `ProductosNacionales` (1/2/3 columnas) y en el detalle; Navbar de React-Bootstrap que se colapsa en celulares; botones de `Gestion` con styled-components
2. **Barra de búsqueda** — input **controlado** que filtra por nombre en tiempo real, con ícono `FaSearch` y estilo de Bootstrap (`InputGroup`)
3. **React Icons** — carrito, perfil, salir, editar, eliminar, agregar al carrito
4. **SEO** — `Helmet` en el detalle con `<title>` y `<meta name="description">` dinámicos
5. **Listo para deploy** — estilos responsivos y búsqueda que filtra en memoria (sin pedir de nuevo a Firebase)

En el repo, la búsqueda es **global**: el input del navbar y el de la página comparten el mismo estado (`SearchContext`). Si escribís en el navbar estando en otra página, te lleva a `/productos-nacionales`.

## Archivos de la clase
- `src/main.jsx` — importa el CSS de Bootstrap
- `src/context/SearchContext.jsx` — `SearchProvider` + `useSearch`
- `src/App.jsx` — envuelve las rutas con `SearchProvider`
- `src/componentes/layout/Header.jsx` — `Navbar` responsive, buscador global e íconos
- `src/pages/ProductosNacionales/ProductosNacionales.jsx` — grilla con `Container/Row/Col/Card` + búsqueda
- `src/pages/ProductosNacionales/ProductosNacionalesDetalle.jsx` — layout responsive + `Helmet`
- `src/componentes/Gestion/Gestion.jsx` — `BotonAccion`, `BotonEditar`, `BotonEliminar` con íconos
- (Se borra `ProductosNacionales.module.css`: lo reemplaza Bootstrap)

## Preguntas para reflexionar
- **¿Cómo asegurar que la app sea completamente responsiva con Bootstrap y styled-components?** Usando el grid (`Container`/`Row`/`Col` con `xs`/`md`/`lg`) para el layout, el `Navbar` con `expand` para el menú, imágenes con `img-fluid`, media queries dentro de los styled-components para lo propio y probando en DevTools (Ctrl + Shift + M) con distintos tamaños.
- **En un proyecto grande, ¿qué ventajas tiene styled-components frente a CSS tradicional o Bootstrap?** No hay choques de nombres de clases (estilos encapsulados), los estilos viven junto al componente (si borrás el componente, se van sus estilos), se pueden cambiar con props/estado y se reutilizan con variantes. Bootstrap es más rápido para el layout general; se combinan bien.
- **¿Qué mejora agregar íconos con React Icons?** Se reconocen las acciones de un vistazo (🗑 eliminar, ✏️ editar), son útiles en celulares donde hay poco espacio, dan consistencia visual y se ven nítidos a cualquier tamaño (SVG). Para la accesibilidad, un ícono solo necesita un `aria-label`.
- **¿Cómo aplicar la búsqueda global en el navbar?** Con el `SearchContext`: el input del Header hace `setBusqueda` y el listado lee `busqueda` y filtra. Como el estado es global, no hace falta pasar props entre el Header y la página.

## Próximos pasos
- Diseño mobile-first y adaptabilidad
- Buenas prácticas de UI/UX
- Paginador en la vista de productos
