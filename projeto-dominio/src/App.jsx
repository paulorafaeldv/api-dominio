// src/App.jsx
import RegistroList from './components/RegistroList'; 
// ...

function App() {
  return (
    <div className="App">
      {/* Coloque algum texto simples AQUI para testar */}
      <h2>Teste: Se este texto aparecer, o App.jsx está ok.</h2> 
      
      <header>
        <h1>Consumindo Brasil API com React e Vite</h1>
      </header>
      
      <main>
        <RegistroList />
      </main>
    </div>
  );
}

export default App;