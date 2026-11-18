import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Form, InputGroup, Badge, Button } from 'react-bootstrap';
import { FaSearch, FaShoppingCart, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useSearch } from '../../context/SearchContext';

function Header() {
  const { getCartQuantity } = useCart();
  const { user, logout } = useAuth();
  const { busqueda, setBusqueda } = useSearch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const totalItems = getCartQuantity();

  // Búsqueda global: al escribir, filtramos y llevamos al listado si estamos en otra página
  const manejarBusqueda = (e) => {
    setBusqueda(e.target.value);
    if (pathname !== '/productos-nacionales') navigate('/productos-nacionales');
  };

  const cerrarSesion = async () => {
    await logout();
    navigate('/');
  };

  return (
    // expand="lg": en pantallas chicas el menú se colapsa en un botón hamburguesa
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand as={Link} to="/">Mi Tienda</Navbar.Brand>
        <Navbar.Toggle aria-controls="menu-principal" aria-label="Abrir menú" />

        <Navbar.Collapse id="menu-principal">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/productos">Productos</Nav.Link>
            <Nav.Link as={NavLink} to="/productos-nacionales">Nacionales</Nav.Link>
            {user?.rol === 'admin' && (
              <>
                <Nav.Link as={NavLink} to="/gestion">Gestión</Nav.Link>
                <Nav.Link as={NavLink} to="/admin/cupones">Cupones</Nav.Link>
              </>
            )}
          </Nav>

          <Form className="my-2 my-lg-0 me-lg-3" role="search" onSubmit={e => e.preventDefault()}>
            <InputGroup>
              <InputGroup.Text><FaSearch aria-hidden="true" /></InputGroup.Text>
              <Form.Control
                type="search"
                placeholder="Buscar productos..."
                value={busqueda}
                onChange={manejarBusqueda}
                aria-label="Buscar productos"
              />
            </InputGroup>
          </Form>

          <Nav className="align-items-lg-center gap-lg-2">
            <Nav.Link as={Link} to="/carrito" aria-label={`Carrito, ${totalItems} productos`}>
              <FaShoppingCart /> {totalItems > 0 && <Badge bg="primary">{totalItems}</Badge>}
            </Nav.Link>
            {user ? (
              <>
                <Nav.Link as={Link} to="/perfil"><FaUserCircle /> Mi perfil</Nav.Link>
                <Button variant="outline-light" size="sm" onClick={cerrarSesion}>
                  <FaSignOutAlt /> Salir
                </Button>
              </>
            ) : (
              <Nav.Link as={Link} to="/login">Login</Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
