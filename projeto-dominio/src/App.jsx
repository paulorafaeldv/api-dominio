// src/App.jsx
import RegistroList from './components/RegistroList'; 
import './App.css';

// ...

function App() {
  return (
    <div className="App">
      <header>
        <h1 style={{textAlign: "center"}}>Consumindo Brasil API com React e Vite</h1>
      </header>
      
      <main>
        <RegistroList />
      </main>
    </div>
  );
}

export default App;