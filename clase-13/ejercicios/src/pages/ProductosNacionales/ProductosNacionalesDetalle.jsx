import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { FaCartPlus, FaArrowLeft } from 'react-icons/fa';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useCart } from '../../context/CartContext';

const ProductosNacionalesDetalle = () => {
  const [prod, setItem] = useState(null);
  const [noEncontrado, setNoEncontrado] = useState(false);
  const { id } = useParams();
  const { addToCart } = useCart();

  useEffect(() => {
    if (!id) return;
    getDoc(doc(db, 'Productos nacionales', id))
      .then(resp => {
        if (resp.exists()) setItem({ ...resp.data(), id: resp.id });
        else setNoEncontrado(true);
      })
      .catch(error => {
        console.error(error);
        setNoEncontrado(true);
      });
  }, [id]);

  if (noEncontrado) {
    return (
      <Container className="mt-4">
        <Helmet><title>Mi Tienda | Producto no encontrado</title></Helmet>
        <p>No se encontró el producto.</p>
        <Link to="/productos-nacionales">Volver al listado</Link>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      {/* Helmet mueve estas etiquetas al <head>: cada producto tiene su título y descripción */}
      {prod && (
        <Helmet>
          <title>Mi Tienda | {prod.nombre}</title>
          <meta name="description" content={`Detalles y precio del producto ${prod.nombre}.`} />
        </Helmet>
      )}

      {prod ? (
        <Row className="g-4">
          <Col xs={12} md={6}>
            <img src={prod.imagen} alt={prod.nombre} className="img-fluid rounded shadow-sm" />
          </Col>
          <Col xs={12} md={6}>
            <h1>{prod.nombre}</h1>
            <p className="text-muted text-capitalize">{prod.categoria}</p>
            <p className="fs-3 fw-bold">${prod.precio}</p>
            <p>Stock: {prod.stock} unidades</p>
            <Button
              onClick={() => addToCart(prod, 1)}
              disabled={prod.stock <= 0}
              aria-label={`Agregar ${prod.nombre} al carrito`}
            >
              <FaCartPlus /> Agregar al carrito
            </Button>
            <div className="mt-3">
              <Link to="/productos-nacionales"><FaArrowLeft /> Volver al listado</Link>
            </div>
          </Col>
        </Row>
      ) : (
        <p>Cargando producto...</p>
      )}
    </Container>
  );
};

export default ProductosNacionalesDetalle;
