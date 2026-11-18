import { Spinner } from 'react-bootstrap';

// Indicador de carga reutilizable: reemplaza los "Cargando..." de texto plano
const Cargando = ({ alto = '50vh' }) => (
  <div className="d-flex justify-content-center align-items-center" style={{ height: alto }}>
    <Spinner animation="border" variant="primary" role="status">
      {/* El texto no se ve, pero lo leen los lectores de pantalla */}
      <span className="visually-hidden">Cargando...</span>
    </Spinner>
  </div>
);

export default Cargando;
