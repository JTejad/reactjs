import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import CartWidget from '../CartWidget/CartWidget';
import styles from './Header.module.css';

function Header() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const enCatalogo = pathname === '/productos';
  const categoriaActiva = enCatalogo ? searchParams.get('categoria') : null;
  const busquedaActual = enCatalogo ? searchParams.get('q') || '' : '';
  const [texto, setTexto] = useState(busquedaActual);

  useEffect(() => {
    setTexto(busquedaActual);
  }, [busquedaActual]);

  const buscar = (evento) => {
    evento.preventDefault();
    const consulta = texto.trim();
    navigate(consulta ? `/productos?q=${encodeURIComponent(consulta)}` : '/productos');
  };

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoText}>TechStore</span>
        </Link>

        <form className={styles.searchBar} onSubmit={buscar} role="search">
          <input
            type="search"
            placeholder="Buscar productos, marcas y más..."
            className={styles.searchInput}
            value={texto}
            onChange={e => setTexto(e.target.value)}
            aria-label="Buscar productos"
          />
          <button type="submit" className={styles.searchBtn} aria-label="Buscar">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
          </button>
        </form>

        <nav className={styles.nav}>
          <NavLink to="/"          end className={({ isActive }) => isActive ? styles.active : ''}>Inicio</NavLink>
          <NavLink to="/productos"     className={({ isActive }) => isActive ? styles.active : ''}>Productos</NavLink>
          <CartWidget />
        </nav>
      </div>

      <div className={styles.categorias}>
        {['Computadoras', 'Monitores', 'Periféricos', 'Audio', 'Fotografía', 'Almacenamiento'].map(cat => (
          <Link
            key={cat}
            to={`/productos?categoria=${encodeURIComponent(cat)}`}
            className={`${styles.catLink} ${cat === categoriaActiva ? styles.catActiva : ''}`}
          >
            {cat}
          </Link>
        ))}
      </div>
    </header>
  );
}

export default Header;
