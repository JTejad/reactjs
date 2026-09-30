# Clase 06 - Formularios y carga de imágenes

## Objetivos

- Construir un formulario presentacional simple y reutilizable.
- Manejar los eventos `onChange` y `onSubmit` para crear un **componente controlado**.
- Aplicar el patrón **Contenedor/Presentacional** para separar lógica de vista.
- Integrar la subida de imágenes al servicio externo **Imgbb**.

---

## Temas

### 1. Evento `onChange`

Captura cambios en tiempo real en inputs, selects y textareas.

```jsx
<input
  value={nombre}
  onChange={(e) => setNombre(e.target.value)}
/>
```

Flujo:
1. Usuario escribe → dispara `onChange`
2. `e.target.value` → valor actual del input
3. `setNombre()` → actualiza el estado de React
4. Re-render → el input muestra el nuevo valor

Características:
- Se ejecuta con cada tecla presionada
- Sincroniza el estado con lo que el usuario ve
- Esencial para formularios controlados

### 2. Evento `onSubmit`

Maneja el envío del formulario cuando el usuario hace submit.

```jsx
<form onSubmit={(e) => {
  e.preventDefault(); // evita recargar la página
  console.log('Formulario enviado!');
}}>
```

Características:
- Se ejecuta una sola vez al enviar el form
- `e.preventDefault()` previene la recarga (comportamiento por defecto del navegador)
- Ideal para procesar los datos finales

### 3. Formulario con patrón Contenedor/Presentacional

Se divide la creación del formulario en 3 pasos:

**Paso 1 - Componente presentacional (`FormularioProducto.jsx`)**  
Solo renderiza el HTML. Recibe por props:
- `datosForm`: objeto con los valores de cada campo
- `manejarCambio`: función conectada a `onChange` de cada input
- `manejarEnvio`: función conectada a `onSubmit` del form
- `loading`: boolean para deshabilitar el botón mientras se procesa

**Paso 2 - Contenedor (`FormularioContainer.jsx`)**  
Maneja todo el estado y la lógica:

```jsx
const [datosForm, setDatosForm] = useState({ nombre: '', precio: '', stock: '' });
const [imagenFile, setImagenFile] = useState(null);
const [loading, setLoading] = useState(false);

// Un solo manejador para todos los inputs de texto
const manejarCambio = (evento) => {
  const { name, value } = evento.target;
  setDatosForm({ ...datosForm, [name]: value });
};

// Manejador separado para el input tipo file
const manejarCambioImagen = (evento) => {
  setImagenFile(evento.target.files[0]);
};
```

**Paso 3 - App.jsx**  
Integra `FormularioContainer` junto al resto de la app.

### 4. Subida de imágenes a Imgbb

**Imgbb** es un servicio gratuito de alojamiento de imágenes que da URLs directas.

Se necesita una **API Key** (gratis en imgbb.com → "Acerca" → "API").

Flujo del `manejarEnvio` async:
1. `e.preventDefault()`
2. Validar que haya imagen seleccionada
3. Crear `FormData` y agregar el archivo
4. `fetch` con `method: 'POST'` a la API de Imgbb
5. Obtener la URL de la imagen del response
6. Construir el objeto completo `{ ...datosForm, urlImagen }`
7. Enviar a consola (en el futuro, a un backend)

```jsx
const manejarEnvio = async (evento) => {
  evento.preventDefault();
  if (!imagenFile) { alert('Seleccioná una imagen.'); return; }

  const formData = new FormData();
  formData.append('image', imagenFile);

  try {
    setLoading(true);
    const respuesta = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: 'POST',
      body: formData,
    });
    const datos = await respuesta.json();
    if (datos.success) {
      const productoCompleto = { ...datosForm, urlImagen: datos.data.url };
      console.log('Datos completos:', productoCompleto);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Hubo un error al subir la imagen.');
  } finally {
    setLoading(false);
  }
};
```

---

## Ejercicio: Formulario de carga de productos

Construir un formulario de alta de productos aplicando los conceptos de la clase:
- `FormularioProducto.jsx` (presentacional): nombre, precio, stock, imagen
- `FormularioContainer.jsx` (contenedor): estado + lógica de envío + subida a Imgbb
- Estado de `loading` que deshabilita el botón mientras se sube la imagen

Ver código en `ejercicios/src/`.

> **Nota:** Para la parte de Imgbb, reemplazá `'TU-API-KEY'` en `FormularioContainer.jsx` con tu clave real.
