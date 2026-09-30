# Clase 08 — Context API

## Temas

### El problema del Prop Drilling
- Pasar props de padres a hijos a través de componentes intermedios que no las necesitan
- Por qué es una mala práctica: dificulta el mantenimiento, genera acoplamiento y es verboso
- Ejemplo: `App → ItemListCont → ItemList → Item → BotonDeCompra` (todos pasan el carrito)

### ¿Qué es la Context API?
- Solución nativa de React para compartir estado global sin prop drilling
- Dos elementos principales:
  - **Provider (Proveedor):** componente que envuelve el árbol y expone los datos
  - **Consumer (Consumidor):** acceso a los datos desde cualquier componente usando `useContext`

### Creación del CartContext
Archivo: `src/context/CartContext.jsx`
```jsx
import { useState, useContext, createContext } from 'react';

export const CartContext = createContext();     // 1. Crear el contexto
export const useCart = () => { ... };           // 2. Custom hook
export const CartProvider = ({ children }) => { // 3. Provider con estado y funciones
  const [cart, setCart] = useState([]);
  // addToCart, clearCart, getCartQuantity, getCartTotal
  return (
    <CartContext.Provider value={{ cart, addToCart, clearCart, getCartQuantity, getCartTotal }}>
      {children}
    </CartContext.Provider>
  );
};
```

### Custom hook `useCart`
- Encapsula `useContext(CartContext)` para simplificar el consumo
- Lanza un error claro si se usa fuera del `CartProvider`
- En lugar de `useContext(CartContext)` en cada componente, simplemente: `useCart()`

### Funciones del carrito
- **`addToCart(product, quantity)`** — suma cantidad si el producto ya existe, o lo agrega nuevo
- **`clearCart()`** — vacía el carrito (`setCart([])`)
- **`getCartQuantity()`** — suma todas las cantidades para el contador en el header
- **`getCartTotal()`** — calcula el precio total (`precio * quantity` de cada item)

### Envolver la app con CartProvider
```jsx
// src/main.jsx
<BrowserRouter>
  <CartProvider>
    <App />
  </CartProvider>
</BrowserRouter>
```
CartProvider va **dentro** de BrowserRouter para que los componentes puedan usar tanto rutas como el carrito.

### Consumir el contexto en componentes
```jsx
// En cualquier componente del árbol:
const { addToCart, getCartQuantity } = useCart();
```
- `Header.jsx` — usa `getCartQuantity()` para mostrar el contador
- `Item.jsx` y `ProductoDetalle.jsx` — usan `addToCart()` con el botón
- `Cart.jsx` — usa `cart`, `clearCart()` y `getCartTotal()`

### Ruta `/carrito`
- Nueva ruta en `App.jsx`: `<Route path="/carrito" element={<Cart />} />`
- `Cart.jsx` consume el contexto directamente, sin recibir props

### Ejercicio práctico: ItemListContainer con fetch
Refactorizar para cargar productos de forma asíncrona:
1. `useState([])` para los productos
2. `useEffect` con `fetch('/data/productos.json')`
3. Actualizar estado con `.then(data => setProducts(data))`
4. Mapear `products` en el return para renderizar `<ItemList />`

### Deploy en Vercel y Netlify
- Verificar con `npm run build` antes de subir
- Agregar variables de entorno (`VITE_IMGBB_API_KEY`) en el panel del hosting
- En Vite: las env vars deben empezar con `VITE_` y se acceden con `import.meta.env.VITE_...`
- Vercel: autodetecta proyectos Vite (Output Directory: `dist`)
- Netlify: Build Command `npm run build`, Publish Directory `dist`

## Ejercicio resuelto

Aplicación completa de e-commerce con Context API:

```
src/
├── context/
│   └── CartContext.jsx          ← createContext + useCart + CartProvider
├── componentes/
│   ├── Cart/
│   │   └── Cart.jsx             ← vista del carrito usando useCart
│   ├── Item/
│   │   └── Item.jsx             ← tarjeta de producto + botón addToCart
│   ├── ItemList/
│   │   └── ItemList.jsx         ← lista de Items
│   ├── ItemListContainer/
│   │   └── ItemListContainer.jsx ← fetch + estados de carga/error
│   └── layout/
│       ├── Header.jsx           ← contador de carrito en navbar
│       ├── Footer.jsx
│       └── Layout.jsx
├── pages/
│   ├── Inicio/
│   ├── ProductoDetalle/         ← detalle con addToCart
├── App.jsx                      ← rutas + /carrito
└── main.jsx                     ← BrowserRouter > CartProvider > App
```
