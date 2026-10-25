import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const ProductoDetalle = () => {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    fetch('/data/productos.json')
      .then(res => res.json())
      .then(data => {
        const encontrado = data.find(p => p.id === parseInt(id));
        setProducto(encontrado);
      })
      .catch(error => console.error('Error al cargar el producto:', error));
  }, [id]);

  if (!producto) return <h2>Cargando detalle del producto...</h2>;
  if (!producto.id) return <h2>Producto no encontrado.</h2>;

  const handleAddToCart = () => {
    addToCart(producto, cantidad);
    alert(`Agregaste ${cantidad} unidad(es) de ${producto.nombre} al carrito.`);
  };

  return (
    <div style={{ maxWidth: '500px' }}>
      <Link to="/productos">← Volver al catálogo</Link>
      <h2>{producto.nombre}</h2>
      <img src={producto.imagen} alt={producto.nombre} style={{ maxWidth: '100%' }} />
      <h3>${producto.precio}</h3>
      <p>{producto.descripcion}</p>
      <p>Stock disponible: {producto.stock}</p>
      <input
        type="number"
        value={cantidad}
        min={1}
        max={producto.stock}
        onChange={e => setCantidad(Number(e.target.value))}
        style={{ width: '60px', marginRight: '1rem' }}
      />
      <button onClick={handleAddToCart}>Agregar al carrito</button>
    </div>
  );
};

export default ProductoDetalle;
