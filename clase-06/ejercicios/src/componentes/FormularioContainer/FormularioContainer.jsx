import { useState } from 'react';
import { FormularioProducto } from '../FormularioProducto/FormularioProducto';

export function FormularioContainer() {
  const [datosForm, setDatosForm] = useState({
    nombre: '',
    precio: '',
    stock: '',
  });
  const [imagenFile, setImagenFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Un solo manejador para todos los inputs de texto (usa el atributo name)
  const manejarCambio = (evento) => {
    const { name, value } = evento.target;
    setDatosForm({ ...datosForm, [name]: value });
  };

  // Manejador separado para el input tipo file
  const manejarCambioImagen = (evento) => {
    setImagenFile(evento.target.files[0]);
  };

  const manejarEnvio = async (evento) => {
    evento.preventDefault();

    if (!imagenFile) {
      alert('Por favor, seleccioná una imagen para el producto.');
      return;
    }

    const apiKey = 'TU-API-KEY'; // Reemplazá con tu clave de imgbb.com

    const formData = new FormData();
    formData.append('image', imagenFile);

    try {
      setLoading(true);
      console.log('Subiendo imagen a Imgbb...');

      const respuestaImgbb = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: 'POST',
        body: formData,
      });
      const datosImgbb = await respuestaImgbb.json();

      if (datosImgbb.success) {
        console.log('Imagen subida con éxito. URL:', datosImgbb.data.url);

        const productoCompleto = {
          ...datosForm,
          urlImagen: datosImgbb.data.url,
        };
        console.log('Enviando los siguientes datos COMPLETOS a la API:', productoCompleto);
      } else {
        throw new Error('La subida de la imagen a Imgbb falló.');
      }
    } catch (error) {
      console.error('Error en el proceso de envío:', error);
      alert('Hubo un error al subir la imagen. Por favor, intentá de nuevo.');
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
