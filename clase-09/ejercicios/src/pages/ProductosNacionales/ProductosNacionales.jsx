import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import styles from './ProductosNacionales.module.css';

const ProductosNacionales = () => {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Referencia a la colección (todavía no trae datos)
    const productosDB = collection(db, 'Productos nacionales');

    // getDocs hace la petición asincrónica
    getDocs(productosDB)
      .then(resp => {
        // resp.docs es el array de documentos; data() trae los campos y doc.id el id
        setProductos(resp.docs.map(doc => ({ ...doc.data(), id: doc.id })));
      })
      .catch(() => setError('No se pudieron cargar los productos.'))
      .finally(() => setCargando(false));
  }, []); // [] → se ejecuta una sola vez al montar

  if (cargando) return <p>Cargando productos...</p>;
  if (error) return <p style={{ color: '#c00' }}>{error}</p>;

  return (
    <div>
      <h1 className={styles.titulo}>Productos Nacionales</h1>
      <div className={styles.grilla}>
        {productos.map(prod => (
          <div key={prod.id} className={styles.card}>
            <img src={prod.imagen} alt={prod.nombre} className={styles.imagen} />
            <h3>{prod.nombre}</h3>
            <p className={styles.categoria}>{prod.categoria}</p>
            <p className={styles.precio}>${prod.precio}</p>
            <p>Stock: {prod.stock} unidades</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductosNacionales;
