import React, { useState, useEffect } from 'react';
import './App.css';
import Form from './components/Form';
import Table from './components/Table';
import Chart from './components/Chart';
import FilterButtons from './components/FilterButtons';
import FormRendaFixa from './components/FormRendaFixa';
import TableRendaFixa from './components/TableRendaFixa';
import TotaisCards from './components/TotaisCards';
import {
  fetchCarteira,
  fetchRendaFixa,
  saveCarteiraItem,
  saveRendaFixaItem,
  deleteCarteiraItem,
  deleteRendaFixaItem,
} from './services/apiService'; // Importe as funções do apiService
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

  // Carrega os dados da carteira e da renda fixa ao iniciar
  useEffect(() => {
    fetchCarteira().then(setCarteira);
    fetchRendaFixa().then(setRendaFixa);
  }, []);

  // Função para atualizar o estado do formulário
  const handleChange = (e, setFormFunction) => {
    const { name, value } = e.target;
    setFormFunction(prevForm => ({
      ...prevForm,
      [name]: name === 'ticker' ? value.toUpperCase() : value,
    }));
  };

  // Função para formatar o campo "valor_compra" como moeda
  const handleBlur = (e) => {
    const { name, value } = e.target;

    if (name === 'valor_compra') {
      // Remove caracteres não numéricos e substitui vírgula por ponto
      const cleanedValue = value.replace(/[^0-9,.]/g, '').replace(',', '.');
      const numericValue = parseFloat(cleanedValue);

      // Verifica se o valor é um número válido
      if (!isNaN(numericValue)) {
        // Formata o valor como moeda (R$)
        const formattedValue = numericValue.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        });

        // Atualiza o estado com o valor formatado
        setForm((prevForm) => ({
          ...prevForm,
          [name]: formattedValue,
        }));
      } else {
        // Se não for um número válido, define o valor como vazio
        setForm((prevForm) => ({
          ...prevForm,
          [name]: '',
        }));
      }
    }
  };

  // Função para enviar o formulário (carteira ou renda fixa)
  const handleSubmit = async (e, form, setFormFunction, editId, setEditIdFunction, fetchFunction, setFunction, setShowFormFunction) => {
    e.preventDefault();

    let formattedForm = { ...form };

    if (fetchFunction === fetchCarteira) {
      formattedForm = {
        ...form,
        valor_compra: parseFloat(form.valor_compra.replace(/[^\d,]/g, '').replace(',', '.')),
      };
      await saveCarteiraItem(formattedForm, editId);
    } else if (fetchFunction === fetchRendaFixa) {
      formattedForm = {
        ...form,
        valor: parseFloat(form.valor.replace(/[^\d,]/g, '').replace(',', '.')),
      };
      await saveRendaFixaItem(formattedForm, editId);
    }

    // Reseta o formulário após o envio
    setFormFunction(fetchFunction === fetchCarteira
      ? { ticker: '', data_compra: '', valor_compra: '', quantidade: '' }
      : { tipo: '', data_aquisicao: '', percentual_cdi: '', instituicao: '', valor: '', data_vencimento: '' }
    );

    // Atualiza a lista de dados
    fetchFunction().then(setFunction);
    setShowFormFunction(false);
  };

  // Função para editar um item
  const handleEdit = (item, setFormFunction, setEditIdFunction, setShowFormFunction) => {
    if (item.ticker) {
      setFormFunction({
        ticker: item.ticker,
        data_compra: item.data_compra,
        valor_compra: item.valor_compra ? item.valor_compra.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '',
        quantidade: item.quantidade,
      });
    } else {
      setFormFunction({
        tipo: item.tipo,
        data_aquisicao: item.data_aquisicao,
        percentual_cdi: item.percentual_cdi,
        instituicao: item.instituicao,
        valor: item.valor ? item.valor.toString() : '',
        data_vencimento: item.data_vencimento,
      });
    }
    setEditIdFunction(item.id);
    setShowFormFunction(true);
  };

  // Função para deletar um item
  const handleDelete = async (id, fetchFunction, setFunction) => {
    if (fetchFunction === fetchCarteira) {
      await deleteCarteiraItem(id);
    } else if (fetchFunction === fetchRendaFixa) {
      await deleteRendaFixaItem(id);
    }
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
        acc[tipo] = {
          valorInvestido: 0,
          valorAtualizado: 0,
          lucro: 0,
          ativos: [], // Lista de ativos que compõem a categoria
        };
      }
      acc[tipo].valorInvestido += acao.valor_investido || 0;
      acc[tipo].valorAtualizado += acao.valor_atualizado || 0;
      acc[tipo].lucro += acao.lucro || 0;
      acc[tipo].ativos.push(acao); // Adiciona o ativo à lista
      return acc;
    }, {});

    // Agrupar renda fixa (LCI, LCA, CDB)
    const totaisRendaFixa = filtrarRendaFixa().reduce((acc, aplicacao) => {
      if (['LCI', 'LCA', 'CDB'].includes(aplicacao.tipo)) {
        if (!acc[aplicacao.tipo]) {
          acc[aplicacao.tipo] = {
            valorInvestido: 0,
            valorAtualizado: 0,
            lucro: 0,
            ativos: [], // Lista de ativos que compõem a categoria
          };
        }
        acc[aplicacao.tipo].valorInvestido += aplicacao.valor || 0;
        acc[aplicacao.tipo].valorAtualizado += aplicacao.valor_atualizado || 0;
        acc[aplicacao.tipo].lucro += aplicacao.lucro || 0;
        acc[aplicacao.tipo].ativos.push(aplicacao); // Adiciona o ativo à lista
      }
      return acc;
    }, {});

    // Combinar totais de renda variável e renda fixa
    return { ...totaisRendaVariavel, ...totaisRendaFixa };
  };

  // Exemplo de uso:
  const totaisPorCategoria = calcularTotaisPorCategoria();

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
        <div className="cards-column">
          {/* Coluna 1: Ações, FIIs, CDB */}
          <TotaisCards
            totaisPorCategoria={totaisPorCategoria}
            formatCurrency={formatCurrency}
            categorias={['Ações', 'FIIs', 'CDB']}
            className="superior-cards"
          />
        </div>
        <div className="grafico-container">
          {/* Coluna 2: Gráfico */}
          <Chart dataBarChart={combinarDadosGrafico()} />
        </div>
        <div className="cards-column">
          {/* Coluna 3: LCA, LCI, Totais Gerais */}
          <TotaisCards
            totaisPorCategoria={totaisPorCategoria}
            formatCurrency={formatCurrency}
            categorias={['LCI', 'LCA', 'Totais Gerais']}
            className="superior-cards"
          />
        </div>
      </div>

      {/* Layout Mobile */}
      <div className="mobile-layout">
        <div className="grafico-container">
          <Chart dataBarChart={combinarDadosGrafico()} />
        </div>
        <div className="totais-container">
          <h2>Totais Gerais por Categoria</h2>
          <TotaisCards
            totaisPorCategoria={totaisPorCategoria}
            formatCurrency={formatCurrency}
            categorias={['Ações', 'FIIs', 'CDB', 'LCI', 'LCA', 'Totais Gerais']}
          />
        </div>
      </div>

      {/* Renda Variável */}
      <h2>
        Renda Variável
        <button className="icon-button" onClick={() => setShowFormAcoes(!showFormAcoes)}>
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </h2>
      {showFormAcoes && (
        <Form
          form={form}
          handleChange={(e) => handleChange(e, setForm)}
          handleBlur={handleBlur}
          handleSubmit={(e) => handleSubmit(e, form, setForm, editId, setEditId, fetchCarteira, setCarteira, setShowFormAcoes)}
          editId={editId}
        />
      )}
      <Table
        carteira={carteira}
        filtrarCarteira={filtrarCarteira}
        formatDate={formatDate}
        formatCurrency={formatCurrency}
        handleEdit={(acao) => handleEdit(acao, setForm, setEditId, setShowFormAcoes)}
        handleDelete={(id) => handleDelete(id, fetchCarteira, setCarteira)}
      />

      {/* Renda Fixa */}
      <h2>
        Renda Fixa
        <button className="icon-button" onClick={() => setShowFormRendaFixa(!showFormRendaFixa)}>
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </h2>
      {showFormRendaFixa && (
        <FormRendaFixa
          form={formRendaFixa}
          handleChange={(e) => handleChange(e, setFormRendaFixa)}
          handleSubmit={(e) => handleSubmit(e, formRendaFixa, setFormRendaFixa, editIdRendaFixa, setEditIdRendaFixa, fetchRendaFixa, setRendaFixa, setShowFormRendaFixa)}
          editIdRendaFixa={editIdRendaFixa}
        />
      )}
      <TableRendaFixa
        rendaFixa={rendaFixa}
        formatDate={formatDate}
        formatCurrency={formatCurrency}
        handleEdit={(aplicacao) => handleEdit(aplicacao, setFormRendaFixa, setEditIdRendaFixa, setShowFormRendaFixa)}
        handleDelete={(id) => handleDelete(id, fetchRendaFixa, setRendaFixa)}
        filtro={filtro}
      />
    </div>
  );
}

export default App;
