import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Inicio() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    fetch('/data/productos.json')
      .then(res => res.json())
      .then(data => setProductos(data.slice(0, 3))); // muestra solo 3 destacados
  }, []);

  return (
    <div>
      <h1>Bienvenido a nuestra tienda</h1>
      <p>Encontrá los mejores productos tecnológicos al mejor precio.</p>

      <h2>Productos destacados</h2>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        {productos.map(producto => (
          <div key={producto.id} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '1rem', width: '200px' }}>
            <h3>{producto.nombre}</h3>
            <p>${producto.precio}</p>
            <Link to={`/producto/${producto.id}`}>Ver detalle →</Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Inicio;
