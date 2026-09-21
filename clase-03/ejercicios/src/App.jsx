import { Layout } from './componentes/layout/Layout';
import TarjetaProducto from './componentes/TarjetaProducto/TarjetaProducto';

const productos = [
  { id: 1, nombre: 'Remera Básica', precio: 4500, imagen: 'https://via.placeholder.com/200x150' },
  { id: 2, nombre: 'Pantalón Cargo', precio: 12000, imagen: 'https://via.placeholder.com/200x150' },
  { id: 3, nombre: 'Zapatillas Urbanas', precio: 25000, imagen: 'https://via.placeholder.com/200x150' },
];

function App() {
  return (
    <Layout>
      <h2 style={{ padding: '20px' }}>Nuestros Productos</h2>
      <div style={{ display: 'flex', gap: '20px', padding: '0 20px', flexWrap: 'wrap' }}>
        {productos.map((producto) => (
          <TarjetaProducto
            key={producto.id}
            nombre={producto.nombre}
            precio={producto.precio}
            imagen={producto.imagen}
          />
        ))}
      </div>
    </Layout>
  );
}

export default App;
