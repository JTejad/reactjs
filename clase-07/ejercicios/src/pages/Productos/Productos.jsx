import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Productos({ Mensaje }) {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/data/productos.json')
      .then(res => {
        if (!res.ok) throw new Error('No se pudieron cargar los productos.');
        return res.json();
      })
      .then(data => setProductos(data))
      .catch(err => setError(err.message))
      .finally(() => setCargando(false));
  }, []);

  if (cargando) return <p>Cargando productos...</p>;
  if (error)    return <p>Error: {error}</p>;

  return (
    <div>
      <h1>{Mensaje}</h1>
      <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        {productos.map(producto => (
          <li key={producto.id} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '1rem', width: '180px' }}>
            <Link to={`/producto/${producto.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <h2 style={{ fontSize: '1rem' }}>{producto.nombre}</h2>
              <p>Precio: ${producto.precio}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Productos;
