import Item from '../Item/Item';
import styles from './ItemList.module.css';

function ItemList({ productos }) {
  return (
    <div className={styles.grilla}>
      {productos.map(producto => (
        <Item
          key={producto.id}
          id={producto.id}
          nombre={producto.nombre}
          precio={producto.precio}
          stock={producto.stock}
          imagen={producto.imagen}
          categoria={producto.categoria}
        />
      ))}
    </div>
  );
}

export default ItemList;
