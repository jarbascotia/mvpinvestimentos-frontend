import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

const Table = ({ carteira, filtrarCarteira, formatDate, formatCurrency, handleEdit, handleDelete }) => {
  const [totaisFiltrados, setTotaisFiltrados] = useState({
    totalInvestido: 0,
    totalAtualizado: 0,
    lucroTotal: 0,
  });

  const [expandedCardId, setExpandedCardId] = useState(null); // Controla qual card está expandido

  useEffect(() => {
    const totais = filtrarCarteira().reduce(
      (acc, acao) => {
        acc.totalInvestido += acao.valor_investido;
        acc.totalAtualizado += acao.valor_atualizado;
        acc.lucroTotal += acao.lucro;
        return acc;
      },
      { totalInvestido: 0, totalAtualizado: 0, lucroTotal: 0 }
    );
    setTotaisFiltrados(totais);
  }, [carteira, filtrarCarteira]);

  const toggleExpand = (id) => {
    setExpandedCardId(expandedCardId === id ? null : id); // Expande/recolhe o card
  };

  return (
    <div className="cards-container">
      {filtrarCarteira().map((acao) => (
        <div key={acao.id} className="card">
          <div className="card-header" onClick={() => toggleExpand(acao.id)}>
            <div className="card-header-col1">
              <h3>{acao.ticker.toUpperCase()}</h3>
              <p>{acao.nome}</p>
            </div>
            <div className="card-header-col2">
              <p>Cotação: {formatCurrency(acao.cotacao_atual)}</p>
              <p><strong>Saldo: </strong>{formatCurrency(acao.valor_atualizado)}</p>
            </div>
            <div className="card-header-actions">
              <button className="icon-button" onClick={(e) => { e.stopPropagation(); handleEdit(acao); }}>
                <FontAwesomeIcon icon={faEdit} />
              </button>
              <button className="icon-button" onClick={(e) => { e.stopPropagation(); handleDelete(acao.id); }}>
                <FontAwesomeIcon icon={faTrash} />
              </button>
              <FontAwesomeIcon icon={expandedCardId === acao.id ? faChevronUp : faChevronDown} />
            </div>
          </div>
          {expandedCardId === acao.id && (
            <div className="card-details">
              <p><strong>Data de Compra:</strong> {formatDate(acao.data_compra)}</p>
              <p><strong>Valor de Compra:</strong> {formatCurrency(acao.valor_compra)}</p>
              <p><strong>Quantidade:</strong> {acao.quantidade}</p>
              <p><strong>Valor Investido:</strong> {formatCurrency(acao.valor_investido)}</p>
              <p><strong>Lucro:</strong> {formatCurrency(acao.lucro)}</p>
              <p><strong>% da Carteira:</strong> {((acao.valor_atualizado / totaisFiltrados.totalAtualizado) * 100).toFixed(2)}%</p>
              <p><strong>Tipo:</strong> {acao.ticker.endsWith('11') ? 'FII' : 'Ação'}</p>
            </div>
          )}
        </div>
      ))}
      <div className="card-totais">
        <h3>Totais</h3>
        <p><strong>Total Investido:</strong> {formatCurrency(totaisFiltrados.totalInvestido)}</p>
        <p><strong>Total Atualizado:</strong> {formatCurrency(totaisFiltrados.totalAtualizado)}</p>
        <p><strong>Lucro Total:</strong> {formatCurrency(totaisFiltrados.lucroTotal)}</p>
      </div>
    </div>
  );
};

export default Table;
