import styles from './Header.module.css';

function Header() {
  return (
    <header className={styles.header}>
      <h1>Mi E-commerce</h1>
      <nav className={styles.nav}>
        <a href="#">Inicio</a>
        <a href="#">Productos</a>
        <a href="#">Contacto</a>
        <a href="#">Carrito</a>
      </nav>
    </header>
  );
}

export default Header;
