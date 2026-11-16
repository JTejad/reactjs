import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

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
