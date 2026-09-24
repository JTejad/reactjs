import { EjemploUseEffect } from './componentes/EjemploUseEffect/EjemploUseEffect';
import { Directorio } from './componentes/Directorio/Directorio';

function App() {
  return (
    <div style={{ fontFamily: 'Helvetica, sans-serif', padding: '20px' }}>
      <h1>Clase 05 - useEffect y APIs</h1>

      <EjemploUseEffect />

      <hr />

      <Directorio mensaje="Nuestro Equipo" />
    </div>
  );
}

export default App;
