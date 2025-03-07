import React from 'react';

const FilterButtons = ({ filtro, setFiltro }) => {
  // Classes de ativos disponíveis para filtro
  const classesAtivos = ['Ações', 'FIIs', 'LCI', 'LCA', 'CDB'];

  // Função para alternar o estado de uma classe de ativo
  const toggleFiltro = (classe) => {
    setFiltro((prevFiltro) => ({
      ...prevFiltro,
      [classe]: !prevFiltro[classe], // Inverte o estado atual (true/false)
    }));
  };

  return (
    <div className="filtro-container">
      {classesAtivos.map((classe) => (
        <button
          key={classe}
          className={`filtro-botao ${filtro[classe] ? 'ativo' : ''}`} // Adiciona classe 'ativo' se o filtro estiver habilitado
          onClick={() => toggleFiltro(classe)} // Alterna o estado do filtro
        >
          {classe}
        </button>
      ))}
    </div>
  );
};

export default FilterButtons;