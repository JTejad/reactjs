import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Cargando from '../Cargando/Cargando';

function Layout() {
  return (
    <>
      <Header />
      <main style={{ minHeight: '80vh', padding: '2rem', fontFamily: 'Helvetica, sans-serif' }}>
        {/* Mientras se descarga una página lazy, el header y el footer siguen visibles */}
        <Suspense fallback={<Cargando />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}

export default Layout;
