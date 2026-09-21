# Clase 03 - Layout en React

## Temas vistos

- estructura de carpetas recomendada: `src/componentes/` con una subcarpeta por componente (jsx + css juntos)
- buenas prácticas: nombres en PascalCase, una carpeta por componente
- componentes de layout: `Layout.jsx`, `Header.jsx`, `Footer.jsx`, `Main.jsx`
- la prop `children` aplicada al Layout para envolver el contenido de cada página
- estilos en línea en JSX: sintaxis con doble llave `style={{ propiedad: "valor" }}`
- CSS Global vs CSS Modules:
  - `index.css`: estilos de más alto nivel (reset, tipografía global, variables CSS)
  - `App.css`: estilos del componente App y elementos que solo existen ahí
  - CSS Modules (`.module.css`): estilos locales al componente, evitan colisiones de nombres

## Idea principal

En esta clase aprendimos a estructurar una aplicación React completa, creando componentes reutilizables de layout y aplicando estilos de forma organizada con CSS Modules y CSS Global.

## Diferencia CSS Global vs CSS Modules

| | CSS Global | CSS Modules |
|---|---|---|
| Alcance | Toda la app | Solo el componente |
| Uso | Reset, variables, fuentes | Estilos específicos por componente |
| Importación | `import './archivo.css'` | `import styles from './Componente.module.css'` |
| Aplicación | `className="clase"` | `className={styles.clase}` |

## Ejercicios de la clase

Los ejercicios resueltos están en `ejercicios/src/`.
