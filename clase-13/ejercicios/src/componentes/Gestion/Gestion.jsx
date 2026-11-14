import { useState, useEffect } from 'react';
// Sumamos updateDoc para el Update
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { FormularioProducto } from '../FormularioProducto/FormularioProducto';
import styled from 'styled-components';
import { FaEdit, FaTrash, FaTimes } from 'react-icons/fa';

// 1. Componente base: un <button> con estilos encapsulados (no ensucian el CSS global)
const BotonAccion = styled.button`
  background-color: transparent;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
  margin-left: 8px;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
`;

// 2. Variantes que heredan del base y solo cambian los colores (DRY)
const BotonEditar = styled(BotonAccion)`
  border-color: #ffc107;
  color: #b58900;

  &:hover {
    background-color: #ffc107;
    color: white;
  }
`;

const BotonEliminar = styled(BotonAccion)`
  border-color: #dc3545;
  color: #dc3545;

  &:hover {
    background-color: #dc3545;
    color: white;
  }
`;

const estadoInicialForm = {
  nombre: '',
  categoria: '',
  precio: '',
  stock: '',
  imagen: '',
};

// Panel de administración con el CRUD completo: Create, Read, Update y Delete
const Gestion = () => {
  const [productos, setProductos] = useState([]);
  const [datosForm, setDatosForm] = useState(estadoInicialForm);
  const [imagenFile, setImagenFile] = useState(null);
  const [loading, setLoading] = useState(false);
  // null → el formulario crea; con un producto → el formulario edita ese producto
  const [productoAEditar, setProductoAEditar] = useState(null);

  // Read
  useEffect(() => {
    const fetchProductos = async () => {
      const resp = await getDocs(collection(db, 'Productos nacionales'));
      setProductos(resp.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    };
    fetchProductos().catch(err => console.error('Error al cargar productos:', err));
  }, []);

  // Cada vez que cambia productoAEditar, sincronizamos el formulario
  useEffect(() => {
    if (productoAEditar) {
      setDatosForm(productoAEditar);
    } else {
      setDatosForm(estadoInicialForm);
    }
    setImagenFile(null);
  }, [productoAEditar]);

  const manejarCambio = (evento) => {
    const { name, value } = evento.target;
    setDatosForm({ ...datosForm, [name]: value });
  };

  const manejarCambioImagen = (evento) => {
    setImagenFile(evento.target.files[0]);
  };

  const handleEditClick = (producto) => {
    setProductoAEditar(producto);
    window.scrollTo(0, 0); // subimos al formulario
  };

  const cancelarEdicion = () => {
    setProductoAEditar(null); // el useEffect resetea el formulario
  };

  const subirImagen = async () => {
    const formData = new FormData();
    formData.append('image', imagenFile);
    const respuesta = await fetch(
      `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
      { method: 'POST', body: formData }
    );
    const datos = await respuesta.json();
    if (!datos.success) throw new Error('La subida de la imagen falló.');
    return datos.data.url;
  };

  // Create o Update según productoAEditar
  const manejarEnvio = async (evento) => {
    evento.preventDefault();

    // --- Validación manual (antes de tocar Firebase) ---
    const nombre = datosForm.nombre.trim();
    const precio = Number(datosForm.precio);
    const stock = Number(datosForm.stock);

    if (nombre === '') {
      alert('El nombre no puede estar vacío.');
      return;
    }
    if (Number.isNaN(precio) || precio <= 0) {
      alert('El precio debe ser un número mayor que cero.');
      return;
    }
    if (!Number.isInteger(stock) || stock < 0) {
      alert('El stock debe ser un número entero mayor o igual a cero.');
      return;
    }
    // Al crear, la imagen es obligatoria; al editar se puede mantener la actual
    if (!productoAEditar && !imagenFile) {
      alert('Por favor, seleccioná una imagen para el producto.');
      return;
    }

    try {
      setLoading(true);

      // Mantenemos la imagen actual salvo que se haya elegido una nueva
      let urlImagen = datosForm.imagen;
      if (imagenFile) urlImagen = await subirImagen();

      // Armamos el objeto a mano: así no se guarda el id dentro del documento
      const productoFinal = {
        nombre,
        categoria: datosForm.categoria.trim(),
        precio,
        stock,
        imagen: urlImagen,
      };

      if (productoAEditar) {
        // Update: referencia al documento + updateDoc
        const docRef = doc(db, 'Productos nacionales', productoAEditar.id);
        await updateDoc(docRef, productoFinal);
        setProductos(productos.map(p =>
          p.id === productoAEditar.id ? { ...productoFinal, id: p.id } : p
        ));
        alert('Producto actualizado con éxito.');
      } else {
        // Create
        const docRef = await addDoc(collection(db, 'Productos nacionales'), productoFinal);
        setProductos([...productos, { ...productoFinal, id: docRef.id }]);
        alert('Producto guardado con éxito.');
      }

      // Reseteo del formulario (incluido el input file)
      setProductoAEditar(null);
      setDatosForm(estadoInicialForm);
      setImagenFile(null);
      evento.target.reset();
    } catch (error) {
      console.error('Error:', error);
      alert('Hubo un error al guardar el producto. Por favor, intentá de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm('¿Está seguro de que desea eliminar este producto?')) return;

    try {
      await deleteDoc(doc(db, 'Productos nacionales', id));
      setProductos(productos.filter(prod => prod.id !== id));
      if (productoAEditar?.id === id) setProductoAEditar(null);
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
      <FormularioProducto
        datosForm={datosForm}
        manejarCambio={manejarCambio}
        manejarCambioImagen={manejarCambioImagen}
        manejarEnvio={manejarEnvio}
        loading={loading}
        modoEdicion={!!productoAEditar} /* !! convierte el objeto (o null) en booleano */
      />
      {productoAEditar && (
        <BotonAccion onClick={cancelarEdicion} style={{ marginLeft: 0 }}>
          <FaTimes style={{ marginRight: '5px' }} /> Cancelar edición
        </BotonAccion>
      )}
      <hr />
      <h3>Lista de Productos</h3>
      <ul>
        {productos.map(prod => (
          <li key={prod.id} style={{ margin: '0.5rem 0' }}>
            {prod.nombre} - ${prod.precio} - Stock: {prod.stock}
            <BotonEditar onClick={() => handleEditClick(prod)} aria-label={`Editar ${prod.nombre}`}>
              <FaEdit style={{ marginRight: '5px' }} /> Editar
            </BotonEditar>
            <BotonEliminar onClick={() => handleDelete(prod.id)} aria-label={`Eliminar ${prod.nombre}`}>
              <FaTrash style={{ marginRight: '5px' }} /> Eliminar
            </BotonEliminar>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Gestion;
