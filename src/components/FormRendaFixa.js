import React, { useState } from 'react';

const FormRendaFixa = ({ handleSubmit, editIdRendaFixa }) => {
  // Estado para armazenar os valores do formulário
  const [form, setForm] = useState({
    tipo: '',
    data_aquisicao: '',
    percentual_cdi: '',
    instituicao: '',
    valor: '',
    data_vencimento: '',
  });

  // Função para atualizar o estado do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  // Função para formatar o campo "valor" como moeda
  const handleBlur = (e) => {
    const { name, value } = e.target;

    if (name === 'valor') {
      // Remove caracteres não numéricos e substitui vírgula por ponto
      const cleanedValue = value.replace(/[^0-9,]/g, '').replace(',', '.');
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

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        console.log('Form data:', form);
        handleSubmit(form); // Passa os dados do formulário para a função handleSubmit
      }}
      className="form-container"
    >
      <div>
        <label htmlFor="tipo">Tipo:</label>
        <select
          id="tipo"
          name="tipo"
          value={form.tipo}
          onChange={handleChange}
          required
          className="input-field"
        >
          <option value="">Selecione</option>
          <option value="LCI">LCI</option>
          <option value="LCA">LCA</option>
          <option value="CDB">CDB</option>
        </select>
      </div>
      <div>
        <label htmlFor="data_aquisicao">Data de Aquisição:</label>
        <input
          type="date"
          id="data_aquisicao"
          name="data_aquisicao"
          value={form.data_aquisicao}
          onChange={handleChange}
          required
          className="input-field"
        />
      </div>
      <div>
        <label htmlFor="percentual_cdi">% do CDI:</label>
        <input
          type="text"
          id="percentual_cdi"
          name="percentual_cdi"
          placeholder="% do CDI"
          value={form.percentual_cdi}
          onChange={handleChange}
          required
          className="input-field"
        />
      </div>
      <div>
        <label htmlFor="instituicao">Instituição:</label>
        <input
          type="text"
          id="instituicao"
          name="instituicao"
          placeholder="Instituição"
          value={form.instituicao}
          onChange={handleChange}
          required
          className="input-field"
        />
      </div>
      <div>
        <label htmlFor="valor">Valor:</label>
        <input
          type="text"
          id="valor"
          name="valor"
          placeholder="Valor"
          value={form.valor}
          onChange={handleChange}
          onBlur={handleBlur}
          required
          className="input-field"
        />
      </div>
      <div>
        <label htmlFor="data_vencimento">Data de Vencimento:</label>
        <input
          type="date"
          id="data_vencimento"
          name="data_vencimento"
          value={form.data_vencimento}
          onChange={handleChange}
          required
          className="input-field"
        />
      </div>
      <button type="submit" className="botao">
        {editIdRendaFixa ? 'Atualizar' : 'Adicionar'}
      </button>
    </form>
  );
};

export default FormRendaFixa;