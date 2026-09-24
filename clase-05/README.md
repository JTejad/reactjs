# Clase 05 - Uso de useEffect y APIs

## Objetivos

- Comprender los efectos secundarios y cómo gestionarlos con `useEffect`.
- Realizar peticiones a APIs para obtener datos dinámicamente.
- Manejar estados de carga y errores para mejorar la experiencia del usuario.

---

## Temas

### 1. Introducción a useEffect

`useEffect` es el hook que usamos para manejar **efectos secundarios**: operaciones que interactúan con el mundo exterior al componente.

Ejemplos comunes de efectos secundarios:
- Pedir datos a una API.
- Manipular el DOM directamente.
- Poner un `setTimeout` o `setInterval`.

```jsx
import { useEffect } from 'react';

useEffect(() => {
  // 1. Función del efecto: lógica que queremos ejecutar
  console.log('El componente se acaba de mostrar en pantalla.');

  return () => {
    // 2. Función de limpieza (opcional): se ejecuta al desmontar el componente
    console.log('El componente se va a desmontar. Limpiando...');
  };
}, [/* 3. Array de dependencias */]);
```

#### El array de dependencias (clave)

| Valor | Comportamiento |
|---|---|
| `[]` (vacío) | El efecto corre **una sola vez**, justo después del primer render |
| `[variable]` | Corre la primera vez y **cada vez que cambie** esa variable |
| Sin array | Corre **después de cada render** (casi nunca se usa, puede causar bucles) |

### 2. Carpeta `public` vs Carpeta `src`

| `src/` | `public/` |
|---|---|
| Código fuente (componentes, hooks, estilos) | Assets estáticos (imágenes, JSON de datos) |
| Se compila y empaqueta por Vite | Se copia tal cual, accesible por URL directa |
| No se puede pedir con `fetch` desde el navegador | Se puede pedir con `fetch('/data/archivo.json')` |

Para simular una API local: crear `public/data/productos.json` con un array de objetos.

### 3. fetch y Promesas

```jsx
fetch('/data/productos.json')
  .then(respuesta => {
    console.log('Respuesta cruda:', respuesta);
    return respuesta.json(); // convierte a objeto JS
  })
  .then(datos => {
    console.log('¡Productos cargados!', datos);
  })
  .catch(error => {
    console.error('¡Ups! Hubo un error:', error);
  })
  .finally(() => {
    // se ejecuta siempre, haya funcionado o no
  });
```

### 4. Integrando useEffect + fetch + useState

Para una buena UX, se usan **tres estados**:

```jsx
const [productos, setProductos] = useState([]);   // datos cuando lleguen
const [cargando, setCargando] = useState(true);   // ¿estamos esperando?
const [error, setError] = useState(null);         // mensaje de error si algo falla
```

Flujo completo dentro de `useEffect`:

```jsx
useEffect(() => {
  fetch('/data/productos.json')
    .then(respuesta => {
      if (!respuesta.ok) throw new Error('No se pudo cargar la información.');
      return respuesta.json();
    })
    .then(datos => setProductos(datos))
    .catch(error => setError(error.message))
    .finally(() => setCargando(false));
}, []); // [] = solo se ejecuta al montar el componente
```

### 5. Renderizado condicional

```jsx
if (cargando) return <p>Cargando productos, por favor espere...</p>;
if (error)    return <p>Error: {error}</p>;

return (
  // JSX con los datos ya cargados
);
```

---

## Ejercicio: Directorio de Contactos (TalentoLab)

Aplicar todo lo visto construyendo un **directorio de contactos** que:
1. Lee los datos desde `public/data/nosotros.json`
2. Usa `useEffect` + `fetch` + tres `useState` (nosotros, cargando, error)
3. Muestra estado de carga y estado de error
4. Mapea los datos a un componente `TarjetaContacto`

Ver código en `ejercicios/src/`.
