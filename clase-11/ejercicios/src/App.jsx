import { Routes, Route } from 'react-router-dom';
import Layout from './componentes/layout/Layout';
import Inicio from './pages/Inicio/Inicio';
import ItemListContainer from './componentes/ItemListContainer/ItemListContainer';
import ProductoDetalle from './pages/ProductoDetalle/ProductoDetalle';
import Cart from './componentes/Cart/Cart';
import ProductosNacionales from './pages/ProductosNacionales/ProductosNacionales';
import ProductosNacionalesDetalle from './pages/ProductosNacionales/ProductosNacionalesDetalle';
import Gestion from './componentes/Gestion/Gestion';
import GestionCupones from './componentes/GestionCupones/GestionCupones';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/"                         element={<Inicio />} />
        <Route path="/productos"                element={<ItemListContainer />} />
        <Route path="/producto/:id"             element={<ProductoDetalle />} />
        <Route path="/carrito"                  element={<Cart />} />
        <Route path="/productos-nacionales"     element={<ProductosNacionales />} />
        <Route path="/productos-nacionales/:id" element={<ProductosNacionalesDetalle />} />
        <Route path="/gestion"                  element={<Gestion />} />
        <Route path="/admin/cupones"            element={<GestionCupones />} />
      </Route>
    </Routes>
  );
}

export default App;
