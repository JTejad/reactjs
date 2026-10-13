import styles from './Footer.module.css';

const equipo = [
  { nombre: 'Ana García',     rol: 'CEO & Fundadora',     descripcion: 'Apasionada por la tecnología y la innovación.' },
  { nombre: 'Lucas Pérez',    rol: 'CTO',                 descripcion: 'Arquitecto de software con 10 años de experiencia.' },
  { nombre: 'Sofía Morales',  rol: 'Directora de Ventas', descripcion: 'Especialista en e-commerce y atención al cliente.' },
];

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <div className={styles.col}>
          <h4>TechStore</h4>
          <p>Sobre nosotros</p>
          <p>Trabaja con nosotros</p>
          <p>Términos y condiciones</p>
          <p>Privacidad</p>
        </div>
        <div className={styles.col}>
          <h4>Pagá con</h4>
          <p>Tarjetas de crédito</p>
          <p>Tarjetas de débito</p>
          <p>Transferencia bancaria</p>
          <p>Billetera virtual</p>
        </div>
        <div className={styles.col}>
          <h4>Ayuda</h4>
          <p>Preguntas frecuentes</p>
          <p>Cómo comprar</p>
          <p>Envíos y entregas</p>
          <p>Devoluciones</p>
        </div>
        <div className={styles.col}>
          <h4>Contacto</h4>
          <p>Buenos Aires, Argentina</p>
          <p>techstore@techstore.com.ar</p>
          <p>Lun-Vie 9 a 18hs</p>
        </div>
      </div>

      <div className={styles.equipo}>
        <h4>Nuestro equipo</h4>
        <div className={styles.tarjetas}>
          {equipo.map(p => (
            <div key={p.nombre} className={styles.tarjeta}>
              <div className={styles.avatar}>{p.nombre.charAt(0)}</div>
              <div>
                <strong>{p.nombre}</strong>
                <span>{p.rol}</span>
                <p>{p.descripcion}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.bottom}>
        <p>© {new Date().getFullYear()} TechStore S.A. — Todos los derechos reservados.</p>
        <p>CUIT: 30-71234567-0 · Dirección: Av. Corrientes 1234, CABA</p>
      </div>
    </footer>
  );
}

export default Footer;
