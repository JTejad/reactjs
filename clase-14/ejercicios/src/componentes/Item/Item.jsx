import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

function Item({ id, nombre, precio, stock, imagen }) {
  const producto = { id, nombre, precio, stock, imagen };
  const { addToCart, getCantidadActual } = useCart();

  // Contador local: cuántas unidades NUEVAS se van a sumar en el próximo clic
  const [cantidad, setCantidad] = useState(1);

  // Dato global: cuántas unidades ya hay en el carrito (no se pierde al navegar)
  const cantidadActual = getCantidadActual(id);
  const disponibles = stock - cantidadActual;

  const incrementar = () => {
    if (cantidad < disponibles) setCantidad(cantidad + 1);
  };

  const decrementar = () => {
    if (cantidad > 1) setCantidad(cantidad - 1);
  };

  const handleAddToCart = () => {
    addToCart(producto, cantidad);
    setCantidad(1);
  };

  return (
    <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '1rem', width: '200px' }}>
      <img src={imagen} alt={nombre} style={{ maxWidth: '100%', height: '120px', objectFit: 'cover' }} />
      <h3 style={{ fontSize: '1rem' }}>{nombre}</h3>
      <p>${precio}</p>
      <p>Stock: {stock}</p>
      <Link to={`/producto/${id}`}>Ver detalle</Link>

      <p style={{ fontSize: '0.85rem', color: '#555' }}>En el carrito: {cantidadActual}</p>

      {disponibles > 0 ? (
        <>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '10px 0' }}>
            <button onClick={decrementar}>-</button>
            <p style={{ margin: '0 15px', fontWeight: 'bold' }}>{cantidad}</p>
            <button onClick={incrementar}>+</button>
          </div>
          <button onClick={handleAddToCart}>Agregar {cantidad} al carrito</button>
        </>
      ) : (
        <p style={{ color: '#c00' }}>Sin stock disponible</p>
      )}
    </div>
  );
}

export default Item;
