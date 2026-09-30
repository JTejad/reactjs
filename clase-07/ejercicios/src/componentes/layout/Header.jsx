import { Link } from 'react-router-dom';

function Header() {
  return (
    <header style={{ background: '#1a1a2e', padding: '1rem 2rem' }}>
      <nav>
        <ul style={{ listStyle: 'none', display: 'flex', gap: '1.5rem', margin: 0, padding: 0 }}>
          <li><Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>Inicio</Link></li>
          <li><Link to="/productos" style={{ color: '#fff', textDecoration: 'none' }}>Productos</Link></li>
          <li><Link to="/alta" style={{ color: '#fff', textDecoration: 'none' }}>Alta de Producto</Link></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
