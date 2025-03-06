import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

const Table = ({ carteira, filtrarCarteira, formatDate, formatCurrency, handleEdit, handleDelete }) => {
  const [totaisFiltrados, setTotaisFiltrados] = useState({
    totalInvestido: 0,
    totalAtualizado: 0,
    lucroTotal: 0,
  });

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

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Ticker</th>
            <th>Nome</th>
            <th>Data de Compra</th>
            <th>Valor de Compra</th>
            <th>Quantidade</th>
            <th>Cotação Atual</th>
            <th>Valor Investido</th>
            <th>Valor Atualizado</th>
            <th>Lucro</th>
            <th>% da Carteira</th>
            <th>Tipo</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {filtrarCarteira().map((acao) => (
            <tr key={acao.id}>
              <td>{acao.ticker.toUpperCase()}</td>
              <td>{acao.nome}</td>
              <td>{formatDate(acao.data_compra)}</td>
              <td>{formatCurrency(acao.valor_compra)}</td>
              <td>{acao.quantidade}</td>
              <td>{formatCurrency(acao.cotacao_atual)}</td>
              <td>{formatCurrency(acao.valor_investido)}</td>
              <td>{formatCurrency(acao.valor_atualizado)}</td>
              <td>{formatCurrency(acao.lucro)}</td>
              <td>{((acao.valor_atualizado / totaisFiltrados.totalAtualizado) * 100).toFixed(2)}%</td>
              <td>{acao.ticker.endsWith('11') ? 'FII' : 'Ação'}</td>
              <td>
                <button className="icon-button" onClick={() => handleEdit(acao)}>
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button className="icon-button" onClick={() => handleDelete(acao.id)}>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </td>
            </tr>
          ))}
          <tr>
            <td colSpan="6">Totais</td>
            <td>{formatCurrency(totaisFiltrados.totalInvestido)}</td>
            <td>{formatCurrency(totaisFiltrados.totalAtualizado)}</td>
            <td>{formatCurrency(totaisFiltrados.lucroTotal)}</td>
            <td colSpan="3"></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Table;