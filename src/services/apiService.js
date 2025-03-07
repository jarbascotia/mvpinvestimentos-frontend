import axios from 'axios';

// URLs das APIs
const API_URLS = {
  carteira: 'https://mvpinvestimentos-acoes.onrender.com/api', // URL base para a API de carteira
  rendaFixa: 'https://mvpinvestimentos-renda-fixa.onrender.com/api', // URL base para a API de renda fixa
};

// Função para buscar a carteira
export const fetchCarteira = async () => {
  const response = await axios.get(`${API_URLS.carteira}/carteira`);
  return await Promise.all(
    response.data.map(async (acao) => {
      const quoteResponse = await axios.get(`${API_URLS.carteira}/quote/${acao.ticker}`);
      const { shortName, regularMarketPrice } = quoteResponse.data.results[0];
      const valorInvestido = acao.quantidade * acao.valor_compra;
      const valorAtualizado = acao.quantidade * regularMarketPrice;
      const lucro = valorAtualizado - valorInvestido;
      return {
        ...acao,
        nome: shortName,
        cotacao_atual: regularMarketPrice,
        valor_investido: valorInvestido,
        valor_atualizado: valorAtualizado,
        lucro: lucro,
      };
    })
  );
};

// Função para buscar a renda fixa
export const fetchRendaFixa = async () => {
  const response = await axios.get(`${API_URLS.rendaFixa}/renda-fixa`);
  return await Promise.all(
    response.data.map(async (aplicacao) => {
      const valorAtualizadoResponse = await axios.get(
        `${API_URLS.rendaFixa}/renda-fixa/atualizado/${aplicacao.id}`
      );
      const valorAtualizado = valorAtualizadoResponse.data.valor_atualizado;
      const lucro = valorAtualizado - aplicacao.valor;
      return {
        ...aplicacao,
        valor_atualizado: valorAtualizado,
        lucro: lucro,
      };
    })
  );
};

// Função para adicionar/editar um item na carteira
export const saveCarteiraItem = async (item, editId) => {
  const url = editId
    ? `${API_URLS.carteira}/carteira/${editId}`
    : `${API_URLS.carteira}/carteira`;
  const method = editId ? 'put' : 'post';
  const response = await axios[method](url, item);
  return response.data;
};

// Função para adicionar/editar um item na renda fixa
export const saveRendaFixaItem = async (item, editId) => {
  const url = editId
    ? `${API_URLS.rendaFixa}/renda-fixa/${editId}`
    : `${API_URLS.rendaFixa}/renda-fixa`;
  const method = editId ? 'put' : 'post';
  const response = await axios[method](url, item);
  return response.data;
};

// Função para deletar um item da carteira
export const deleteCarteiraItem = async (id) => {
  const response = await axios.delete(`${API_URLS.carteira}/carteira/${id}`);
  return response.data;
};

// Função para deletar um item da renda fixa
export const deleteRendaFixaItem = async (id) => {
  const response = await axios.delete(`${API_URLS.rendaFixa}/renda-fixa/${id}`);
  return response.data;
};
