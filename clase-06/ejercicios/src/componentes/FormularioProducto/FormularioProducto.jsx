const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  maxWidth: '24rem',
  margin: '3rem auto',
  padding: '1.5rem',
  border: '1px solid #ddd',
  borderRadius: '8px',
  gap: '16px',
};

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
        />
      </div>

      <div>
        <label>Precio: $</label>
        <input
          type="number"
          name="precio"
          placeholder="Ej: 95"
          value={datosForm.precio}
          onChange={manejarCambio}
        />
      </div>

      <div>
        <label>Stock:</label>
        <input
          type="number"
          name="stock"
          placeholder="Ej: 5"
          value={datosForm.stock}
          onChange={manejarCambio}
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
        {loading ? 'Subiendo imagen...' : 'Guardar Producto'}
      </button>
    </form>
  );
}
