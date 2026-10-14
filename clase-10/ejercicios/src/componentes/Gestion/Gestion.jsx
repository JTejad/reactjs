import { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { FormularioContainer } from '../FormularioContainer/FormularioContainer';

// Panel de administración: Read (listar), Create (formulario) y Delete (botón eliminar)
const Gestion = () => {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const fetchProductos = async () => {
      const productosRef = collection(db, 'Productos nacionales');
      const resp = await getDocs(productosRef);
      setProductos(resp.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    };

    fetchProductos().catch(err => console.error('Error al cargar productos:', err));
  }, []);
  // Ojo: el PDF pone [productos] como dependencia. Como setProductos cambia productos,
  // eso dispara el efecto otra vez → loop infinito de lecturas a Firebase. Va [].

  // Create: el formulario nos avisa del producto nuevo y lo sumamos a la lista
  const handleProductoCreado = (nuevo) => {
    setProductos(prev => [...prev, nuevo]);
  };

  // Delete
  const handleDelete = async (id) => {
    // Acción destructiva → siempre pedir confirmación
    const confirmacion = window.confirm('¿Está seguro de que desea eliminar este producto?');
    if (!confirmacion) return;

    try {
      const docRef = doc(db, 'Productos nacionales', id); // referencia exacta al documento
      await deleteDoc(docRef);                             // lo borra de Firestore
      // Actualizamos el estado local para que desaparezca de la UI al instante
      setProductos(productos.filter(prod => prod.id !== id));
      alert('Producto eliminado.');
    } catch (error) {
      console.error('Error al eliminar:', error);
      alert('No se pudo eliminar el producto.');
    }
  };

  return (
    <div>
      <h2>Gestión de Productos</h2>
      <hr />
      <FormularioContainer onProductoCreado={handleProductoCreado} />
      <hr />
      <h3>Lista de Productos</h3>
      <ul>
        {productos.map(prod => (
          <li key={prod.id} style={{ margin: '0.5rem 0' }}>
            {prod.nombre} - ${prod.precio}
            <button onClick={() => handleDelete(prod.id)} style={{ marginLeft: '10px' }}>
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Gestion;
