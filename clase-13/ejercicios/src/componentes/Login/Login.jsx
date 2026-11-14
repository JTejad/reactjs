import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError(null);

    // signInWithEmailAndPassword devuelve una promesa
    login(email, password)
      .then((userCredential) => {
        console.log('Usuario logueado:', userCredential.user.email);
        navigate('/');
      })
      .catch((error) => {
        console.error('Error en el login:', error.code, error.message);
        setError('Email o contraseña incorrectos.');
      });
  };

  return (
    <div style={{ maxWidth: '24rem' }}>
      <h2>Iniciar sesión</h2>
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p style={{ color: '#c00', margin: 0 }}>{error}</p>}
        <button type="submit">Ingresar</button>
      </form>
      <p>¿No tenés una cuenta? <Link to="/registro">Registrate acá</Link></p>
    </div>
  );
};

export default Login;
