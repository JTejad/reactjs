import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Ejercicio Talento Lab: perfil del usuario logueado + cierre de sesión
const Perfil = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const cerrarSesion = async () => {
    await logout();
    navigate('/'); // bonus: después de cerrar sesión, al inicio
  };

  return (
    <div>
      <h2>Mi perfil</h2>
      <p>¡Hola de nuevo, {user.email}!</p>
      <p>Rol: {user.rol === 'admin' ? 'Administrador' : 'Usuario'}</p>
      <button onClick={cerrarSesion}>Cerrar sesión</button>
    </div>
  );
};

export default Perfil;
