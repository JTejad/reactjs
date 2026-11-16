import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Registro = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // reseteamos cualquier error previo

    try {
      // createUserWithEmailAndPassword: crea el usuario y deja la sesión iniciada
      await signup(email, password);
      navigate('/');
    } catch (error) {
      // Firebase devuelve códigos de error estandarizados
      if (error.code === 'auth/email-already-in-use') {
        const quiereLoguearse = window.confirm(
          'Este correo electrónico ya está registrado. ¿Desea intentar iniciar sesión?'
        );
        navigate(quiereLoguearse ? '/login' : '/');
      } else if (error.code === 'auth/weak-password') {
        setError('La contraseña debe tener al menos 6 caracteres.');
      } else {
        setError('Ocurrió un error al registrar el usuario. Verifique los datos e intente nuevamente.');
        console.error('Error en el registro:', error.message);
      }
    }
  };

  return (
    <div style={{ maxWidth: '24rem' }}>
      <h2>Crear una nueva cuenta</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <label>
          Correo electrónico
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          Contraseña
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            placeholder="Mínimo 6 caracteres"
          />
        </label>
        {error && <p style={{ color: '#c00', margin: 0 }}>{error}</p>}
        <button type="submit">Registrarse</button>
      </form>
      <p>¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link></p>
    </div>
  );
};

export default Registro;
