import React from 'react';

const FilterButtonsRF = ({ tipoFiltro, setTipoFiltro }) => {
  const handleFiltroChange = (tipo) => {
    setTipoFiltro(tipo);
  };

  return (
    <div className="filtro-container">
      <div className="filtros-renda-fixa">
        <button className={`filtro-botao ${tipoFiltro === 'Todos' ? 'ativo' : ''}`} onClick={() => handleFiltroChange('Todos')}>Todos</button>
        <button className={`filtro-botao ${tipoFiltro === 'LCI' ? 'ativo' : ''}`} onClick={() => handleFiltroChange('LCI')}>LCI</button>
        <button className={`filtro-botao ${tipoFiltro === 'LCA' ? 'ativo' : ''}`} onClick={() => handleFiltroChange('LCA')}>LCA</button>
        <button className={`filtro-botao ${tipoFiltro === 'CDB' ? 'ativo' : ''}`} onClick={() => handleFiltroChange('CDB')}>CDB</button>
        <button className={`filtro-botao ${tipoFiltro === 'Nenhum' ? 'ativo' : ''}`} onClick={() => handleFiltroChange('Nenhum')}>Nenhum</button>
      </div>
    </div>
  );
};

export default FilterButtonsRF;