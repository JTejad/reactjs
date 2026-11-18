import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, ListGroup, Button, Card } from 'react-bootstrap';
import { FaTrash, FaShoppingCart, FaCheck } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import { toast } from 'react-toastify';

const Cart = () => {
  const { cart, clearCart, removeItem, getCartTotal } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <Container className="mt-5 text-center">
        <FaShoppingCart size={48} className="text-muted mb-3" aria-hidden="true" />
        <h1 className="h3">El carrito está vacío</h1>
        <p className="text-muted">Agregá productos para continuar la compra.</p>
        <Button as={Link} to="/productos-nacionales" size="lg">Ver productos</Button>
      </Container>
    );
  }

  const finalizarCompra = () => {
    toast.success('¡Gracias por tu compra!');
    clearCart();
    navigate('/');
  };

  return (
    <Container className="mt-4">
      <h1 className="h3 mb-4">Carrito de compras</h1>
      {/* Mobile-first: lista y resumen apilados; desde lg, uno al lado del otro */}
      <Row className="g-4">
        <Col xs={12} lg={8}>
          <ListGroup>
            {cart.map(item => (
              <ListGroup.Item key={item.id} className="d-flex flex-wrap align-items-center gap-3">
                {item.imagen && (
                  <img src={item.imagen} alt="" width="64" height="64" className="rounded" style={{ objectFit: 'cover' }} />
                )}
                <div className="flex-grow-1">
                  <h2 className="h6 mb-1">{item.nombre}</h2>
                  <small className="text-muted">{item.quantity} × ${item.precio}</small>
                </div>
                <strong>${item.precio * item.quantity}</strong>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => removeItem(item.id)}
                  aria-label={`Eliminar ${item.nombre} del carrito`}
                >
                  <FaTrash />
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>

        <Col xs={12} lg={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Resumen</Card.Title>
              <p className="fs-4 fw-bold">Total: ${getCartTotal()}</p>
              {/* Botones grandes y a todo el ancho: fáciles de tocar en pantallas táctiles */}
              <Button variant="success" size="lg" className="w-100 mb-2" onClick={finalizarCompra}>
                <FaCheck /> Finalizar compra
              </Button>
              <Button variant="outline-secondary" className="w-100" onClick={clearCart}>
                Vaciar carrito
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Cart;
