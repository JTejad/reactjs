import { Layout } from './componentes/layout/Layout';
import { ItemListContainer } from './componentes/ItemListContainer/ItemListContainer';
import { Contador } from './componentes/Contador/Contador';

function App() {
  return (
    <Layout>
      <h1>¡Bienvenidos a mi página!</h1>
      <p>Este es el contenido principal.</p>
      <ItemListContainer Mensaje="Nuestros productos destacados" />
      <Contador />
    </Layout>
  );
}

export default App;
