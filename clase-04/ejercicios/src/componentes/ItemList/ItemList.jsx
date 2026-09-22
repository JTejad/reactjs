import { Item } from '../Item/Item';

export function ItemList({ productos }) {
  return (
    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center', padding: '2rem' }}>
      {productos.map((prod) => (
        <Item key={prod.id} {...prod} />
      ))}
    </div>
  );
}
