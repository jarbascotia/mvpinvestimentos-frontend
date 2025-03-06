export const handleChange = (e, form, setForm) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };
  
  export const handleChangeRendaFixa = (e, formRendaFixa, setFormRendaFixa) => {
    const { name, value } = e.target;
    setFormRendaFixa({ ...formRendaFixa, [name]: value });
  };
  
  export const handleBlur = (e, form, setForm) => {
    // Implementação da função handleBlur
  };
  
  export const handleSubmit = (e, form, setForm, editId, setEditId, fetchCarteira, setCarteira) => {
    e.preventDefault();
    // Implementação da função handleSubmit
  };
  
  export const handleSubmitRendaFixa = (e, formRendaFixa, setFormRendaFixa, editIdRendaFixa, setEditIdRendaFixa, fetchRendaFixa, setRendaFixa) => {
    e.preventDefault();
    // Implementação da função handleSubmitRendaFixa
  };
  
  export const handleEdit = (acao, setForm, setEditId) => {
    setForm(acao);
    setEditId(acao.id);
  };
  
  export const handleEditRendaFixa = (aplicacao, setFormRendaFixa, setEditIdRendaFixa, setShowFormRendaFixa) => {
    setFormRendaFixa(aplicacao);
    setEditIdRendaFixa(aplicacao.id);
    setShowFormRendaFixa(true);
  };
  
  export const handleDelete = (id, fetchCarteira, setCarteira) => {
    // Implementação da função handleDelete
  };
  
  export const handleDeleteRendaFixa = (id, fetchRendaFixa, setRendaFixa) => {
    // Implementação da função handleDeleteRendaFixa
  };