import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const Cart = () => {
  const { cart, clearCart, removeItem, getCartTotal } = useCart();

  // Renderizado condicional: carrito vacío → mensaje + botón para seguir comprando
  if (cart.length === 0) {
    return (
      <div>
        <h1>El carrito está vacío</h1>
        <p>Agregá productos para continuar la compra.</p>
        <Link to="/productos" className="btn-volver">Ver productos</Link>
      </div>
    );
  }

  const finalizarCompra = () => {
    alert('¡Gracias por comprar!');
    clearCart();
  };

  // Si hay productos: lista + total + vaciar / finalizar
  return (
    <div>
      <h1>Carrito de Compras</h1>
      {cart.map(item => (
        <div key={item.id} className="cart-item" style={{ borderBottom: '1px solid #ccc', padding: '1rem 0' }}>
          <h4>{item.nombre}</h4>
          <p>Cantidad: {item.quantity}</p>
          <p>Precio unitario: ${item.precio}</p>
          <p>Subtotal: ${item.precio * item.quantity}</p>
          {/* Arrow function para poder pasarle el id */}
          <button onClick={() => removeItem(item.id)}>Eliminar</button>
        </div>
      ))}
      <hr />
      <h3>Total a pagar: ${getCartTotal()}</h3>
      <button onClick={clearCart} className="btn-vaciar">Vaciar carrito</button>
      <Link to="/" onClick={finalizarCompra} className="btn-finalizar" style={{ marginLeft: '1rem' }}>
        Finalizar compra
      </Link>
    </div>
  );
};

export default Cart;
