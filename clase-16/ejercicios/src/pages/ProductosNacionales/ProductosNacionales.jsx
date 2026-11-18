import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form, InputGroup, Spinner, Alert } from 'react-bootstrap';
import { FaSearch, FaChevronDown, FaChevronUp } from 'react-icons/fa';
// query + limit + startAfter para pedir los documentos de a páginas
import { collection, getDocs, query, limit, startAfter } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useSearch } from '../../context/SearchContext';
import Cargando from '../../componentes/Cargando/Cargando';
import { toast } from 'react-toastify';

const PRODUCTOS_POR_PAGINA = 4;

const ProductosNacionales = () => {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);          // carga inicial
  const [cargandoMas, setCargandoMas] = useState(false);   // carga de la página siguiente
  const [ultimoVisible, setUltimoVisible] = useState(null); // último documento traído (cursor)
  const [hayMas, setHayMas] = useState(true);               // ¿quedan productos por traer?
  const [error, setError] = useState(null);
  const { busqueda, setBusqueda } = useSearch();

  const productosDB = collection(db, 'Productos nacionales');

  // Guarda los datos de una respuesta y actualiza el cursor
  const procesarRespuesta = (resp) => {
    const ultimoDoc = resp.docs[resp.docs.length - 1];
    setUltimoVisible(ultimoDoc);
    // Si vinieron menos que el límite, no hay más páginas
    setHayMas(resp.docs.length === PRODUCTOS_POR_PAGINA);
    return resp.docs.map(doc => ({ ...doc.data(), id: doc.id }));
  };

  // Primera página
  const obtenerProductosIniciales = () => {
    setCargando(true);
    const q = query(productosDB, limit(PRODUCTOS_POR_PAGINA));

    getDocs(q)
      .then(resp => setProductos(procesarRespuesta(resp)))
      .catch(err => {
        console.error('Error al obtener productos:', err);
        setError('No se pudieron cargar los productos.');
      })
      .finally(() => setCargando(false));
  };

  // Página siguiente: arranca después del último documento que ya tenemos
  const obtenerMasProductos = () => {
    if (!hayMas || cargandoMas) return;

    setCargandoMas(true);
    const q = query(productosDB, startAfter(ultimoVisible), limit(PRODUCTOS_POR_PAGINA));

    getDocs(q)
      .then(resp => {
        const nuevos = procesarRespuesta(resp);
        setProductos(anteriores => [...anteriores, ...nuevos]);
      })
      .catch(err => {
        console.error('Error al cargar más productos:', err);
        // Ya hay productos en pantalla: avisamos sin reemplazar la página por un error
        toast.error('No se pudieron cargar más productos.');
      })
      .finally(() => setCargandoMas(false));
  };

  // "Ver menos": volvemos a la primera página y subimos
  const verMenos = () => {
    obtenerProductosIniciales();
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    obtenerProductosIniciales();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filtro del lado del cliente sobre los productos ya cargados
  const productosFiltrados = productos.filter(prod =>
    prod.nombre.toLowerCase().includes(busqueda.trim().toLowerCase())
  );

  if (cargando) return <Cargando />;
  if (error) return <Alert variant="danger" className="m-4">{error}</Alert>;

  return (
    <Container className="mt-4">
      <h1 className="mb-3">Productos Nacionales</h1>

      <Row className="mb-4">
        <Col xs={12} md={6}>
          <InputGroup>
            <InputGroup.Text><FaSearch aria-hidden="true" /></InputGroup.Text>
            <Form.Control
              type="search"
              placeholder="Buscar en los productos cargados..."
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              aria-label="Buscar productos por nombre"
            />
          </InputGroup>
        </Col>
      </Row>

      {productosFiltrados.length === 0 && (
        <p className="text-muted">No hay productos cargados que coincidan con "{busqueda}".</p>
      )}

      {/* Mobile-first: 1 columna por defecto, 2 desde sm y 3 desde lg */}
      <Row>
        {productosFiltrados.map(prod => (
          <Col key={prod.id} xs={12} sm={6} lg={4} className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Img
                variant="top"
                src={prod.imagen}
                alt={prod.nombre}
                loading="lazy"
                style={{ height: '200px', objectFit: 'cover' }}
              />
              <Card.Body className="d-flex flex-column">
                <Card.Title>{prod.nombre}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted text-capitalize">{prod.categoria}</Card.Subtitle>
                <Card.Text className="fs-5 fw-bold">${prod.precio}</Card.Text>
                <Button
                  as={Link}
                  to={`/productos-nacionales/${prod.id}`}
                  variant="primary"
                  className="mt-auto"
                  aria-label={`Ver detalle de ${prod.nombre}`}
                >
                  Ver detalle
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Paginador */}
      <Row className="mb-5">
        <Col className="text-center d-flex flex-wrap justify-content-center gap-2">
          {/* "Ver menos" solo si hay más de una página cargada */}
          {productos.length > PRODUCTOS_POR_PAGINA && (
            <Button variant="secondary" onClick={verMenos}>
              <FaChevronUp /> Ver menos
            </Button>
          )}
          {hayMas ? (
            <Button onClick={obtenerMasProductos} disabled={cargandoMas}>
              {cargandoMas ? (
                <>
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> Cargando...
                </>
              ) : (
                <><FaChevronDown /> Cargar más</>
              )}
            </Button>
          ) : (
            // Solo avisamos si hubo más de una página
            productos.length > PRODUCTOS_POR_PAGINA && (
              <Alert variant="light" className="m-0">No hay más productos para mostrar.</Alert>
            )
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ProductosNacionales;
