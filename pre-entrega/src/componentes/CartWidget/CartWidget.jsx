import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import styles from './CartWidget.module.css';

function CartWidget() {
  const { getCartQuantity } = useCart();
  const total = getCartQuantity();

  return (
    <Link to="/carrito" className={styles.widget}>
      <span className={styles.icon}>🛒</span>
      {total > 0 && <span className={styles.badge}>{total}</span>}
      Carrito
    </Link>
  );
}

export default CartWidget;
