import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import Form from './components/Form';
import Table from './components/Table';
import Chart from './components/Chart';
import FilterButtons from './components/FilterButtons';
import FormRendaFixa from './components/FormRendaFixa';
import TableRendaFixa from './components/TableRendaFixa';
import { fetchCarteira, fetchRendaFixa } from './services/apiService';
import { formatCurrency, formatDate } from './utils/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

function App() {
  const [carteira, setCarteira] = useState([]);
  const [form, setForm] = useState({ ticker: '', data_compra: '', valor_compra: '', quantidade: '' });
  const [editId, setEditId] = useState(null);
  const [rendaFixa, setRendaFixa] = useState([]);
  const [formRendaFixa, setFormRendaFixa] = useState({ tipo: '', data_aquisicao: '', percentual_cdi: '', instituicao: '', valor: '', data_vencimento: '' });
  const [editIdRendaFixa, setEditIdRendaFixa] = useState(null);
  const [showFormAcoes, setShowFormAcoes] = useState(false);
  const [showFormRendaFixa, setShowFormRendaFixa] = useState(false);

  // Estado único para o filtro
  const [filtro, setFiltro] = useState({
    Ações: true,
    FIIs: true,
    Exterior: true,
    LCI: true,
    LCA: true,
    CDB: true,
  });

  useEffect(() => {
    fetchCarteira().then(setCarteira);
    fetchRendaFixa().then(setRendaFixa);
  }, []);

  const handleChange = (e, setFormFunction) => {
    const { name, value } = e.target;
    setFormFunction(prevForm => ({
      ...prevForm,
      [name]: name === 'ticker' ? value.toUpperCase() : value
    }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (name === 'valor_compra') {
      const formattedValue = parseFloat(value.replace(',', '.')).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
      setForm(prevForm => ({ ...prevForm, [name]: formattedValue }));
    }
  };

  const handleSubmit = async (e, form, setFormFunction, editId, setEditIdFunction, fetchFunction, apiEndpoint, setShowFormFunction) => {
    e.preventDefault();
    
    let formattedForm = { ...form };
  
    if (apiEndpoint === 'carteira') {
      formattedForm = {
        ...form,
        valor_compra: parseFloat(form.valor_compra.replace(/[^\d,]/g, '').replace(',', '.'))
      };
    } else if (apiEndpoint === 'renda-fixa') {
      formattedForm = {
        ...form,
        valor: parseFloat(form.valor.replace(/[^\d,]/g, '').replace(',', '.'))
      };
    }
  
    const apiUrl = apiEndpoint === 'carteira' ? 'https://mvpinvestimentos-acoes.onrender.com/api' : 'https://mvpinvestimentos-renda-fixa.onrender.com/api';
    
    if (editId) {
      await axios.put(`${apiUrl}/${apiEndpoint}/${editId}`, formattedForm);
      setEditIdFunction(null);
    } else {
      await axios.post(`${apiUrl}/${apiEndpoint}`, formattedForm);
    }
  
    setFormFunction(apiEndpoint === 'carteira' 
      ? { ticker: '', data_compra: '', valor_compra: '', quantidade: '' } 
      : { tipo: '', data_aquisicao: '', percentual_cdi: '', instituicao: '', valor: '', data_vencimento: '' }
    );
  
    fetchFunction().then(apiEndpoint === 'carteira' ? setCarteira : setRendaFixa);
    setShowFormFunction(false);
  };

  const handleEdit = (item, setFormFunction, setEditIdFunction, setShowFormFunction) => {
    if (item.ticker) {
      setFormFunction({
        ticker: item.ticker,
        data_compra: item.data_compra,
        valor_compra: item.valor_compra ? item.valor_compra.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '',
        quantidade: item.quantidade
      });
    } else {
      setFormFunction({
        tipo: item.tipo,
        data_aquisicao: item.data_aquisicao,
        percentual_cdi: item.percentual_cdi,
        instituicao: item.instituicao,
        valor: item.valor ? item.valor.toString() : '',
        data_vencimento: item.data_vencimento
      });
    }
    setEditIdFunction(item.id);
    setShowFormFunction(true);
  };

  const handleDelete = async (id, apiEndpoint, fetchFunction, setFunction) => {
    const apiUrl = apiEndpoint === 'carteira' ? 'https://mvpinvestimentos-acoes.onrender.com/api' : 'https://mvpinvestimentos-renda-fixa.onrender.com/api';
    await axios.delete(`${apiUrl}/${apiEndpoint}/${id}`);
    fetchFunction().then(setFunction);
  };

  // Função para filtrar a carteira com base no filtro único
  const filtrarCarteira = () => {
    return carteira.filter(acao => {
      const tipo = acao.ticker.endsWith('11') ? 'FIIs' : 'Ações'; // Exemplo básico, ajuste conforme necessário
      return filtro[tipo];
    });
  };

  // Função para filtrar a renda fixa com base no filtro único
  const filtrarRendaFixa = () => {
    return rendaFixa.filter(aplicacao => filtro[aplicacao.tipo]);
  };

  // Função para combinar dados do gráfico
  const combinarDadosGrafico = () => {
    const dadosAcoes = filtrarCarteira().reduce((acc, acao) => {
      const tipo = acao.ticker.endsWith('11') ? 'FIIs' : 'Ações';
      if (!acc[tipo]) {
        acc[tipo] = { name: tipo, valor: 0 };
      }
      acc[tipo].valor += acao.valor_atualizado || 0;
      return acc;
    }, {});

    const dadosRendaFixa = filtrarRendaFixa().reduce((acc, aplicacao) => {
      if (!acc[aplicacao.tipo]) {
        acc[aplicacao.tipo] = { name: aplicacao.tipo, valor: 0 };
      }
      acc[aplicacao.tipo].valor += aplicacao.valor_atualizado || 0;
      return acc;
    }, {});

    return [...Object.values(dadosAcoes), ...Object.values(dadosRendaFixa)];
  };

  // Função para calcular totais por categoria
  const calcularTotaisPorCategoria = () => {
    // Agrupar renda variável (Ações, FIIs, Exterior)
    const totaisRendaVariavel = filtrarCarteira().reduce((acc, acao) => {
      const tipo = acao.ticker.endsWith('11') ? 'FIIs' : 'Ações'; // Exemplo básico, ajuste conforme necessário
      if (!acc[tipo]) {
        acc[tipo] = { valorInvestido: 0, valorAtualizado: 0, lucro: 0 };
      }
      acc[tipo].valorInvestido += acao.valor_investido || 0;
      acc[tipo].valorAtualizado += acao.valor_atualizado || 0;
      acc[tipo].lucro += acao.lucro || 0;
      return acc;
    }, {});

    // Agrupar renda fixa (LCI, LCA, CDB)
    const totaisRendaFixa = filtrarRendaFixa().reduce((acc, aplicacao) => {
      if (['LCI', 'LCA', 'CDB'].includes(aplicacao.tipo)) {
        if (!acc[aplicacao.tipo]) {
          acc[aplicacao.tipo] = { valorInvestido: 0, valorAtualizado: 0, lucro: 0 };
        }
        acc[aplicacao.tipo].valorInvestido += aplicacao.valor || 0;
        acc[aplicacao.tipo].valorAtualizado += aplicacao.valor_atualizado || 0;
        acc[aplicacao.tipo].lucro += aplicacao.lucro || 0;
      }
      return acc;
    }, {});

    // Combinar totais de renda variável e renda fixa
    return { ...totaisRendaVariavel, ...totaisRendaFixa };
  };

  // Exemplo de uso:
  const totaisPorCategoria = calcularTotaisPorCategoria();

  // Calcula os totais gerais
  const totalInvestidoFiltrado = Object.values(totaisPorCategoria).reduce((total, categoria) => total + categoria.valorInvestido, 0);
  const totalAtualizadoFiltrado = Object.values(totaisPorCategoria).reduce((total, categoria) => total + categoria.valorAtualizado, 0);
  const lucroTotalFiltrado = Object.values(totaisPorCategoria).reduce((total, categoria) => total + categoria.lucro, 0);

  return (
    <div className="app-container">
      <h1 className="titulo-centralizado">MVP Investimentos</h1>
      <br></br>

      {/* Filtros */}
      <div className="filtros-container">
        <FilterButtons filtro={filtro} setFiltro={setFiltro} />
      </div>

      {/* Layout Desktop */}
      <div className="desktop-layout">
        <div className="totais-grafico-container">
          <div className="totais-container">
            <h2>Totais Gerais por Categoria</h2>
            <table>
              <thead>
                <tr>
                  <th>Categoria</th>
                  <th>Valor Investido</th>
                  <th>Valor Atualizado</th>
                  <th>Lucro</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(totaisPorCategoria).map(([categoria, totais]) => (
                  <tr key={categoria}>
                    <td data-label="Categoria">{categoria}</td>
                    <td data-label="Valor Investido">{formatCurrency(totais.valorInvestido)}</td>
                    <td data-label="Valor Atualizado">{formatCurrency(totais.valorAtualizado)}</td>
                    <td data-label="Lucro">{formatCurrency(totais.lucro)}</td>
                  </tr>
                ))}
                <tr>
                  <td><strong>Total Geral</strong></td>
                  <td data-label="Total Investido">{formatCurrency(totalInvestidoFiltrado)}</td>
                  <td data-label="Total Atualizado">{formatCurrency(totalAtualizadoFiltrado)}</td>
                  <td data-label="Lucro Total">{formatCurrency(lucroTotalFiltrado)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="grafico-container">
            <Chart dataBarChart={combinarDadosGrafico()} />
          </div>
        </div>
      </div>

      {/* Layout Mobile */}
      <div className="mobile-layout">
        <div className="grafico-container">
          <Chart dataBarChart={combinarDadosGrafico()} />
        </div>
        <div className="totais-container">
          <h2>Totais Gerais por Categoria</h2>
          <table>
            <thead>
              <tr>
                <th>Categoria</th>
                <th>Valor Investido</th>
                <th>Valor Atualizado</th>
                <th>Lucro</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(totaisPorCategoria).map(([categoria, totais]) => (
                <tr key={categoria}>
                  <td data-label="Categoria">{categoria}</td>
                  <td data-label="Valor Investido">{formatCurrency(totais.valorInvestido)}</td>
                  <td data-label="Valor Atualizado">{formatCurrency(totais.valorAtualizado)}</td>
                  <td data-label="Lucro">{formatCurrency(totais.lucro)}</td>
                </tr>
              ))}
              <tr>
                <td><strong>Total Geral</strong></td>
                <td data-label="Total Investido">{formatCurrency(totalInvestidoFiltrado)}</td>
                <td data-label="Total Atualizado">{formatCurrency(totalAtualizadoFiltrado)}</td>
                <td data-label="Lucro Total">{formatCurrency(lucroTotalFiltrado)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Renda Variável e Renda Fixa */}
      <h2>Renda Variável
        <button className="icon-button" onClick={() => setShowFormAcoes(!showFormAcoes)}>
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </h2>
      {showFormAcoes && (
        <Form
          form={form}
          handleChange={(e) => handleChange(e, setForm)}
          handleBlur={handleBlur}
          handleSubmit={(e) => handleSubmit(e, form, setForm, editId, setEditId, fetchCarteira, 'carteira', setShowFormAcoes)}
          editId={editId}
        />
      )}
      <Table
        carteira={carteira}
        filtrarCarteira={filtrarCarteira}
        formatDate={formatDate}
        formatCurrency={formatCurrency}
        handleEdit={(acao) => handleEdit(acao, setForm, setEditId, setShowFormAcoes)}
        handleDelete={(id) => handleDelete(id, 'carteira', fetchCarteira, setCarteira)}
        totalInvestido={totalInvestidoFiltrado}
        totalAtualizado={totalAtualizadoFiltrado}
        lucroTotal={lucroTotalFiltrado}
      />

      <h2>Renda Fixa
        <button className="icon-button" onClick={() => setShowFormRendaFixa(!showFormRendaFixa)}>
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </h2>
      {showFormRendaFixa && (
        <FormRendaFixa
          form={formRendaFixa}
          handleChange={(e) => handleChange(e, setFormRendaFixa)}
          handleSubmit={(e) => handleSubmit(e, formRendaFixa, setFormRendaFixa, editIdRendaFixa, setEditIdRendaFixa, fetchRendaFixa, 'renda-fixa', setShowFormRendaFixa)}
          editIdRendaFixa={editIdRendaFixa}
        />
      )}
      <TableRendaFixa
        rendaFixa={rendaFixa}
        formatDate={formatDate}
        formatCurrency={formatCurrency}
        handleEdit={(aplicacao) => handleEdit(aplicacao, setFormRendaFixa, setEditIdRendaFixa, setShowFormRendaFixa)}
        handleDelete={(id) => handleDelete(id, 'renda-fixa', fetchRendaFixa, setRendaFixa)}
        filtro={filtro}
      />
    </div>
  );
}

export default App;