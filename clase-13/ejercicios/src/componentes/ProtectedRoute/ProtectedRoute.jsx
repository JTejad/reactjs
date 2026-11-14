import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Envuelve una ruta y solo la muestra si hay sesión (y, opcionalmente, el rol correcto).
// Ojo: en el PDF falta recibir rolesPermitidos en las props; acá lo desestructuramos.
const ProtectedRoute = ({ children, rolesPermitidos }) => {
  const { user, loading } = useAuth();

  // Mientras Firebase confirma la sesión, no redirigimos (evita mandar al login al recargar)
  if (loading) {
    return <div>Cargando...</div>;
  }

  // Sin usuario, o con un rol que no está en la lista → al login
  if (!user || (rolesPermitidos && !rolesPermitidos.includes(user.rol))) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
