# Clase 04 - Flujo de datos, Hooks y Eventos

## Temas vistos

- flujo de datos contenedor-presentacional en 3 niveles:
  - `ItemListContainer` (cerebro): tiene los datos, no le importa la vista
  - `ItemList` (organizador): recibe la lista y la mapea, delega a `Item`
  - `Item` (exhibidor): componente presentacional puro, muestra un producto
- eventos en React: sintaxis camelCase (`onClick`, `onChange`, `onSubmit`, `onMouseOver`)
- `useState`: hook para manejar estado local en componentes funcionales
  - devuelve `[valor, setValor]`
  - el estado inicial se pasa como argumento: `useState(0)`
  - la única forma correcta de cambiar el estado es usando la función `set`
  - cada cambio de estado provoca un re-render del componente
- estado local: cada instancia de un componente tiene su propia memoria independiente
- combinando estado + eventos: selector de cantidad por producto con límite de stock

## Idea principal

En esta clase aprendimos a darle vida a nuestra app con eventos y estado. El hook `useState` le da "memoria" a los componentes y junto con los eventos del usuario hacemos que la interfaz reaccione en tiempo real.

## Reglas clave de useState

- nunca modificar el estado directamente (ej: `contador = contador + 1` ❌)
- siempre usar la función setter: `setContador(contador + 1)` ✅
- el valor inicial solo se usa en el primer render
- por convención: `const [nombre, setNombre] = useState(valorInicial)`

## Ejercicios de la clase

Los ejercicios resueltos están en `ejercicios/src/`.
