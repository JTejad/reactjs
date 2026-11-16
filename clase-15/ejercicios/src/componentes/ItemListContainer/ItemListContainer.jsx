import { useState, useEffect } from 'react';
import ItemList from '../ItemList/ItemList';

function ItemListContainer() {
  const [products, setProducts] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/data/productos.json')
      .then(res => {
        if (!res.ok) throw new Error('No se pudieron cargar los productos.');
        return res.json();
      })
      .then(data => setProducts(data))
      .catch(err => setError(err.message))
      .finally(() => setCargando(false));
  }, []);

  if (cargando) return <p>Cargando productos...</p>;
  if (error)    return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Todos los productos</h1>
      <ItemList productos={products} />
    </div>
  );
}

export default ItemListContainer;
