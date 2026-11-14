import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/config';

// Ejercicio Talento Lab: panel para crear y eliminar cupones (colección "cupones")
const GestionCupones = () => {
  const [cupones, setCupones] = useState([]);
  const [codigo, setCodigo] = useState('');
  const [descuento, setDescuento] = useState('');
  const [guardando, setGuardando] = useState(false);

  // Read: traemos los cupones al montar
  useEffect(() => {
    getDocs(collection(db, 'cupones'))
      .then(resp => setCupones(resp.docs.map(doc => ({ ...doc.data(), id: doc.id }))))
      .catch(err => console.error('Error al cargar cupones:', err));
  }, []);

  // Create
  const crearCupon = async (evento) => {
    evento.preventDefault();

    const codigoLimpio = codigo.trim().toUpperCase();
    const porcentaje = Number(descuento);

    if (!codigoLimpio) {
      alert('Ingresá un código.');
      return;
    }
    if (porcentaje <= 0 || porcentaje > 100) {
      alert('El descuento tiene que estar entre 1 y 100.');
      return;
    }
    if (cupones.some(c => c.codigo === codigoLimpio)) {
      alert('Ya existe un cupón con ese código.');
      return;
    }

    try {
      setGuardando(true);
      const nuevoCupon = { codigo: codigoLimpio, descuento: porcentaje };
      const docRef = await addDoc(collection(db, 'cupones'), nuevoCupon);
      setCupones([...cupones, { ...nuevoCupon, id: docRef.id }]);
      setCodigo('');
      setDescuento('');
    } catch (error) {
      console.error('Error al crear el cupón:', error);
      alert('No se pudo crear el cupón.');
    } finally {
      setGuardando(false);
    }
  };

  // Delete
  const eliminarCupon = async (id) => {
    if (!window.confirm('¿Eliminar este cupón?')) return;

    try {
      await deleteDoc(doc(db, 'cupones', id));
      setCupones(cupones.filter(c => c.id !== id));
    } catch (error) {
      console.error('Error al eliminar el cupón:', error);
      alert('No se pudo eliminar el cupón.');
    }
  };

  return (
    <div>
      <h2>Gestión de Cupones</h2>

      <form onSubmit={crearCupon} style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', margin: '1rem 0' }}>
        <input
          type="text"
          placeholder="Código (ej: VERANO10)"
          value={codigo}
          onChange={e => setCodigo(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="% de descuento"
          min="1"
          max="100"
          value={descuento}
          onChange={e => setDescuento(e.target.value)}
          required
        />
        <button type="submit" disabled={guardando}>
          {guardando ? 'Guardando...' : 'Crear cupón'}
        </button>
      </form>

      {cupones.length === 0 ? (
        <p>No hay cupones cargados.</p>
      ) : (
        <ul>
          {cupones.map(cupon => (
            <li key={cupon.id} style={{ margin: '0.5rem 0' }}>
              <strong>{cupon.codigo}</strong> — {cupon.descuento}% OFF
              <button onClick={() => eliminarCupon(cupon.id)} style={{ marginLeft: '10px' }}>
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GestionCupones;
