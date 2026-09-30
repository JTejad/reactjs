import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

function Item({ id, nombre, precio, stock, imagen }) {
  const producto = { id, nombre, precio, stock, imagen };
  const [cantidad, setCantidad] = useState(1);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(producto, cantidad);
    alert(`Agregaste ${cantidad} unidad(es) de ${nombre} al carrito.`);
  };

  return (
    <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '1rem', width: '200px' }}>
      <img src={imagen} alt={nombre} style={{ maxWidth: '100%', height: '120px', objectFit: 'cover' }} />
      <h3 style={{ fontSize: '1rem' }}>{nombre}</h3>
      <p>${precio}</p>
      <p>Stock: {stock}</p>
      <Link to={`/producto/${id}`}>Ver detalle</Link>
      <br />
      <input
        type="number"
        value={cantidad}
        min={1}
        max={stock}
        onChange={e => setCantidad(Number(e.target.value))}
        style={{ width: '60px', margin: '0.5rem 0' }}
      />
      <button onClick={handleAddToCart}>Agregar {cantidad} al carrito</button>
    </div>
  );
}

export default Item;
