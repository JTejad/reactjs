import { createContext, useState, useContext } from 'react';

// Búsqueda global: el término vive acá y lo pueden leer/escribir el Header y cualquier listado
const SearchContext = createContext();

export function SearchProvider({ children }) {
  const [busqueda, setBusqueda] = useState('');

  return (
    <SearchContext.Provider value={{ busqueda, setBusqueda }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch debe ser usado dentro de un SearchProvider');
  }
  return context;
}
