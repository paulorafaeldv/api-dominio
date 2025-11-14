import React, { useState } from 'react';

// URL base da API
const API_BASE_URL = 'https://brasilapi.com.br/api/registro-br/v1'; 

function RegistroList() {
  // HOOKS DE ESTADO
  const [inputDomain, setInputDomain] = useState(''); 
  const [result, setResult] = useState(null); 
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null);

  // Função chamada ao enviar o formulário
  const handleSearch = async (e) => {
    e.preventDefault(); 
    
    if (!inputDomain.trim()) {
      setError("Por favor, digite um nome de domínio completo (ex: site.com.br).");
      setResult(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setResult(null);
      
      // 1. Prepara e Limpa o domínio
      const preparedDomain = inputDomain.toLowerCase().trim();
      
      // 2. CORREÇÃO DE URL: Usa encodeURIComponent para garantir que o '.' seja tratado
      // corretamente no caminho da URL, resolvendo o problema de "Não Encontrado" (404).
      const encodedDomain = encodeURIComponent(preparedDomain); 

      // Monta o endpoint dinâmico
      const endpoint = `${API_BASE_URL}/${encodedDomain}`;
      
      const response = await fetch(endpoint);
      
      // Verifica o status de resposta
      if (response.status === 404) {
          throw new Error(`Domínio '${inputDomain}' não encontrado ou inválido.`);
      }
      if (!response.ok) {
        throw new Error(`Erro ao buscar domínio. Código HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      setResult(data); 

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // RENDERIZAÇÃO
  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h2>🔍 Buscar Status de Domínio .BR</h2>
      
      {/* Formulário de Busca */}
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input
          type="text"
          value={inputDomain}
          onChange={(e) => setInputDomain(e.target.value)}
          placeholder="Ex: seuprojeto.com.br"
          style={{ padding: '10px', flexGrow: 1, border: '1px solid #ccc', borderRadius: '4px' }}
          disabled={loading}
        />
        <button type="submit" disabled={loading} style={{ padding: '10px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          {loading ? 'Buscando...' : 'Buscar'}
        </button>
      </form>
      
      {/* EXIBIÇÃO DE STATUS E RESULTADOS */}
      
      {error && <p style={{ color: 'white', backgroundColor: '#dc3545', padding: '10px', borderRadius: '4px' }}>⚠️ **Erro:** {error}</p>}
      
      {loading && <p>Buscando informações do domínio...</p>}
      
      {result && !loading && (
        <div style={{ border: `2px solid ${result.status === 'DISPONIVEL' ? '#28a745' : '#ffc107'}`, padding: '15px', borderRadius: '5px', backgroundColor: '#f8f9fa' }}>
          <h3>✅ Status do Domínio: `{result.domain}`</h3>
          <p>
            **Status:** **`{result.status}`** {result.status === 'DISPONIVEL' && <span style={{ color: 'green', fontWeight: 'bold' }}> (Livre para registro!)</span>}
            {result.status === 'REGISTRADO' && <span style={{ color: 'red', fontWeight: 'bold' }}> (Ocupado!)</span>}
          </p>
          <p>
            **Data de Registro:** {result.pubdate ? new Date(result.pubdate).toLocaleDateString() : 'Não aplicável'}
          </p>
        </div>
      )}
      
      {!result && !error && !loading && (
          <p>Digite um domínio (.br) acima e clique em 'Buscar' para consultar seu status.</p>
      )}

    </div>
  );
}

export default RegistroList;