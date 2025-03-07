import React from 'react';

const FilterButtonsRF = ({ tipoFiltro, setTipoFiltro }) => {
  const filtros = ['Todos', 'LCI', 'LCA', 'CDB', 'Nenhum'];

  return (
    <div className="filtro-container">
      {filtros.map((f) => (
        <button
          key={f}
          className={`filtro-botao ${tipoFiltro === f ? 'ativo' : ''}`}
          onClick={() => setTipoFiltro(f)}
        >
          {f}
        </button>
      ))}
    </div>
  );
};

export default FilterButtonsRF;