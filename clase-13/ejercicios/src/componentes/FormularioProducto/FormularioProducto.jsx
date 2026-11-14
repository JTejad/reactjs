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

// Presentacional: la lógica vive en Gestion. modoEdicion cambia títulos y botón.
export function FormularioProducto({ datosForm, manejarCambio, manejarCambioImagen, manejarEnvio, loading, modoEdicion }) {
  return (
    <form style={formStyle} onSubmit={manejarEnvio}>
      <h3>{modoEdicion ? 'Editar producto' : 'Agregar nuevo producto'}</h3>

      {/* Validación nativa HTML5: required, minLength, min, step */}
      <div>
        <label>Nombre del Producto:</label>
        <input
          type="text"
          name="nombre"
          placeholder="Ej: Teclado Mecánico"
          value={datosForm.nombre}
          onChange={manejarCambio}
          required
          minLength={3}
          maxLength={60}
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
        <input
          type="number"
          name="precio"
          min="1"
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
          name="imagen"
          accept="image/*"
          onChange={manejarCambioImagen}
        />
        {/* En modo edición mostramos la imagen actual */}
        {modoEdicion && datosForm.imagen && (
          <div>
            <p>Imagen actual:</p>
            <img src={datosForm.imagen} alt="Vista previa" style={{ width: '100px' }} />
          </div>
        )}
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Guardando...' : modoEdicion ? 'Actualizar producto' : 'Guardar producto'}
      </button>
    </form>
  );
}
