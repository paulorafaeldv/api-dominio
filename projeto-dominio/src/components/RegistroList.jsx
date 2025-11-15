import React, { useState } from 'react';

const API_BASE_URL = 'https://brasilapi.com.br/api/registrobr/v1';

function RegistroList() {
  const [inputDomain, setInputDomain] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

      const preparedDomain = inputDomain.toLowerCase().trim();
      const endpoint = `${API_BASE_URL}/${preparedDomain}`;

      console.log("URL enviada:", endpoint);

      const response = await fetch(endpoint);

      if (response.status === 404) {
        throw new Error(`Domínio '${inputDomain}' não encontrado.`);
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

  return (
    <div className="reg-container">
      
      <h2 className="reg-title">🔍 Buscar Status de Domínio .BR</h2>

      <form onSubmit={handleSearch} className="reg-form">
        <input
          type="text"
          value={inputDomain}
          onChange={(e) => setInputDomain(e.target.value)}
          placeholder="Ex: google.com.br"
          className="reg-input"
          disabled={loading}
        />

        <button type="submit" disabled={loading} className="reg-button">
          {loading ? 'Buscando...' : 'Buscar'}
        </button>
      </form>

      {error && <p className="reg-error">⚠️ Erro: {error}</p>}

      {loading && <p>Buscando informações do domínio...</p>}

      {result && !loading && (
        <div className="reg-result">
          <h3>Status do Domínio: {result.domain}</h3>

          <p>
            <strong>Status:</strong> {result.status}{' '}
            {result.status === 'DISPONIVEL' && (
              <span style={{ color: 'lightgreen', fontWeight: 'bold' }}>
                (Livre!)
              </span>
            )}
            {result.status === 'REGISTRADO' && (
              <span style={{ color: 'red', fontWeight: 'bold' }}>
                (Ocupado!)
              </span>
            )}
          </p>

          <p>
            <strong>Data de Registro:</strong>{' '}
            {result.pubdate
              ? new Date(result.pubdate).toLocaleDateString()
              : 'Não aplicável'}
          </p>
        </div>
      )}

      {!result && !error && !loading && (
        <p>Digite um domínio acima e clique em Buscar.</p>
      )}
    </div>
  );
}

export default RegistroList;
