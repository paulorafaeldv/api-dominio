import React, { useState, useEffect } from 'react';

function PostList() {
  // 1. Hook de Estado para armazenar os dados
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. Hook de Efeito para buscar os dados
  useEffect(() => {
    // Função assíncrona para fazer a requisição
    const fetchPosts = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5');
        
        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []); // O array vazio `[]` garante que a função só rode uma vez (após a montagem)

  // 3. Renderização Condicional
  if (loading) {
    return <div>Carregando posts...</div>;
  }

  if (error) {
    return <div>Erro ao carregar os dados: {error}</div>;
  }

  // 4. Renderização da Lista de Dados
  return (
    <div>
      <h2>Lista de Posts (API Importada)</h2>
      {posts.map(post => (
        <div key={post.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
          <h3>{post.title}</h3>
          <p>{post.body.substring(0, 100)}...</p>
        </div>
      ))}
    </div>
  );
}

export default PostList;