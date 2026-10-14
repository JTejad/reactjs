import { useState } from 'react';
import { FormularioProducto } from '../FormularioProducto/FormularioProducto';
// Funciones de Firestore para CREAR un documento
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';

const estadoInicialForm = {
  nombre: '',
  categoria: '',
  precio: '',
  stock: '',
};

// onProductoCreado: callback que avisa a Gestion para que actualice su lista
export function FormularioContainer({ onProductoCreado }) {
  const [datosForm, setDatosForm] = useState(estadoInicialForm);
  const [imagenFile, setImagenFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const manejarCambio = (evento) => {
    const { name, value } = evento.target;
    setDatosForm({ ...datosForm, [name]: value });
  };

  const manejarCambioImagen = (evento) => {
    setImagenFile(evento.target.files[0]);
  };

  // Sube la imagen a Imgbb (clase 06) y devuelve la URL pública
  const subirImagen = async () => {
    const formData = new FormData();
    formData.append('image', imagenFile);

    const respuesta = await fetch(
      `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
      { method: 'POST', body: formData }
    );
    const datos = await respuesta.json();

    if (!datos.success) throw new Error('La subida de la imagen a Imgbb falló.');
    return datos.data.url;
  };

  const manejarEnvio = async (evento) => {
    evento.preventDefault();

    // Validación: nada de precio o stock negativos
    const precio = Number(datosForm.precio);
    const stock = Number(datosForm.stock);
    if (precio < 0 || stock < 0) {
      alert('El precio y el stock no pueden ser negativos.');
      return;
    }

    if (!imagenFile) {
      alert('Por favor, seleccioná una imagen para el producto.');
      return;
    }

    try {
      setLoading(true);
      const urlImagen = await subirImagen();

      // Los inputs devuelven strings: convertimos a número antes de guardar
      const productoCompleto = {
        nombre: datosForm.nombre.trim(),
        categoria: datosForm.categoria.trim(),
        precio,
        stock,
        imagen: urlImagen,
      };

      // Referencia a la colección (si no existe, Firestore la crea)
      const productosCollection = collection(db, 'Productos nacionales');
      // addDoc(referencia, objeto) → crea el documento con un id automático
      const docRef = await addDoc(productosCollection, productoCompleto);

      onProductoCreado?.({ ...productoCompleto, id: docRef.id });
      alert('Producto creado con éxito.');

      // Reseteamos el formulario solo si todo salió bien
      setDatosForm(estadoInicialForm);
      setImagenFile(null);
      evento.target.reset(); // limpia también el input file
    } catch (error) {
      console.error('Error en el proceso de envío:', error);
      alert('Hubo un error al guardar el producto. Por favor, intentá de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormularioProducto
      datosForm={datosForm}
      manejarCambio={manejarCambio}
      manejarEnvio={manejarEnvio}
      manejarCambioImagen={manejarCambioImagen}
      loading={loading}
    />
  );
}
