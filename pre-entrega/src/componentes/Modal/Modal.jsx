import { useEffect } from 'react';
import styles from './Modal.module.css';

function Modal({ onClose }) {
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.icon}>🚧</div>
        <h2 className={styles.titulo}>Sitio en construcción</h2>
        <p className={styles.texto}>
          Estamos trabajando para traerte la mejor experiencia de compra.
          Esta función estará disponible muy pronto.
        </p>
        <p className={styles.beta}>TechStore Beta v0.1</p>
        <button className={styles.btn} onClick={onClose}>Entendido</button>
      </div>
    </div>
  );
}

export default Modal;
