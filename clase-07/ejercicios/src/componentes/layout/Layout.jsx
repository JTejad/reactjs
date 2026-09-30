import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

// Con React Router, Outlet reemplaza props.children:
// React Router inserta aquí el componente de la ruta activa.
function Layout() {
  return (
    <>
      <Header />
      <main style={{ minHeight: '80vh', padding: '2rem', fontFamily: 'Helvetica, sans-serif' }}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default Layout;
