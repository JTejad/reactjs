# Clase 11 — Actualizar y validación

## Objetivos
- **Completar el CRUD** con la operación Update (editar productos en Firestore)
- Entender por qué y cómo **validar formularios**

## Temas

### Update: evolución de `Gestion.jsx`
La lógica del formulario pasa a vivir en `Gestion` (el formulario queda presentacional). Pasos:

1. **Importar `updateDoc` y `doc`**
```js
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
```
2. **Estado de edición** — si es `null` el formulario crea; si tiene un producto, edita
```js
const [productoAEditar, setProductoAEditar] = useState(null);
```
3. **Poblar el formulario** con un `useEffect` que "escucha" a `productoAEditar`
```js
useEffect(() => {
  if (productoAEditar) setDatosForm(productoAEditar);
  else setDatosForm(estadoInicialForm);
}, [productoAEditar]);
```
4. **`handleEditClick`** — solo setea el producto elegido
```js
const handleEditClick = (producto) => setProductoAEditar(producto);
```
5. **`manejarEnvio` decide** crear o actualizar
```js
let urlImagen = datosForm.imagen;           // por defecto, la imagen actual
if (imagenFile) urlImagen = await subirImagen();
const productoFinal = { ...datosForm, imagen: urlImagen };

if (productoAEditar) {
  await updateDoc(doc(db, 'Productos nacionales', productoAEditar.id), productoFinal);
} else {
  await addDoc(collection(db, 'Productos nacionales'), productoFinal);
}
```
6. **Cancelar edición** — vuelve `productoAEditar` a `null` y el `useEffect` resetea el formulario
```jsx
{productoAEditar && <button onClick={cancelarEdicion}>Cancelar edición</button>}
```

> En el repo, `productoFinal` se arma campo por campo (en vez de `...datosForm`) para que el `id` no se guarde **dentro** del documento, y `precio`/`stock` se convierten con `Number()`.
> Ojo: el PDF pega la API key de Imgbb en el código. Acá se lee de `.env` (`VITE_IMGBB_API_KEY`).

### Adaptación de `FormularioProducto.jsx`
1. **Prop `modoEdicion`** — desde Gestion: `modoEdicion={!!productoAEditar}` (`!!` convierte objeto/`null` en `true`/`false`)
2. **Contenido dinámico** con ternarios:
```jsx
<h3>{modoEdicion ? 'Editar producto' : 'Agregar nuevo producto'}</h3>
<button type="submit">{modoEdicion ? 'Actualizar producto' : 'Guardar producto'}</button>
```
3. **Imagen actual** con renderizado condicional: `{modoEdicion && datosForm.imagen && <img ... />}`

### Validación de formularios
Asegurar que lo que ingresa el usuario sea **correcto, completo y seguro** antes de mandarlo al servidor.

**¿Por qué validar?**
- **Integridad de datos** — el stock no puede ser negativo, el nombre no puede estar vacío
- **UX** — feedback inmediato y claro sin esperar al servidor
- **Seguridad** — primera línea de defensa contra datos maliciosos o mal formateados

**Tipos**
- **Cliente (client-side)** — en el navegador/React. Rápida, mejora la UX
- **Servidor (server-side)** — en el backend (ej. Firebase Functions o reglas de Firestore). Es la **definitiva**, porque la del cliente se puede saltear

**Técnicas en React**
1. **HTML5 nativo** — `required`, `minLength`/`maxLength`, `type="number"`, `min`/`max`, `pattern` (regex)
2. **Manual en el `onSubmit`** — control total de la lógica y los mensajes:
```js
if (datosForm.nombre.trim() === '' || datosForm.precio <= 0) {
  alert('Por favor, complete todos los campos y asegúrese de que el precio sea mayor a cero.');
  return; // corta antes de llegar a Firebase
}
```
3. **Librerías** — **Formik** y **React Hook Form** (estándar en la industria para formularios complejos; no se usan en el curso)

## Ejercicio (Talento Lab): Completar el CRUD — Edición y Validación
→ `src/componentes/Gestion/Gestion.jsx` + `src/componentes/FormularioProducto/FormularioProducto.jsx`
- Botón **Editar** en cada producto de la lista → setea `productoAEditar`
- El formulario se **carga solo** con los datos del producto (`useEffect` sobre `productoAEditar`)
- Título y botón cambian según el modo ("Agregar" vs. "Actualizar")
- En modo edición se usa **`updateDoc`** con el id del producto (no se crea uno nuevo)
- Validación: **nombre no vacío** y **precio numérico mayor que cero** → si falla, `alert` y no se envía nada
- Extras: stock entero ≥ 0, imagen obligatoria solo al crear, botón "Cancelar edición", la lista se actualiza sin recargar

## Archivos de la clase
- `src/componentes/Gestion/Gestion.jsx` — estado del formulario, `productoAEditar`, create/update/delete y validación
- `src/componentes/FormularioProducto/FormularioProducto.jsx` — `modoEdicion`, imagen actual y validación HTML5
- (Se elimina `FormularioContainer`: su lógica pasó a `Gestion`)

## Preguntas para reflexionar
- **¿Por qué incluir `productoAEditar` en las dependencias del `useEffect`? ¿Qué pasa si no?** Porque es lo que tiene que "escuchar": cada vez que cambia (tocás Editar en otro producto o cancelás), el efecto vuelve a correr y repuebla el formulario. Sin esa dependencia (con `[]`) correría una sola vez al montar y el formulario nunca se llenaría al tocar Editar; sin array, correría en cada render y pisaría lo que el usuario escribe.
- **HTML5 vs. validación manual en el `onSubmit`**
  - HTML5: ✅ cero código, mensajes nativos instantáneos, accesible. ❌ mensajes poco personalizables, reglas limitadas (no compara campos ni reglas de negocio) y se saltea fácil desde DevTools.
  - Manual: ✅ control total de reglas y mensajes, reglas de negocio complejas. ❌ más código y más repetitivo.
  - Lo ideal es combinarlas, y siempre respaldar con validación del lado del servidor.

## Próximos pasos
- Sistema de autenticación completo
- Contexto de autenticación (sesión iniciada/cerrada) global
- Componente Login con Firebase
- Rutas protegidas
