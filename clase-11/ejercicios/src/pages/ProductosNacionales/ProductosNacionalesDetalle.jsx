import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
// Para traer UN solo documento: doc (referencia) + getDoc (petición)
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useCart } from '../../context/CartContext';
import styles from './ProductosNacionales.module.css';

const ProductosNacionalesDetalle = () => {
  const [prod, setItem] = useState(null);
  const [noEncontrado, setNoEncontrado] = useState(false);
  const { id } = useParams(); // id del documento de Firebase, tomado de la URL
  const { addToCart } = useCart();

  useEffect(() => {
    if (!id) return;

    // doc(db, colección, id) → referencia a un documento específico
    const docRef = doc(db, 'Productos nacionales', id);

    getDoc(docRef)
      .then(resp => {
        // exists() antes de usar data(): el id puede no existir
        if (resp.exists()) {
          setItem({ ...resp.data(), id: resp.id });
        } else {
          setNoEncontrado(true);
        }
      })
      .catch(error => {
        console.error(error);
        setNoEncontrado(true);
      });
  }, [id]); // se vuelve a ejecutar si cambia el id de la URL

  if (noEncontrado) {
    return (
      <div>
        <p>No se encontró el producto.</p>
        <Link to="/productos-nacionales">Volver al listado</Link>
      </div>
    );
  }

  return (
    <div className={styles.card} style={{ maxWidth: '400px', margin: '0 auto' }}>
      {prod ? (
        <>
          <img src={prod.imagen} alt={prod.nombre} className={styles.imagen} />
          <h2>{prod.nombre}</h2>
          <p className={styles.categoria}>{prod.categoria}</p>
          <p className={styles.precio}>${prod.precio}</p>
          <p>Stock: {prod.stock} unidades</p>
          <button onClick={() => addToCart(prod, 1)} disabled={prod.stock <= 0}>
            Agregar al carrito
          </button>
          <br />
          <Link to="/productos-nacionales">Volver al listado</Link>
        </>
      ) : (
        <p>Cargando producto...</p>
      )}
    </div>
  );
};

export default ProductosNacionalesDetalle;
