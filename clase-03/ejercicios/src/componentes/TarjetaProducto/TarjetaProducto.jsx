import styles from './TarjetaProducto.module.css';

function TarjetaProducto({ imagen, nombre, precio }) {
  return (
    <div className={styles.tarjeta}>
      <img src={imagen} alt={nombre} className={styles.imagen} />
      <h3 className={styles.nombre}>{nombre}</h3>
      <p className={styles.precio}>${precio}</p>
    </div>
  );
}

export default TarjetaProducto;
