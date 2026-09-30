import { useCart } from '../../context/CartContext';

const Cart = () => {
  const { cart, clearCart, getCartTotal } = useCart();

  if (cart.length === 0) {
    return (
      <div>
        <h1>Carrito de Compras</h1>
        <p>Agrega productos para continuar la compra.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Carrito de Compras</h1>
      {cart.map(item => (
        <div key={item.id} className="cart-item" style={{ borderBottom: '1px solid #ccc', padding: '1rem 0' }}>
          <h4>{item.nombre}</h4>
          <p>Cantidad: {item.quantity}</p>
          <p>Precio unitario: ${item.precio}</p>
          <p>Subtotal: ${item.precio * item.quantity}</p>
        </div>
      ))}
      <hr />
      <h3>Total a pagar: ${getCartTotal()}</h3>
      <button onClick={clearCart}>Vaciar Carrito</button>
    </div>
  );
};

export default Cart;
