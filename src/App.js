import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import Form from './components/Form';
import Table from './components/Table';
import Chart from './components/Chart';
import FilterButtons from './components/FilterButtons';
import FilterButtonsRF from './components/FilterButtonsRF';
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
  const [filtro, setFiltro] = useState('Todos');
  const [rendaFixa, setRendaFixa] = useState([]);
  const [formRendaFixa, setFormRendaFixa] = useState({ tipo: '', data_aquisicao: '', percentual_cdi: '', instituicao: '', valor: '', data_vencimento: '' });
  const [editIdRendaFixa, setEditIdRendaFixa] = useState(null);
  const [showFormAcoes, setShowFormAcoes] = useState(false);
  const [showFormRendaFixa, setShowFormRendaFixa] = useState(false);
  const [tipoFiltro, setTipoFiltro] = useState('Todos');

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
  
    // Verifica se o formulário é de renda fixa ou de ações
    if (apiEndpoint === 'carteira') {
      formattedForm = {
        ...form,
        valor_compra: parseFloat(form.valor_compra.replace(/[^\d,]/g, '').replace(',', '.'))
      };
    } else if (apiEndpoint === 'renda-fixa') {
      // Aqui você pode adicionar qualquer formatação necessária para o formulário de renda fixa
      formattedForm = {
        ...form,
        valor: parseFloat(form.valor.replace(/[^\d,]/g, '').replace(',', '.'))
      };
    }
  
    const apiUrl = apiEndpoint === 'carteira' ? 'http://localhost:3001/api' : 'http://localhost:3002/api';
    
    if (editId) {
      await axios.put(`${apiUrl}/${apiEndpoint}/${editId}`, formattedForm);
      setEditIdFunction(null);
    } else {
      await axios.post(`${apiUrl}/${apiEndpoint}`, formattedForm);
    }
  
    // Reseta o formulário após a submissão
    setFormFunction(apiEndpoint === 'carteira' 
      ? { ticker: '', data_compra: '', valor_compra: '', quantidade: '' } 
      : { tipo: '', data_aquisicao: '', percentual_cdi: '', instituicao: '', valor: '', data_vencimento: '' }
    );
  
    // Atualiza a lista de investimentos
    fetchFunction().then(apiEndpoint === 'carteira' ? setCarteira : setRendaFixa);
  
    // Fecha o formulário
    setShowFormFunction(false);
  };

  // const handleEdit = (item, setFormFunction, setEditIdFunction, setShowFormFunction) => {
  //   setFormFunction({
  //     ticker: item.ticker,
  //     data_compra: item.data_compra,
  //     valor_compra: item.valor_compra ? item.valor_compra.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '',
  //     quantidade: item.quantidade
  //   });
  //   setEditIdFunction(item.id);
  //   setShowFormFunction(true);
  // };

  const handleEdit = (item, setFormFunction, setEditIdFunction, setShowFormFunction) => {
    if (item.ticker) {
      // Edição de ações
      setFormFunction({
        ticker: item.ticker,
        data_compra: item.data_compra,
        valor_compra: item.valor_compra ? item.valor_compra.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '',
        quantidade: item.quantidade
      });
    } else {
      // Edição de renda fixa
      setFormFunction({
        tipo: item.tipo,
        data_aquisicao: item.data_aquisicao,
        percentual_cdi: item.percentual_cdi,
        instituicao: item.instituicao,
        valor: item.valor ? item.valor.toString() : '', // Garante que o valor seja uma string
        data_vencimento: item.data_vencimento
      });
    }
    setEditIdFunction(item.id);
    setShowFormFunction(true);
  };

  const handleDelete = async (id, apiEndpoint, fetchFunction, setFunction) => {
    const apiUrl = apiEndpoint === 'carteira' ? 'http://localhost:3001/api' : 'http://localhost:3002/api';
    await axios.delete(`${apiUrl}/${apiEndpoint}/${id}`);
    fetchFunction().then(setFunction);
  };

  const filtrarCarteira = () => {
    if (filtro === 'Todos') return carteira;
    if (filtro === 'Nenhum') return [];
    return carteira.filter(acao => filtro === 'Ações' ? !acao.ticker.endsWith('11') : acao.ticker.endsWith('11'));
  };

  const filtrarRendaFixa = () => {
    if (tipoFiltro === 'Todos') return rendaFixa;
    if (tipoFiltro === 'Nenhum') return [];
    return rendaFixa.filter(aplicacao => aplicacao.tipo === tipoFiltro);
  };

  const agruparRendaFixa = () => {
    const agrupado = {};
    filtrarRendaFixa().forEach(aplicacao => {
      if (!agrupado[aplicacao.tipo]) agrupado[aplicacao.tipo] = 0;
      agrupado[aplicacao.tipo] += aplicacao.valor_atualizado;
    });
    return Object.keys(agrupado).map(tipo => ({
      name: tipo,
      valor: agrupado[tipo]
    }));
  };

  const calcularTotais = (filtrarFunc, key) => {
    return filtrarFunc().reduce((total, item) => total + item[key], 0);
  };

  const dataBarChart = [
    ...filtrarCarteira().map(acao => ({
      name: acao.ticker,
      valor: acao.valor_atualizado
    })),
    ...agruparRendaFixa()
  ];

  const totalInvestidoFiltrado = calcularTotais(filtrarCarteira, 'valor_investido') + calcularTotais(filtrarRendaFixa, 'valor');
  const totalAtualizadoFiltrado = calcularTotais(filtrarCarteira, 'valor_atualizado') + calcularTotais(filtrarRendaFixa, 'valor_atualizado');
  const lucroTotalFiltrado = calcularTotais(filtrarCarteira, 'lucro') + calcularTotais(filtrarRendaFixa, 'lucro');

  const totalAcoes = calcularTotais(() => filtrarCarteira().filter(acao => !acao.ticker.endsWith('11')), 'valor_atualizado');
  const totalFIIs = calcularTotais(() => filtrarCarteira().filter(acao => acao.ticker.endsWith('11')), 'valor_atualizado');
  const totalCDB = calcularTotais(() => filtrarRendaFixa().filter(aplicacao => aplicacao.tipo === 'CDB'), 'valor_atualizado');
  const totalLCI = calcularTotais(() => filtrarRendaFixa().filter(aplicacao => aplicacao.tipo === 'LCI'), 'valor_atualizado');
  const totalLCA = calcularTotais(() => filtrarRendaFixa().filter(aplicacao => aplicacao.tipo === 'LCA'), 'valor_atualizado');

  return (
    <div className="app-container">
      <h1 className="titulo-centralizado">Carteira de Investimentos</h1>
      <br></br>
      
      <div className="totais-e-grafico">
        <div className="totais">
          <h2>Totais Gerais</h2>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Valor</th>
                <th>%</th>
              </tr>
            </thead>
            <tbody>
              {totalAcoes > 0 && (
                <tr>
                  <td><strong>Ações:</strong></td>
                  <td>{formatCurrency(totalAcoes)}</td>
                  <td>{((totalAcoes / totalInvestidoFiltrado) * 100).toFixed(2)}%</td>
                </tr>
              )}
              {totalFIIs > 0 && (
                <tr>
                  <td><strong>Fundos Imobiliários:</strong></td>
                  <td>{formatCurrency(totalFIIs)}</td>
                  <td>{((totalFIIs / totalInvestidoFiltrado) * 100).toFixed(2)}%</td>
                </tr>
              )}
              {totalCDB > 0 && (
                <tr>
                  <td><strong>CDB:</strong></td>
                  <td>{formatCurrency(totalCDB)}</td>
                  <td>{((totalCDB / totalInvestidoFiltrado) * 100).toFixed(2)}%</td>
                </tr>
              )}
              {totalLCI > 0 && (
                <tr>
                  <td><strong>LCI:</strong></td>
                  <td>{formatCurrency(totalLCI)}</td>
                  <td>{((totalLCI / totalInvestidoFiltrado) * 100).toFixed(2)}%</td>
                </tr>
              )}
              {totalLCA > 0 && (
                <tr>
                  <td><strong>LCA:</strong></td>
                  <td>{formatCurrency(totalLCA)}</td>
                  <td>{((totalLCA / totalInvestidoFiltrado) * 100).toFixed(2)}%</td>
                </tr>
              )}
              <tr>
                <td><strong>Total Investido:</strong></td>
                <td colSpan="2">{formatCurrency(totalInvestidoFiltrado)}</td>
              </tr>
              <tr>
                <td><strong>Total Atualizado:</strong></td>
                <td colSpan="2">{formatCurrency(totalAtualizadoFiltrado)}</td>
              </tr>
              <tr>
                <td><strong>Lucro Total:</strong></td>
                <td colSpan="2">{formatCurrency(lucroTotalFiltrado)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="filtros-e-grafico">
          <div className="filtros-vertical">
            <h3>Renda Variável</h3>
            <FilterButtons filtro={filtro} setFiltro={setFiltro} />
          </div>
          <div className="grafico">
            <Chart dataBarChart={dataBarChart} />
          </div>
          <div className="filtros-vertical">
            <h3>Renda Fixa</h3>
            <FilterButtonsRF tipoFiltro={tipoFiltro} setTipoFiltro={setTipoFiltro} />
          </div>
        </div>
      </div>
      <h2>Investimentos em Renda Variável
        <button className="icon-button" onClick={() => setShowFormAcoes(!showFormAcoes)}>
          <FontAwesomeIcon icon={faPlus} />
        </button></h2>
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
          setFiltro={setFiltro}
        />
      <h2>Investimentos em Renda Fixa
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
      {/* <TableRendaFixa
        rendaFixa={rendaFixa}
        formatDate={formatDate}
        formatCurrency={formatCurrency}
        handleEdit={(aplicacao) => handleEdit(aplicacao, setFormRendaFixa, setEditIdRendaFixa, setShowFormRendaFixa)}
        handleDelete={(id) => handleDelete(id, 'renda-fixa', fetchRendaFixa, setRendaFixa)}
        tipoFiltro={tipoFiltro}
      /> */}<TableRendaFixa
  rendaFixa={rendaFixa}
  formatDate={formatDate}
  formatCurrency={formatCurrency}
  handleEdit={(aplicacao) => handleEdit(aplicacao, setFormRendaFixa, setEditIdRendaFixa, setShowFormRendaFixa)}
  handleDelete={(id) => handleDelete(id, 'renda-fixa', fetchRendaFixa, setRendaFixa)}
  tipoFiltro={tipoFiltro}
/>
    </div>
  );
}

export default App;