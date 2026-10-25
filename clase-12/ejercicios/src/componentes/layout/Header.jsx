import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const linkStyle = { color: '#fff', textDecoration: 'none' };

function Header() {
  const { getCartQuantity } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const totalItems = getCartQuantity();

  const cerrarSesion = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header style={{ background: '#1a1a2e', color: '#fff', padding: '1rem 2rem' }}>
      <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <Link to="/" style={{ ...linkStyle, fontWeight: 'bold' }}>Mi Tienda</Link>
        <Link to="/productos" style={linkStyle}>Productos</Link>
        <Link to="/productos-nacionales" style={linkStyle}>Nacionales</Link>

        {/* Renderizado condicional según la sesión y el rol */}
        {user?.rol === 'admin' && (
          <>
            <Link to="/gestion" style={linkStyle}>Gestión</Link>
            <Link to="/admin/cupones" style={linkStyle}>Cupones</Link>
          </>
        )}

        <Link to="/carrito" style={linkStyle}>
          Carrito {totalItems > 0 && <span>({totalItems})</span>}
        </Link>

        <span style={{ marginLeft: 'auto', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {user ? (
            <>
              <Link to="/perfil" style={linkStyle}>¡Hola, {user.email}!</Link>
              <button onClick={cerrarSesion}>Cerrar sesión</button>
            </>
          ) : (
            <Link to="/login" style={linkStyle}>Login</Link>
          )}
        </span>
      </nav>
    </header>
  );
}

export default Header;
