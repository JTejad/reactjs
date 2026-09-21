import Asistente from './Asistente';

const asistentes = [
  { nombre: 'Juan Pérez', tarea: 'Frontend Developer', emoji: '👨‍💻' },
  { nombre: 'Ana Gómez', tarea: 'Diseñadora UX/UI', emoji: '🎨' },
  { nombre: 'Carlos Ruiz', tarea: 'Backend Developer', emoji: '👨‍💻' },
];

function App() {
  return (
    <div>
      <h1>Equipo TalentoLab</h1>
      {asistentes.map((asistente, index) => (
        <Asistente
          key={index}
          nombre={asistente.nombre}
          tarea={asistente.tarea}
          emoji={asistente.emoji}
        />
      ))}
    </div>
  );
}

export default App;
