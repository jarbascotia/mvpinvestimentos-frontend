import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

const TableRendaFixa = ({ rendaFixa, formatDate, formatCurrency, handleEdit, handleDelete, tipoFiltro }) => {

  const filtrarRendaFixa = () => {
    if (tipoFiltro === 'Todos') {
      return rendaFixa;
    }
    return rendaFixa.filter(aplicacao => aplicacao.tipo === tipoFiltro);
  };

  const rendaFixaFiltrada = filtrarRendaFixa();

  const totalInvestido = rendaFixaFiltrada.reduce((total, aplicacao) => total + aplicacao.valor, 0);
  const totalAtualizado = rendaFixaFiltrada.reduce((total, aplicacao) => total + aplicacao.valor_atualizado, 0);
  const lucroTotal = rendaFixaFiltrada.reduce((total, aplicacao) => total + aplicacao.lucro, 0);

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Tipo</th>
            <th>Data de Aquisição</th>
            <th>% do CDI</th>
            <th>Instituição</th>
            <th>Data de Vencimento</th>
            <th>Valor Investido</th>
            <th>Valor Atualizado</th>
            <th>Lucro</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {rendaFixaFiltrada.map((aplicacao) => (
            <tr key={aplicacao.id}>
              <td>{aplicacao.tipo}</td>
              <td>{formatDate(aplicacao.data_aquisicao)}</td>
              <td>{aplicacao.percentual_cdi}%</td>
              <td>{aplicacao.instituicao}</td>
              <td>{formatDate(aplicacao.data_vencimento)}</td>
              <td>{formatCurrency(aplicacao.valor)}</td>
              <td>{formatCurrency(aplicacao.valor_atualizado)}</td>
              <td>{formatCurrency(aplicacao.lucro)}</td>
              <td>
                <button className="icon-button" onClick={() => handleEdit(aplicacao)}>
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button className="icon-button" onClick={() => handleDelete(aplicacao.id)}>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </td>
            </tr>
          ))}
          <tr>
            <td colSpan="5">Totais</td>
            <td>{formatCurrency(totalInvestido)}</td>
            <td>{formatCurrency(totalAtualizado)}</td>
            <td>{formatCurrency(lucroTotal)}</td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default TableRendaFixa;