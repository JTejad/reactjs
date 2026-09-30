import { Routes, Route } from 'react-router-dom';
import Layout from './componentes/layout/Layout';
import Inicio from './pages/Inicio/Inicio';
import Productos from './pages/Productos/Productos';
import ProductoDetalle from './pages/ProductoDetalle/ProductoDetalle';

function App() {
  return (
    <Routes>
      {/* Ruta padre: muestra Layout (Header + Outlet + Footer) en todas las páginas */}
      <Route element={<Layout />}>
        <Route path="/"                element={<Inicio />} />
        <Route path="/productos"       element={<Productos Mensaje="Todos los productos" />} />
        <Route path="/producto/:id"    element={<ProductoDetalle />} />
      </Route>
    </Routes>
  );
}

export default App;
