import React from 'react';

const Form = ({ form, handleChange, handleBlur, handleSubmit, editId }) => (
  <form onSubmit={handleSubmit} className="form-container">
    <div>
      <label htmlFor="ticker">Ticker:</label>
      <input
        type="text"
        id="ticker"
        name="ticker"
        placeholder="Ticker"
        value={form.ticker}
        onChange={handleChange}
        required
        className="input-field"
      />
    </div>
    <div>
      <label htmlFor="data_compra">Data de Compra:</label>
      <input
        type="date"
        id="data_compra"
        name="data_compra"
        placeholder="Data de Compra"
        value={form.data_compra}
        onChange={handleChange}
        required
        className="input-field"
      />
    </div>
    <div>
      <label htmlFor="valor_compra">Valor de Compra:</label>
      <input
        type="text"
        id="valor_compra"
        name="valor_compra"
        placeholder="Valor de Compra"
        value={form.valor_compra}
        onChange={handleChange}
        onBlur={handleBlur}
        required
        className="input-field"
        autoComplete="off" // Desativa o autocompletar
      />
    </div>
    <div>
      <label htmlFor="quantidade">Quantidade:</label>
      <input
        type="number"
        id="quantidade"
        name="quantidade"
        placeholder="Quantidade"
        value={form.quantidade}
        onChange={handleChange}
        required
        className="input-field"
      />
    </div>
    <button type="submit" className="botao">{editId ? 'Atualizar' : 'Adicionar'}</button>
  </form>
);

export default Form;