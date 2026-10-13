import { Link } from 'react-router-dom';
import styles from './Inicio.module.css';

const categorias = [
  { nombre: 'Computadoras',    emoji: '💻' },
  { nombre: 'Monitores',       emoji: '🖥️' },
  { nombre: 'Periféricos',     emoji: '⌨️' },
  { nombre: 'Audio',           emoji: '🎧' },
  { nombre: 'Fotografía',      emoji: '📷' },
  { nombre: 'Almacenamiento',  emoji: '💾' },
];

function Inicio() {
  return (
    <div className={styles.page}>
      <div className={styles.banner}>
        <div className={styles.bannerContent}>
          <p className={styles.bannerSub}>Tecnología al mejor precio</p>
          <h1 className={styles.bannerTitulo}>¡Enviamos a todo el país!</h1>
          <p className={styles.bannerDesc}>Encontrá los mejores productos con hasta 24 cuotas sin interés.</p>
          <Link to="/productos" className={styles.bannerBtn}>Ver ofertas</Link>
        </div>
        <div className={styles.bannerIllustration}>🛍️</div>
      </div>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Categorías</h2>
        <div className={styles.cats}>
          {categorias.map(cat => (
            <Link key={cat.nombre} to={`/productos?categoria=${encodeURIComponent(cat.nombre)}`} className={styles.catCard}>
              <span className={styles.catEmoji}>{cat.emoji}</span>
              <span className={styles.catNombre}>{cat.nombre}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.promos}>
          <div className={styles.promo} style={{ background: '#fff0f3' }}>
            <strong>🚚 Envío gratis</strong>
            <p>En miles de productos sin mínimo de compra.</p>
          </div>
          <div className={styles.promo} style={{ background: '#f0f8ff' }}>
            <strong>💳 Hasta 24 cuotas</strong>
            <p>Sin interés con todas las tarjetas.</p>
          </div>
          <div className={styles.promo} style={{ background: '#f0fff4' }}>
            <strong>🔒 Compra segura</strong>
            <p>Tu dinero devuelto si el producto no llega.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Inicio;
