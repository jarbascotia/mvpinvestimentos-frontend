export function formatCurrency(value) {
  if (value === null || value === undefined) {
    return ''; // ou qualquer valor padrão que você queira retornar
  }
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function formatDate(dateString) {
  const date = new Date(dateString);
  const utcDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  return utcDate.toLocaleDateString('pt-BR', options);
}