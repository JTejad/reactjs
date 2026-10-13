import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import Modal from '../../componentes/Modal/Modal';
import styles from './Cart.module.css';

function Cart() {
  const { cart, removeFromCart, clearCart, getCartTotal } = useCart();
  const [modalAbierto, setModalAbierto] = useState(false);

  if (cart.length === 0) {
    return (
      <div className={styles.vacio}>
        <span className={styles.vacioIcon}>🛒</span>
        <h2>Tu carrito está vacío</h2>
        <p>Agregá productos desde el catálogo para verlos acá.</p>
        <Link to="/productos" className={styles.btnVolver}>Ir al catálogo</Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.items}>
        <div className={styles.itemsHeader}>
          <h2 className={styles.titulo}>Mi carrito ({cart.length} {cart.length === 1 ? 'producto' : 'productos'})</h2>
          <button onClick={clearCart} className={styles.vaciarLink}>Vaciar carrito</button>
        </div>

        {cart.map(item => (
          <div key={item.id} className={styles.item}>
            <img src={item.imagen} alt={item.nombre} className={styles.imagen} />
            <div className={styles.info}>
              <p className={styles.itemNombre}>{item.nombre}</p>
              <p className={styles.itemCat}>{item.categoria}</p>
              {item.envioGratis && <p className={styles.envio}>🚚 Envío gratis</p>}
              <button onClick={() => removeFromCart(item.id)} className={styles.eliminar}>Eliminar</button>
            </div>
            <div className={styles.precioCol}>
              <p className={styles.itemCantidad}>Cantidad: {item.quantity}</p>
              <p className={styles.itemPrecio}>${(item.precio * item.quantity).toLocaleString('es-AR')}</p>
              {item.cuotas && (
                <p className={styles.itemCuotas}>
                  en {item.cuotas} cuotas de ${Math.round(item.precio / item.cuotas).toLocaleString('es-AR')}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.resumen}>
        <h3 className={styles.resumenTitulo}>Resumen de compra</h3>
        <div className={styles.resumenRow}>
          <span>Productos ({cart.reduce((a, i) => a + i.quantity, 0)})</span>
          <span>${getCartTotal().toLocaleString('es-AR')}</span>
        </div>
        <div className={styles.resumenRow}>
          <span>Envío</span>
          <span className={styles.gratis}>Gratis</span>
        </div>
        <hr className={styles.sep} />
        <div className={styles.resumenTotal}>
          <span>Total</span>
          <span>${getCartTotal().toLocaleString('es-AR')}</span>
        </div>
        {modalAbierto && <Modal onClose={() => setModalAbierto(false)} />}
        <button className={styles.btnComprar} onClick={() => setModalAbierto(true)}>Finalizar compra</button>
      </div>
    </div>
  );
}

export default Cart;
