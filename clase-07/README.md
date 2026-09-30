# Clase 07 - Rutas estáticas y dinámicas

## Objetivos

- Instalar y configurar `react-router-dom`.
- Comprender el funcionamiento del ruteo en una SPA (Single Page Application).
- Implementar rutas estáticas con `<Routes>` y `<Route>`.
- Usar `<Outlet />` para integrar el Layout con React Router.
- Navegar sin recargas con `<Link>`.
- Crear rutas dinámicas con parámetros usando `useParams`.

---

## Temas

### 1. SPAs y React Router

En una app tradicional, cada página es un archivo HTML separado y el navegador recarga todo al navegar. En una **SPA**, React intercepta la navegación y renderiza solo el componente que corresponde, sin recargar. Para gestionar esto se usa **React Router**.

### 2. Instalación

```bash
npm install react-router-dom
```

### 3. Configuración en `main.jsx`

Envolver la app en `BrowserRouter` para conectarla con el historial del navegador:

```jsx
import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
```

### 4. Rutas estáticas — `<Routes>` y `<Route>`

Se definen en `App.jsx`. `<Routes>` examina la URL y renderiza la primera `<Route>` cuyo `path` coincida.

```jsx
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>            {/* ruta padre: muestra Layout siempre */}
        <Route path="/"            element={<Inicio />} />
        <Route path="/productos"   element={<Productos Mensaje="Todos los productos" />} />
        <Route path="/destacados"  element={<Productos Mensaje="Productos destacados" />} />
        <Route path="/alta"        element={<FormularioContainer />} />
      </Route>
    </Routes>
  );
}
```

### 5. `<Outlet />` — reemplaza `props.children` en el Layout

Con React Router, el Layout no sabe qué hijo renderizar con `props.children`. En su lugar usa `<Outlet />`, que actúa como marcador de posición dinámico: React Router inserta ahí el componente de la ruta activa.

```jsx
// Layout.jsx
import { Outlet } from 'react-router-dom';

export function Layout() {
  return (
    <>
      <Header />
      <main>
        <Outlet />   {/* aquí aparece Inicio, Productos, etc. según la URL */}
      </main>
      <Footer />
    </>
  );
}
```

### 6. `<Link>` — navegación sin recarga

Reemplaza `<a href="...">` por `<Link to="...">`. La diferencia clave: `<a>` le dice al navegador "andá a buscar este documento" (recarga). `<Link>` le dice a React Router "cambiá la URL y renderizá el componente" (sin recarga).

```jsx
import { Link } from 'react-router-dom';

// En Header.jsx:
<Link to="/">Inicio</Link>
<Link to="/productos">Productos</Link>
<Link to="/alta">Alta de Producto</Link>
```

### 7. Rutas dinámicas y `useParams`

Para una página de detalle de producto, en lugar de crear una ruta por producto, se usa un parámetro dinámico:

```jsx
// En App.jsx:
<Route path="/producto/:id" element={<ProductoDetalle />} />
```

El prefijo `:` indica que `id` es un parámetro dinámico. Se accede a él dentro del componente con el hook `useParams`:

```jsx
import { useParams } from 'react-router-dom';

const ProductoDetalle = () => {
  const { id } = useParams();

  // Con este id se puede hacer fetch a la API:
  useEffect(() => {
    fetch('/data/productos.json')
      .then(res => res.json())
      .then(data => {
        const encontrado = data.find(p => p.id === parseInt(id));
        setProducto(encontrado);
      });
  }, [id]);
};
```

### 8. `<Link>` con template literal para pasar el id

En el componente que lista productos, se genera el link dinámicamente:

```jsx
<Link to={`/producto/${producto.id}`}>
  {producto.nombre}
</Link>
```

---

## Ejercicio: Navegación completa con rutas

Construir la estructura de rutas completa de la app:
- `main.jsx` → `BrowserRouter`
- `App.jsx` → `Routes` con rutas anidadas dentro de `Layout`
- `Layout.jsx` → con `<Outlet />`
- `Header.jsx` → con `<Link>`
- `Inicio.jsx` → página de inicio con productos destacados
- `Productos.jsx` → lista de productos con `<Link>` a detalle
- `ProductoDetalle.jsx` → `useParams` + `useEffect` + `fetch`

Ver código en `ejercicios/src/`.
