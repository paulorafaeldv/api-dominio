import React, { useState } from 'react';

// URL base, o domínio será adicionado ao final
const API_BASE_URL = 'https://brasilapi.com.br/api/registro-br/v1'; 

function RegistroList() {
  // 1. HOOKS DE ESTADO
  // Armazena a entrada do usuário no campo de texto
  const [inputDomain, setInputDomain] = useState(''); 
  // Armazena o resultado da busca (o objeto retornado pela API)
  const [result, setResult] = useState(null); 
  // Status da requisição
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null);

  // Função chamada quando o usuário clica em buscar
  const handleSearch = async (e) => {
    e.preventDefault(); // Impede o recarregamento padrão do formulário
    
    // 1. Validação simples
    if (!inputDomain.trim()) {
      setError("Por favor, digite um nome de domínio para buscar.");
      setResult(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setResult(null);
      
      // Monta o endpoint dinâmico
      const endpoint = `${API_BASE_URL}/${inputDomain.toLowerCase().trim()}`;
      
      const response = await fetch(endpoint);
      
      // O endpoint de domínio específico pode retornar 404
      if (response.status === 404) {
          throw new Error(`Domínio '${inputDomain}' não encontrado ou inválido.`);
      }
      if (!response.ok) {
        throw new Error(`Erro ao buscar domínio. Código: ${response.status}`);
      }
      
      const data = await response.json();
      setResult(data); 

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 2. RENDERIZAÇÃO
  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>🔍 Buscar Status de Domínio .BR</h2>
      
      {/* O Formulário de Busca */}
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input
          type="text"
          value={inputDomain}
          onChange={(e) => setInputDomain(e.target.value)}
          placeholder="Ex: google.com.br"
          style={{ padding: '10px', flexGrow: 1, border: '1px solid #ccc' }}
        />
        <button type="submit" disabled={loading} style={{ padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}>
          {loading ? 'Buscando...' : 'Buscar'}
        </button>
      </form>
      
      {/* 3. EXIBIÇÃO DE STATUS E RESULTADOS */}
      
      {error && <p style={{ color: 'red' }}>⚠️ **Erro:** {error}</p>}
      
      {loading && <p>Buscando informações do domínio...</p>}
      
      {result && !loading && (
        <div style={{ border: '2px solid #28a745', padding: '15px', borderRadius: '5px', backgroundColor: '#e9f7ef' }}>
          <h3>✅ Status do Domínio: `{result.domain}`</h3>
          <p>
            **Status:** **`{result.status}`** {/* O status 'DISPONIVEL' é retornado se o domínio não estiver registrado */}
            {result.status === 'DISPONIVEL' && <span style={{ color: 'green', fontWeight: 'bold' }}> (Livre para registro!)</span>}
            {result.status === 'REGISTRADO' && <span style={{ color: 'red', fontWeight: 'bold' }}> (Ocupado!)</span>}
          </p>
          <p>
            **Data de Registro:** {result.pubdate ? new Date(result.pubdate).toLocaleDateString() : 'N/A'}
          </p>
          {/* Você pode exibir mais informações se desejar, como expiryDate, hosts, etc. */}
        </div>
      )}
      
      {!result && !error && !loading && (
          <p>Digite um domínio (.br) acima para consultar seu status.</p>
      )}

    </div>
  );
}

export default RegistroList;