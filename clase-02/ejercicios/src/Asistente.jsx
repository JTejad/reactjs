function Asistente({ nombre, tarea, emoji }) {
  return (
    <div>
      <h3>{emoji} {nombre}</h3>
      <p>{tarea}</p>
    </div>
  );
}

export default Asistente;
