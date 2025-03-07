import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

const TableRendaFixa = ({ rendaFixa, formatDate, formatCurrency, handleEdit, handleDelete, filtro }) => {
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
              <td data-label="Tipo">{aplicacao.tipo}</td>
              <td data-label="Data de Aquisição">{formatDate(aplicacao.data_aquisicao)}</td>
              <td data-label="% do CDI">{aplicacao.percentual_cdi}%</td>
              <td data-label="Instituição">{aplicacao.instituicao}</td>
              <td data-label="Data de Vencimento">{formatDate(aplicacao.data_vencimento)}</td>
              <td data-label="Valor Investido">{formatCurrency(aplicacao.valor)}</td>
              <td data-label="Valor Atualizado">{formatCurrency(aplicacao.valor_atualizado)}</td>
              <td data-label="Lucro">{formatCurrency(aplicacao.lucro)}</td>
              <td data-label="Ações">
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
            <td data-label="Total Investido">{formatCurrency(totalInvestido)}</td>
            <td data-label="Total Atualizado">{formatCurrency(totalAtualizado)}</td>
            <td data-label="Lucro Total">{formatCurrency(lucroTotal)}</td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default TableRendaFixa;