import Home from './components/Home';
import Rsvp from './components/Rsvp';

function getCodigo() {
  const params = new URLSearchParams(window.location.search);
  const c = params.get('c');
  return c ? c.trim() : '';
}

function App() {
  const codigo = getCodigo();
  if (!codigo) return <Home />;
  return <Rsvp codigo={codigo} />;
}

export default App;
