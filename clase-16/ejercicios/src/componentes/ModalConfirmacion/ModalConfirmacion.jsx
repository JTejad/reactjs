import { Modal, Button, Spinner } from 'react-bootstrap';
import { FaExclamationTriangle } from 'react-icons/fa';

// Modal reutilizable para confirmar acciones destructivas (reemplaza a window.confirm)
const ModalConfirmacion = ({
  show,
  titulo = '¿Estás seguro?',
  mensaje,
  textoConfirmar = 'Eliminar',
  procesando = false,
  onConfirmar,
  onCancelar,
}) => (
  // onHide se dispara con la X, la tecla Esc o un clic afuera del modal
  <Modal show={show} onHide={onCancelar} centered>
    <Modal.Header closeButton>
      <Modal.Title className="d-flex align-items-center gap-2">
        <FaExclamationTriangle className="text-danger" aria-hidden="true" /> {titulo}
      </Modal.Title>
    </Modal.Header>
    <Modal.Body>{mensaje}</Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={onCancelar} disabled={procesando}>
        Cancelar
      </Button>
      <Button variant="danger" onClick={onConfirmar} disabled={procesando}>
        {procesando ? <Spinner as="span" animation="border" size="sm" aria-hidden="true" /> : textoConfirmar}
      </Button>
    </Modal.Footer>
  </Modal>
);

export default ModalConfirmacion;
