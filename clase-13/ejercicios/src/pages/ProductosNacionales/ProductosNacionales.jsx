import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form, InputGroup } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useSearch } from '../../context/SearchContext';

const ProductosNacionales = () => {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  // El término de búsqueda es global: lo comparten este input y el del Header
  const { busqueda, setBusqueda } = useSearch();

  useEffect(() => {
    getDocs(collection(db, 'Productos nacionales'))
      .then(resp => setProductos(resp.docs.map(doc => ({ ...doc.data(), id: doc.id }))))
      .catch(() => setError('No se pudieron cargar los productos.'))
      .finally(() => setCargando(false));
  }, []);

  // Filtramos ANTES de renderizar; toLowerCase en los dos lados para ignorar mayúsculas
  const productosFiltrados = productos.filter(prod =>
    prod.nombre.toLowerCase().includes(busqueda.trim().toLowerCase())
  );

  if (cargando) return <p>Cargando productos...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <Container className="mt-4">
      <h1 className="mb-3">Productos Nacionales</h1>

      {/* Input controlado: el valor sale del estado y cada tecla lo actualiza */}
      <Row className="mb-4">
        <Col md={6}>
          <InputGroup>
            <InputGroup.Text><FaSearch aria-hidden="true" /></InputGroup.Text>
            <Form.Control
              type="search"
              placeholder="Buscar productos por nombre..."
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              aria-label="Buscar productos por nombre"
            />
          </InputGroup>
        </Col>
      </Row>

      {productosFiltrados.length === 0 && (
        <p className="text-muted">No hay productos que coincidan con "{busqueda}".</p>
      )}

      <Row>
        {productosFiltrados.map(prod => (
          // xs=12 → 1 columna en celular · md=6 → 2 en tablet · lg=4 → 3 en escritorio
          <Col key={prod.id} xs={12} md={6} lg={4} className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Img
                variant="top"
                src={prod.imagen}
                alt={prod.nombre}
                style={{ height: '200px', objectFit: 'cover' }}
              />
              <Card.Body className="d-flex flex-column">
                <Card.Title>{prod.nombre}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted text-capitalize">{prod.categoria}</Card.Subtitle>
                <Card.Text className="fs-5 fw-bold">${prod.precio}</Card.Text>
                {/* mt-auto empuja el botón al fondo para que todas las cards queden parejas */}
                <Button as={Link} to={`/productos-nacionales/${prod.id}`} variant="primary" className="mt-auto">
                  Ver detalle
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default ProductosNacionales;
