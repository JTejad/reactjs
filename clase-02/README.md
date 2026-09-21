# Clase 02 - JSX, Props y Componentes

## Temas vistos

- repaso de JavaScript para React: destructuring, spread operator y `.map()`
- props: pasando datos entre componentes (3 formas: objeto completo, destructuring, spread operator)
- `children`: prop especial que recibe todo lo que está entre las etiquetas de apertura y cierre
- CSS en JSX: las propiedades usan camelCase (`backgroundColor`, `fontSize`, etc.)
- patrón contenedor y presentacional: componentes "dumb" (solo muestran) vs "smart" (manejan lógica)
- formas de exportar un componente: default export, named export y exportación mixta

## Idea principal

En esta clase profundizamos en los pilares de React: props para comunicar componentes y el patrón contenedor/presentacional para mantener el código organizado y escalable.

## Diferencia entre tipos de export

| Tipo | Exportación | Importación |
|------|-------------|-------------|
| Default | `export default MiComponente` | `import MiComponente from './MiComponente'` |
| Named | `export function MiComponente()` | `import { MiComponente } from './MiComponente'` |
| Mixta | default + named en el mismo archivo | `import Default, { Named } from './archivo'` |

## Ejercicios de la clase

Los ejercicios resueltos están en `ejercicios/src/`.
