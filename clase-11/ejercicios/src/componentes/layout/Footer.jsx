import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';

// Ejercicio Parte 2: el equipo se carga desde la colección "equipo" de Firestore
// Campos de cada documento: nombre, rol, linkedinURL, fotoURL
function Footer() {
  const [equipo, setEquipo] = useState([]);

  useEffect(() => {
    getDocs(collection(db, 'equipo'))
      .then(resp => setEquipo(resp.docs.map(doc => ({ ...doc.data(), id: doc.id }))))
      .catch(err => console.error('Error al cargar el equipo:', err));
  }, []);

  return (
    <footer style={{ background: '#1a1a2e', color: '#aaa', textAlign: 'center', padding: '1.5rem' }}>
      <h4 style={{ color: '#fff' }}>Nuestro equipo</h4>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        {equipo.map(persona => (
          <div key={persona.id} style={{ background: '#16213e', borderRadius: '8px', padding: '1rem', width: '180px' }}>
            <img
              src={persona.fotoURL}
              alt={persona.nombre}
              style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <p style={{ color: '#fff', margin: '0.5rem 0 0' }}>{persona.nombre}</p>
            <p style={{ fontSize: '0.85rem', margin: '0.25rem 0' }}>{persona.rol}</p>
            <a href={persona.linkedinURL} target="_blank" rel="noreferrer" style={{ color: '#4ea8de' }}>
              LinkedIn
            </a>
          </div>
        ))}
      </div>
      <p style={{ marginTop: '1rem' }}>© 2025 Mi Tienda React</p>
    </footer>
  );
}

export default Footer;
