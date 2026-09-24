import { useState, useEffect } from 'react';
import { TarjetaContacto } from '../TarjetaContacto/TarjetaContacto';

export function Directorio({ mensaje }) {
  const [nosotros, setNosotros] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/data/nosotros.json')
      .then(respuesta => {
        if (!respuesta.ok) throw new Error('No se pudo cargar el equipo.');
        return respuesta.json();
      })
      .then(datos => setNosotros(datos))
      .catch(err => setError(err.message))
      .finally(() => setCargando(false));
  }, []); // [] = se ejecuta una sola vez al montar el componente

  if (cargando) return <p>Cargando equipo, por favor espere...</p>;
  if (error)    return <p>Error: {error}</p>;

  return (
    <div>
      <h2>{mensaje}</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
        {nosotros.map(persona => (
          <TarjetaContacto
            key={persona.id}
            nombre={persona.nombre}
            puesto={persona.puesto}
            email={persona.email}
            foto={persona.foto}
          />
        ))}
      </div>
    </div>
  );
}
