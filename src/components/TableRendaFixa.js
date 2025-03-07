import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

const TableRendaFixa = ({ rendaFixa, formatDate, formatCurrency, handleEdit, handleDelete, filtro }) => {
  const [expandedCardId, setExpandedCardId] = useState(null); // Controla qual card está expandido

  // Função para filtrar a renda fixa com base no filtro único
  const filtrarRendaFixa = () => {
    if (!filtro) return rendaFixa; // Se filtro for undefined, retorna todas as aplicações
    return rendaFixa.filter(aplicacao => filtro[aplicacao.tipo]); // Filtra apenas as aplicações cujo tipo está ativo no filtro
  };

  const rendaFixaFiltrada = filtrarRendaFixa();

  // Calcula os totais
  const totalInvestido = rendaFixaFiltrada.reduce((total, aplicacao) => total + aplicacao.valor, 0);
  const totalAtualizado = rendaFixaFiltrada.reduce((total, aplicacao) => total + aplicacao.valor_atualizado, 0);
  const lucroTotal = rendaFixaFiltrada.reduce((total, aplicacao) => total + aplicacao.lucro, 0);

  const toggleExpand = (id) => {
    setExpandedCardId(expandedCardId === id ? null : id); // Expande/recolhe o card
  };

  return (
    <div className="cards-container">
      {rendaFixaFiltrada.map((aplicacao) => (
        <div key={aplicacao.id} className="card">
          <div className="card-header" onClick={() => toggleExpand(aplicacao.id)}>
            <div className="card-header-info">
              <h3>{aplicacao.tipo}</h3>
              <p>{aplicacao.instituicao}</p>
            </div>
            <div className="card-header-values">
              <p><strong>% do CDI:</strong> {aplicacao.percentual_cdi}%</p>
              <p><strong>Valor Atualizado:</strong> {formatCurrency(aplicacao.valor_atualizado)}</p>
            </div>
            <div className="card-header-actions">
              <button className="icon-button" onClick={(e) => { e.stopPropagation(); handleEdit(aplicacao); }}>
                <FontAwesomeIcon icon={faEdit} />
              </button>
              <button className="icon-button" onClick={(e) => { e.stopPropagation(); handleDelete(aplicacao.id); }}>
                <FontAwesomeIcon icon={faTrash} />
              </button>
              <FontAwesomeIcon icon={expandedCardId === aplicacao.id ? faChevronUp : faChevronDown} />
            </div>
          </div>
          {expandedCardId === aplicacao.id && (
            <div className="card-details">
              <p><strong>Data de Aquisição:</strong> {formatDate(aplicacao.data_aquisicao)}</p>
              <p><strong>Data de Vencimento:</strong> {formatDate(aplicacao.data_vencimento)}</p>
              <p><strong>Valor Investido:</strong> {formatCurrency(aplicacao.valor)}</p>
              <p><strong>Lucro:</strong> {formatCurrency(aplicacao.lucro)}</p>
            </div>
          )}
        </div>
      ))}
      <div className="card-totais">
        <h3>Totais</h3>
        <p><strong>Total Investido:</strong> {formatCurrency(totalInvestido)}</p>
        <p><strong>Total Atualizado:</strong> {formatCurrency(totalAtualizado)}</p>
        <p><strong>Lucro Total:</strong> {formatCurrency(lucroTotal)}</p>
      </div>
    </div>
  );
};

export default TableRendaFixa;
