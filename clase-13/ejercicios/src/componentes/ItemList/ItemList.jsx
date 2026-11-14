import Item from '../Item/Item';

function ItemList({ productos }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
      {productos.map(producto => (
        <Item
          key={producto.id}
          id={producto.id}
          nombre={producto.nombre}
          precio={producto.precio}
          stock={producto.stock}
          imagen={producto.imagen}
        />
      ))}
    </div>
  );
}

export default ItemList;
