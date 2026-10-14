# Clase 09 — Lógica del carrito y creación de la BD

## Objetivos
- Mejorar la experiencia de usuario en el carrito
- Renderizado condicional para mostrar contenido dinámico
- Ampliar `CartContext` con nuevas funciones
- Crear el proyecto en Firebase y leer datos de Firestore

## Temas

### Contador conectado al contexto
Problema: el contador de cada producto era estado **local**, así que al navegar y volver se reiniciaba y no "recordaba" cuántas unidades había en el carrito.

Solución en 2 pasos:
1. **Obtener la cantidad desde el contexto** con una nueva función:
```jsx
const getCantidadActual = (productId) => {
  const item = cart.find(item => item.id === productId);
  return item ? item.quantity : 0;
};
```
> Ojo: el PDF usa `item.cantidad`, pero en nuestro carrito el campo se llama `quantity`.

2. **Conectar el contador** en `Item.jsx`: `cantidadActual` sale del contexto (dato global) y el `useState` local solo define cuántas unidades **nuevas** se suman en el próximo clic.

### Renderizado condicional — Finalizar compra y volver al inicio
- Carrito vacío → mensaje "El carrito está vacío" + `<Link to="/productos">` para seguir comprando
- Carrito con productos → lista, total, "Vaciar carrito" y "Finalizar compra" (`<Link to="/">` + alerta)
```jsx
if (cart.length === 0) {
  return ( /* mensaje + Link */ );
}
return ( /* lista del carrito */ );
```

### Eliminar un producto específico
Nuevas funciones en `CartContext`:
- **`removeItem(productId)`** — `filter` devuelve un array nuevo sin ese producto (forma inmutable y declarativa)
- **`isInCart(productId)`** — `some` devuelve `true` si algún item cumple la condición

En `Cart.jsx`, el botón usa arrow function para poder pasar el id:
```jsx
<button onClick={() => removeItem(item.id)}>Eliminar</button>
```

### Firebase: nuestro primer backend
- `productos.json` local no es una base de datos real: no se puede actualizar, no escala y no es accesible desde cualquier lado
- **Firebase**: plataforma de Google con herramientas para apps web y mobile
- **Firestore**: base de datos **NoSQL** en la nube, guarda **documentos** (parecidos a objetos JSON) dentro de **colecciones**
  - Colección ≈ el array / la tabla
  - Documento ≈ cada objeto (cada producto)

#### Paso 1: Configurar el proyecto
1. [Consola de Firebase](https://console.firebase.google.com/) → **Crear un proyecto** (Analytics opcional)
2. Ícono web `</>` → registrar la app con un apodo
3. Copiar el objeto `firebaseConfig` que te da

#### Paso 2: Crear Firestore
1. **Compilación → Firestore Database → Crear base de datos**
2. **Iniciar en modo de prueba** (lectura/escritura sin reglas, solo para desarrollo)
3. Elegir la ubicación más cercana

#### Carga manual de productos
- **+ Iniciar colección** → nombre `Productos nacionales`
- **Agregar documento** → **ID automático** → campos `nombre`, `categoria`, `precio`, `stock`, `imagen`
- Repetir por cada producto (la carga masiva se ve la clase que viene)

### Conectar React con Firestore
```bash
npm install firebase
```
`src/firebase/config.js`:
```js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = { /* datos de la consola */ };
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
```
> En el repo los valores se leen de `.env` (`import.meta.env.VITE_FIREBASE_...`). Copiar `.env.example` como `.env` y completarlo.

### Leer una colección
```jsx
useEffect(() => {
  const productosDB = collection(db, 'Productos nacionales'); // referencia, todavía no trae nada
  getDocs(productosDB).then(resp => {                          // petición asincrónica
    setProductos(resp.docs.map(doc => ({ ...doc.data(), id: doc.id })));
  });
}, []);
```
- `collection(db, nombre)` → crea una referencia ("puntero") a la colección
- `getDocs(ref)` → hace la petición y devuelve una promesa con un `QuerySnapshot`
- `resp.docs` → array de documentos
- `doc.data()` → los campos del documento; `doc.id` → su id
- `setProductos(...)` → actualiza el estado y provoca el re-render

## Ejercicios (Talento Lab)

### Parte 1: Catálogo en expansión
- Cargar **al menos 8 productos** en Firestore, de **al menos 3 categorías**
- Campos: `nombre`, `categoria`, `precio`, `stock`, `imagen`
- Mostrarlos con `ProductosNacionales` y darle estilo a la grilla → `src/pages/ProductosNacionales/`

### Parte 2: Presentando al equipo
- Nueva colección `equipo` con 2 o 3 documentos: `nombre`, `rol`, `linkedinURL`, `fotoURL`
- `Footer.jsx` trae la colección con `useEffect` + `useState` y mapea una tarjeta por integrante (foto, nombre, rol, LinkedIn) → `src/componentes/layout/Footer.jsx`

## Archivos de la clase
- `src/context/CartContext.jsx` — `getCantidadActual`, `removeItem`, `isInCart`
- `src/componentes/Item/Item.jsx` — contador +/− conectado al contexto
- `src/componentes/Cart/Cart.jsx` — renderizado condicional + eliminar por producto
- `src/firebase/config.js` — inicialización de Firebase y export de `db`
- `src/pages/ProductosNacionales/` — lectura de Firestore
- `src/componentes/layout/Footer.jsx` — equipo dinámico desde Firestore

## Preguntas para reflexionar
- **¿Por qué es más seguro manejar los datos desde un entorno como Google que local?** Porque los datos quedan centralizados en un servidor con backups, autenticación y reglas de acceso; un JSON local viaja dentro del bundle, cualquiera lo puede ver y no se puede actualizar sin redeployar.
- **¿Cómo cargar más de un producto a la vez? ¿Conviene?** Con un script que recorra el array y use `addDoc`/`writeBatch`. Conviene para cargas iniciales o migraciones; hay que cuidar no duplicar datos y validar antes de escribir.
- **¿Qué consideraciones de seguridad al cargar/eliminar productos?** No dejar la base en "modo de prueba" en producción, configurar reglas de seguridad de Firestore, que solo usuarios autenticados/administradores puedan escribir o borrar, validar los datos y no subir credenciales sensibles al repo.

## Próximos pasos
- Ciclo **CRUD** (Crear, Leer, Actualizar, Eliminar)
- Create con un formulario + `addDoc`
- Delete con `doc` + `deleteDoc`
