import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const ProductoDetalle = () => {
  const { id } = useParams(); // extrae el :id de la URL
  const [producto, setProducto] = useState(null);

  useEffect(() => {
    fetch('/data/productos.json')
      .then(res => res.json())
      .then(data => {
        const encontrado = data.find(p => p.id === parseInt(id));
        setProducto(encontrado);
      })
      .catch(error => console.error('Error al cargar el producto:', error));
  }, [id]); // se vuelve a ejecutar si cambia el id en la URL

  if (!producto) return <h2>Cargando detalle del producto...</h2>;
  if (!producto.id) return <h2>Producto no encontrado.</h2>;

  return (
    <div style={{ maxWidth: '500px' }}>
      <Link to="/productos">← Volver al catálogo</Link>
      <h2>Detalle del Producto: {producto.nombre}</h2>
      <img src={producto.imagen} alt={producto.nombre} style={{ maxWidth: '400px' }} />
      <h3>${producto.precio}</h3>
      <p>{producto.descripcion}</p>
      <p>Stock disponible: {producto.stock}</p>
    </div>
  );
};

export default ProductoDetalle;
