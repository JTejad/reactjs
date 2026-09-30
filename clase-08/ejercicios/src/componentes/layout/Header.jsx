import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

function Header() {
  const { getCartQuantity } = useCart();
  const totalItems = getCartQuantity();

  return (
    <header style={{ background: '#1a1a2e', color: '#fff', padding: '1rem 2rem' }}>
      <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold' }}>
          Mi Tienda
        </Link>
        <Link to="/productos" style={{ color: '#fff', textDecoration: 'none' }}>
          Productos
        </Link>
        <Link to="/carrito" style={{ color: '#fff', textDecoration: 'none' }}>
          Carrito {totalItems > 0 && <span>({totalItems})</span>}
        </Link>
      </nav>
    </header>
  );
}

export default Header;
