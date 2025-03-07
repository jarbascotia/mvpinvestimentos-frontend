import React, { useState } from 'react';
import { formatCurrency } from '../utils/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import Chart from './Chart'; // Importe o componente Chart

// TotaisCards.js

const TotaisCards = ({ totaisPorCategoria, formatCurrency, categorias }) => {
    const [expandedCard, setExpandedCard] = useState(null);
  
    const calcularTotaisGerais = () => {
      return Object.values(totaisPorCategoria).reduce(
        (acc, categoria) => {
          acc.valorAtualizado += categoria.valorAtualizado;
          acc.lucro += categoria.lucro;
          return acc;
        },
        { valorAtualizado: 0, lucro: 0 }
      );
    };
  
    const totaisGerais = calcularTotaisGerais();
  
    const toggleExpand = (categoria) => {
      setExpandedCard(expandedCard === categoria ? null : categoria);
    };
  
    return (
      <div className="totais-cards-layout">
        {categorias.map((categoria) => (
          categoria === 'Totais Gerais' ? (
            <div key={categoria} className="totais-gerais-card">
              <div className="totais-card-info">
                <h3>{categoria}</h3>
                <p>Valor Atualizado: {formatCurrency(totaisGerais.valorAtualizado)}</p>
                <p>Lucro: {formatCurrency(totaisGerais.lucro)}</p>
              </div>
            </div>
          ) : (
            totaisPorCategoria[categoria] && (
              <div key={categoria} className="totais-card">
                <div className="totais-card-header" onClick={() => toggleExpand(categoria)}>
                  <div className="totais-card-info">
                    <h3>{categoria}</h3>
                    <p>Valor Atualizado: {formatCurrency(totaisPorCategoria[categoria].valorAtualizado)}</p>
                    <p>Lucro: {formatCurrency(totaisPorCategoria[categoria].lucro)}</p>
                  </div>
                  <div className="totais-card-actions">
                    <FontAwesomeIcon icon={expandedCard === categoria ? faChevronUp : faChevronDown} />
                  </div>
                </div>
                {expandedCard === categoria && (
                  <div className="ativos-container">
                    {totaisPorCategoria[categoria].ativos.map((ativo) => (
                      <div key={ativo.id} className="ativo-card">
                        <div className="ativo-card-info">
                          <h4>{ativo.ticker || ativo.tipo}</h4>
                          <p>Valor Investido: {formatCurrency(ativo.valor_investido || ativo.valor)}</p>
                          <p>Valor Atualizado: {formatCurrency(ativo.valor_atualizado)}</p>
                          <p>Lucro: {formatCurrency(ativo.lucro)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          )
        ))}
      </div>
    );
  };
  
  export default TotaisCards;