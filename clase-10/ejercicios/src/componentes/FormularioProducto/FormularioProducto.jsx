const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  maxWidth: '24rem',
  margin: '1rem 0',
  padding: '1.5rem',
  border: '1px solid #ddd',
  borderRadius: '8px',
  gap: '16px',
};

// Componente presentacional: solo dibuja el formulario, la lógica está en FormularioContainer
export function FormularioProducto({ datosForm, manejarCambio, manejarEnvio, manejarCambioImagen, loading }) {
  return (
    <form style={formStyle} onSubmit={manejarEnvio}>
      <h3>Agregar Nuevo Producto</h3>

      <div>
        <label>Nombre del Producto:</label>
        <input
          type="text"
          name="nombre"
          placeholder="Ej: Teclado Mecánico"
          value={datosForm.nombre}
          onChange={manejarCambio}
          required
        />
      </div>

      <div>
        <label>Categoría:</label>
        <input
          type="text"
          name="categoria"
          placeholder="Ej: Tecnología"
          value={datosForm.categoria}
          onChange={manejarCambio}
          required
        />
      </div>

      <div>
        <label>Precio: $</label>
        {/* min="0": el navegador no deja enviar precios negativos */}
        <input
          type="number"
          name="precio"
          min="0"
          placeholder="Ej: 95"
          value={datosForm.precio}
          onChange={manejarCambio}
          required
        />
      </div>

      <div>
        <label>Stock:</label>
        <input
          type="number"
          name="stock"
          min="0"
          step="1"
          placeholder="Ej: 5"
          value={datosForm.stock}
          onChange={manejarCambio}
          required
        />
      </div>

      <div>
        <label>Imagen:</label>
        <input
          type="file"
          accept="image/*"
          onChange={manejarCambioImagen}
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Guardando...' : 'Guardar Producto'}
      </button>
    </form>
  );
}
