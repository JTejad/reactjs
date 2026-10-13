import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import styles from './ProductoDetalle.module.css';

function ProductoDetalle() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [cantidad, setCantidad] = useState(1);
  const [agregado, setAgregado] = useState(false);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/data/productos.json')
      .then(res => res.json())
      .then(data => setProducto(data.find(p => p.id === parseInt(id)) || null))
      .catch(err => console.error(err))
      .finally(() => setCargando(false));
  }, [id]);

  const handleAddToCart = () => {
    addToCart(producto, cantidad);
    setAgregado(true);
    setTimeout(() => setAgregado(false), 2500);
  };

  if (cargando) return <p style={{ padding: '2rem', color: '#666' }}>Cargando producto...</p>;
  if (!producto) return <p style={{ padding: '2rem', color: '#c00' }}>Producto no encontrado.</p>;

  const descuento = producto.precioAnterior
    ? Math.round((1 - producto.precio / producto.precioAnterior) * 100)
    : null;

  return (
    <div className={styles.container}>
      <p className={styles.breadcrumb}>
        <Link to="/productos">Volver al listado</Link> › {producto.categoria} › {producto.nombre}
      </p>

      <div className={styles.card}>
        <div className={styles.galeria}>
          <img src={producto.imagen} alt={producto.nombre} className={styles.imagen} />
        </div>

        <div className={styles.info}>
          {producto.vendidos && (
            <p className={styles.vendidos}>{producto.vendidos} unidades vendidas</p>
          )}
          <h1 className={styles.nombre}>{producto.nombre}</h1>

          {producto.rating && (
            <div className={styles.rating}>
              <span className={styles.estrellas}>
                {'★'.repeat(Math.round(producto.rating))}{'☆'.repeat(5 - Math.round(producto.rating))}
              </span>
              <span className={styles.ratingNum}>{producto.rating}</span>
            </div>
          )}

          {producto.precioAnterior && (
            <p className={styles.precioAnterior}>${producto.precioAnterior.toLocaleString('es-AR')}</p>
          )}

          <div className={styles.precioRow}>
            <span className={styles.precio}>${producto.precio.toLocaleString('es-AR')}</span>
            {descuento && <span className={styles.descuento}>{descuento}% OFF</span>}
          </div>

          {producto.cuotas && (
            <p className={styles.cuotas}>
              en <strong>{producto.cuotas} cuotas sin interés</strong> de ${Math.round(producto.precio / producto.cuotas).toLocaleString('es-AR')}
            </p>
          )}

          {producto.envioGratis && (
            <p className={styles.envioGratis}>🚚 Envío gratis a todo el país</p>
          )}

          <hr className={styles.sep} />

          <p className={styles.stockLabel}>
            Stock disponible: <strong>{producto.stock} unidades</strong>
          </p>

          <div className={styles.cantidadRow}>
            <label className={styles.cantLabel}>Cantidad:</label>
            <div className={styles.cantControls}>
              <button onClick={() => setCantidad(c => Math.max(1, c - 1))} className={styles.cantBtn}>−</button>
              <span className={styles.cantNum}>{cantidad}</span>
              <button onClick={() => setCantidad(c => Math.min(producto.stock, c + 1))} className={styles.cantBtn}>+</button>
            </div>
          </div>

          <div className={styles.acciones}>
            <button onClick={handleAddToCart} className={styles.btnAgregar} disabled={producto.stock === 0}>
              {agregado ? '¡Producto agregado!' : 'Agregar al carrito'}
            </button>
            <button className={styles.btnComprar} onClick={() => { addToCart(producto, cantidad); navigate('/carrito'); }}>Comprar ahora</button>
          </div>
        </div>

        <div className={styles.lateral}>
          <div className={styles.vendedorBox}>
            <p className={styles.vendedorTitle}>Vendido por</p>
            <p className={styles.vendedorNombre}>TechStore Oficial</p>
            <p className={styles.vendedorBadge}>Tienda Oficial</p>
            <p className={styles.vendedorInfo}>Atención personalizada · Envíos a todo el país</p>
          </div>
          <div className={styles.descripcionBox}>
            <h3>Descripción</h3>
            <p>{producto.descripcion}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductoDetalle;
