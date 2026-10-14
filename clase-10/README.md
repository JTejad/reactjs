# Clase 10 — CRUD con Firebase

## Objetivos
- Entender el ciclo **CRUD** (Crear, Leer, Actualizar, Eliminar)
- **Create**: conectar un formulario de React con Firestore usando `addDoc`
- **Delete**: borrar documentos con `doc` + `deleteDoc`

## Temas

### Detalle de un producto con el ID de Firebase
Cada documento de Firestore tiene un id único, así que ya podemos armar la ruta dinámica del detalle. Herramientas:
- **`<Link>`** para que cada producto lleve a su detalle
- **`useParams`** para leer el id de la URL
- **`doc` + `getDoc`** para traer **un solo** documento

Paso 1 — enlazar y rutear:
```jsx
<Link to={`/productos-nacionales/${prod.id}`}>Ver detalle</Link>
<Route path="/productos-nacionales/:id" element={<ProductosNacionalesDetalle />} />
```

Paso 2 — el contenedor del detalle:
```jsx
const { id } = useParams();
useEffect(() => {
  const docRef = doc(db, 'Productos nacionales', id);
  getDoc(docRef).then(resp => {
    if (resp.exists()) setItem({ ...resp.data(), id: resp.id });
    else console.log('No se encontró el producto');
  });
}, [id]); // se re-ejecuta si cambia el id de la URL
```
- **`doc(db, colección, id)`** — a diferencia de `collection()`, apunta a un documento específico
- **`getDoc(ref)`** — el análogo de `getDocs()` para un solo documento; devuelve una promesa
- **`resp.exists()`** — verificar que exista antes de usar `resp.data()`

### ¿Qué es un CRUD?
| Letra | Operación | En Firestore | En nuestra app |
|---|---|---|---|
| **C** | Create (crear) | `addDoc` | alta de producto |
| **R** | Read (leer) | `getDocs` / `getDoc` | listado y detalle |
| **U** | Update (actualizar) | `updateDoc` | editar precio/stock (próxima clase) |
| **D** | Delete (eliminar) | `deleteDoc` | baja de producto |

### ¿Cómo funciona en React?
React **no hace el CRUD**: arma la interfaz que lo dispara. El flujo es:
1. **Vista** — el usuario completa un formulario y aprieta "Guardar"
2. **Evento** — `onSubmit` ejecuta una función
3. **Lógica** — esa función llama a Firestore (`addDoc`, `updateDoc`, `deleteDoc`)
4. **Estado** — si sale bien, actualizamos el estado con `useState` y la UI se refresca sin recargar

> React gestiona el "qué" y el "cómo" ve el usuario; Firebase se encarga de la persistencia.

### Create — `addDoc`
Reutilizamos el formulario de la clase 06 (`FormularioContainer` + `FormularioProducto`, con subida a Imgbb) y, en vez de solo loguear, guardamos en Firestore:
```js
import { collection, addDoc } from 'firebase/firestore';

const productosCollection = collection(db, 'Productos nacionales'); // si no existe, se crea
const docRef = await addDoc(productosCollection, productoCompleto); // docRef.id = id autogenerado
```
- `addDoc(referenciaColección, objeto)` → crea el documento con **id automático**
- Resetear el formulario solo si todo salió bien
- Los inputs devuelven **strings**: convertir `precio` y `stock` con `Number()` antes de guardar

### Componente `Gestion`
Centraliza la administración:
- Lista los productos de Firestore (Read)
- Muestra `FormularioContainer` para dar de alta (Create)
- Un botón "Eliminar" por producto (Delete)

> ⚠️ El PDF pone `[productos]` en las dependencias del `useEffect`. Como el efecto hace `setProductos`, eso cambia `productos` y vuelve a disparar el efecto → **loop infinito** de lecturas a Firebase (que además se cobran). Lo correcto es `[]`. En el repo, el formulario avisa con un callback (`onProductoCreado`) y Gestion suma el producto a la lista.

### Delete — `deleteDoc`
Se necesita la **referencia exacta** al documento (con `doc`) y pasársela a `deleteDoc`:
```jsx
const handleDelete = async (id) => {
  if (!window.confirm('¿Está seguro de que desea eliminar este producto?')) return;
  const docRef = doc(db, 'Productos nacionales', id);
  await deleteDoc(docRef);
  setProductos(productos.filter(prod => prod.id !== id)); // UI actualizada al instante
};

<button onClick={() => handleDelete(prod.id)}>Eliminar</button>
```
- Borrar es **destructivo e irreversible** → pedir confirmación (`window.confirm`)
- `await` espera a que Firestore termine antes de actualizar la UI
- `filter` saca el producto del estado sin volver a pedir la lista

## Ejercicio (Talento Lab): Gestión de cupones de descuento
Panel para crear y borrar cupones → `src/componentes/GestionCupones/GestionCupones.jsx`
- Formulario con **código** (texto) y **porcentaje** (número) → `addDoc` en la colección `cupones`
- Lista de cupones con código y % de descuento
- Botón "Eliminar" por cupón → `doc` + `deleteDoc`, y la lista se actualiza al instante
- Ruta estática `/admin/cupones` + enlace en el navbar
- Extras: código en mayúsculas, porcentaje entre 1 y 100, sin códigos repetidos

## Archivos de la clase
- `src/pages/ProductosNacionales/ProductosNacionalesDetalle.jsx` — detalle con `doc` + `getDoc`
- `src/componentes/FormularioContainer/` — lógica del formulario + Imgbb + `addDoc`
- `src/componentes/FormularioProducto/` — formulario presentacional (con categoría y `min="0"`)
- `src/componentes/Gestion/Gestion.jsx` — panel de productos (Read + Create + Delete) en `/gestion`
- `src/componentes/GestionCupones/GestionCupones.jsx` — ejercicio de cupones en `/admin/cupones`
- `.env.example` — suma `VITE_IMGBB_API_KEY`

## Preguntas para reflexionar
- **¿Tiene sentido stock o precio negativo? ¿Cómo cambiarlo?** No. Se valida en el front (`min="0"` en el input y un chequeo en `manejarEnvio` antes del `addDoc`) y, para que no se pueda saltear, también en las **reglas de seguridad de Firestore**.
- **¿Cuántos campos necesita el formulario de productos?** Los mismos que el documento: `nombre`, `categoria`, `precio`, `stock` e `imagen` (5). El `id` no va: lo genera Firebase.

## Próximos pasos
- Leer productos desde el estado o la API
- **Update** (editar) y eliminación de productos
- Validación de los formularios de edición
