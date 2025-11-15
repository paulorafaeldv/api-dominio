import RegistroList from './components/RegistroList'; 
import './App.css';

// ...

function App() {
  return (
    <div className="pagina-container">
      <header>
        <h1>Informações sobre domínio:</h1>
        <p>Aplicação desenvolvida para a cadeira de Front-End Frameworks
          com consumo da API pública do Registro.br
        </p>
        <h2>Pesquise um domínio: </h2>
      </header>
      
      <main>
        <RegistroList />
      </main>
    </div>
  );
}

export default App;