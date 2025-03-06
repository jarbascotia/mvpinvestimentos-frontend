import React from 'react';

const FormRendaFixa = ({ form, handleChange, handleSubmit, editIdRendaFixa }) => (
  <form onSubmit={(e) => {
    e.preventDefault();
    console.log('Form data:', form);
    handleSubmit(e);
  }} className="form-container">
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
        type="number"
        id="valor"
        name="valor"
        placeholder="Valor"
        value={form.valor}
        onChange={handleChange}
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
    <button type="submit" className="botao">{editIdRendaFixa ? 'Atualizar' : 'Adicionar'}</button>
  </form>
);

export default FormRendaFixa;