import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError(null);
    setEnviando(true);

    login(email, password)
      .then(() => navigate('/'))
      .catch((error) => {
        console.error('Error en el login:', error.code);
        setError('Email o contraseña incorrectos.');
      })
      .finally(() => setEnviando(false));
  };

  return (
    <Container style={{ maxWidth: '420px' }} className="mt-5">
      {/* Formulario con etiquetas claras, espaciado y botón a todo el ancho */}
      <Form onSubmit={handleLogin} className="p-4 border rounded shadow-sm">
        <h2 className="mb-4">Iniciar sesión</h2>

        <Form.Group className="mb-3" controlId="login-email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Ingresá tu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="login-password">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>

        {error && <Alert variant="danger" className="py-2">{error}</Alert>}

        <Button type="submit" variant="success" className="w-100" disabled={enviando}>
          {enviando ? <Spinner as="span" animation="border" size="sm" aria-hidden="true" /> : 'Ingresar'}
        </Button>

        <p className="mt-3 mb-0 text-center">
          ¿No tenés una cuenta? <Link to="/registro">Registrate acá</Link>
        </p>
      </Form>
    </Container>
  );
};

export default Login;
