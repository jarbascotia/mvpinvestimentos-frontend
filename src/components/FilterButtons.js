import React from 'react';

const FilterButtons = ({ filtro, setFiltro }) => (
  <div className="filtro-container">
    <button className={`filtro-botao ${filtro === 'Todos' ? 'ativo' : ''}`} onClick={() => setFiltro('Todos')}>Todos</button>
    <button className={`filtro-botao ${filtro === 'Ações' ? 'ativo' : ''}`} onClick={() => setFiltro('Ações')}>Ações</button>
    <button className={`filtro-botao ${filtro === 'Fundos Imobiliários' ? 'ativo' : ''}`} onClick={() => setFiltro('Fundos Imobiliários')}>FIIs</button>
    <button className={`filtro-botao ${filtro === 'Exterior' ? 'ativo' : ''}`} onClick={() => setFiltro('Nenhum')}>Exterior</button>
    <button className={`filtro-botao ${filtro === 'Nenhum' ? 'ativo' : ''}`} onClick={() => setFiltro('Nenhum')}>Nenhum</button>
  </div>
);

export default FilterButtons;