import { Link } from 'react-router-dom';
import styles from './Item.module.css';

function Item({ id, nombre, precio, precioAnterior, stock, imagen, envioGratis, cuotas, rating, vendidos }) {
  const descuento = precioAnterior
    ? Math.round((1 - precio / precioAnterior) * 100)
    : null;

  const estrellas = rating ? '★'.repeat(Math.round(rating)) + '☆'.repeat(5 - Math.round(rating)) : null;

  return (
    <Link to={`/producto/${id}`} className={styles.card}>
      <div className={styles.imgWrapper}>
        <img src={imagen} alt={nombre} className={styles.imagen} />
      </div>
      <div className={styles.body}>
        {precioAnterior && (
          <p className={styles.precioAnterior}>${precioAnterior.toLocaleString('es-AR')}</p>
        )}
        <div className={styles.precioRow}>
          <span className={styles.precio}>${precio.toLocaleString('es-AR')}</span>
          {descuento && <span className={styles.descuento}>{descuento}% OFF</span>}
        </div>
        {cuotas && (
          <p className={styles.cuotas}>en {cuotas} cuotas sin interés de ${Math.round(precio / cuotas).toLocaleString('es-AR')}</p>
        )}
        {envioGratis && <p className={styles.envio}>Envío gratis</p>}
        <p className={styles.nombre}>{nombre}</p>
        {rating && (
          <div className={styles.rating}>
            <span className={styles.estrellas}>{estrellas}</span>
            <span className={styles.vendidos}>{vendidos} reseñas</span>
          </div>
        )}
      </div>
    </Link>
  );
}

export default Item;
