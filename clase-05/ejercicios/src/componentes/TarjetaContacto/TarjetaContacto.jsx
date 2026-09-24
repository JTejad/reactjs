export function TarjetaContacto({ nombre, puesto, email, foto }) {
  return (
    <div style={{
      border: '1px solid #ccc',
      borderRadius: '8px',
      padding: '20px',
      textAlign: 'center',
      width: '180px',
    }}>
      <img
        src={foto}
        alt={nombre}
        width={80}
        height={80}
        style={{ borderRadius: '50%', objectFit: 'cover' }}
      />
      <h3 style={{ margin: '10px 0 4px' }}>{nombre}</h3>
      <p style={{ margin: '0 0 4px', fontWeight: 'bold', color: '#555' }}>{puesto}</p>
      <p style={{ margin: 0, fontSize: '0.85rem', color: '#777' }}>{email}</p>
    </div>
  );
}
