import React, { useState } from "react";

const API_BASE_URL = "https://brasilapi.com.br/api/registrobr/v1";

function RegistroList() {
  const [inputDomain, setInputDomain] = useState("");
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
      
      const response = await fetch(endpoint);

      if (response.status === 404) {
        throw new Error(`Domínio '${inputDomain}' não encontrado, inválido ou sem informação na API.`);
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

      <h1 className="reg-title">🔍 Buscar Status de Domínio .BR</h1>

      <form onSubmit={handleSearch} className="reg-form">
        <input
          type="text"
          value={inputDomain}
          onChange={(e) => setInputDomain(e.target.value)}
          placeholder="Ex: google.com.br"
          className="reg-input"
          disabled={loading}
        />

        <button type="submit" className="reg-button" disabled={loading}>
          {loading ? "Buscando..." : "Buscar"}
        </button>
      </form>

      {error && <div className="reg-error">⚠️ {error}</div>}

      {result && !loading && (
        <div className="reg-result">
          <h3>{result.domain}</h3>

          <p>
            <strong>Status:</strong> {result.status}
            {result.status === "DISPONIVEL" && " (Livre para registro!)"}
            {result.status === "REGISTRADO" && " (Ocupado!)"}
          </p>
        </div>
      )}

    </div>
  );
}

export default RegistroList;
