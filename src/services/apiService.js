import axios from 'axios';

export const fetchCarteira = async () => {
  const response = await axios.get('http://localhost:3001/api/carteira');
  return await Promise.all(response.data.map(async (acao) => {
    const quoteResponse = await axios.get(`http://localhost:3001/api/quote/${acao.ticker}`);
    const { shortName, regularMarketPrice } = quoteResponse.data.results[0];
    const valorInvestido = acao.quantidade * acao.valor_compra;
    const valorAtualizado = acao.quantidade * regularMarketPrice;
    const lucro = valorAtualizado - valorInvestido;
    return { ...acao, nome: shortName, cotacao_atual: regularMarketPrice, valor_investido: valorInvestido, valor_atualizado: valorAtualizado, lucro: lucro };
  }));
};

export const fetchRendaFixa = async () => {
  const response = await axios.get('http://localhost:3002/api/renda-fixa');
  return await Promise.all(response.data.map(async (aplicacao) => {
    const valorAtualizadoResponse = await axios.get(`http://localhost:3002/api/renda-fixa/atualizado/${aplicacao.id}`);
    const valorAtualizado = valorAtualizadoResponse.data.valor_atualizado;
    const lucro = valorAtualizado - aplicacao.valor;
    return { ...aplicacao, valor_atualizado: valorAtualizado, lucro: lucro };
  }));
};