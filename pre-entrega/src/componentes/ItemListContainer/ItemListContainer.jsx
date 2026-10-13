import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import ItemList from '../ItemList/ItemList';

// Saca tildes y mayúsculas para que "camara" encuentre "Cámara"
const normalizar = (texto) =>
  texto.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

function ItemListContainer() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const categoria = searchParams.get('categoria');
  const busqueda = (searchParams.get('q') || '').trim();

  useEffect(() => {
    fetch('/data/productos.json')
      .then(res => {
        if (!res.ok) throw new Error('No se pudieron cargar los productos.');
        return res.json();
      })
      .then(data => setProductos(data))
      .catch(err => setError(err.message))
      .finally(() => setCargando(false));
  }, []);

  if (cargando) return <p style={{ color: '#666', padding: '2rem' }}>Cargando productos...</p>;
  if (error)    return <p style={{ color: '#c00', padding: '2rem' }}>Error: {error}</p>;

  const palabras = normalizar(busqueda).split(/\s+/).filter(Boolean);

  const visibles = productos.filter(p => {
    if (categoria && p.categoria !== categoria) return false;
    const contenido = normalizar(`${p.nombre} ${p.categoria} ${p.descripcion}`);
    return palabras.every(palabra => contenido.includes(palabra));
  });

  const titulo = busqueda
    ? `Resultados para "${busqueda}"`
    : categoria || 'Todos los productos';

  return (
    <section>
      <h1 style={{ color: '#333', fontSize: '1.3rem', fontWeight: 600, margin: '0 0 0.25rem' }}>
        {titulo}
      </h1>
      <p style={{ color: '#666', fontSize: '0.85rem', margin: '0 0 0.75rem' }}>
        {visibles.length} {visibles.length === 1 ? 'resultado' : 'resultados'}
        {(categoria || busqueda) && <> · <Link to="/productos">Ver todos</Link></>}
      </p>
      {visibles.length > 0
        ? <ItemList productos={visibles} />
        : <p style={{ color: '#666', padding: '2rem 0' }}>No encontramos productos que coincidan.</p>}
    </section>
  );
}

export default ItemListContainer;
