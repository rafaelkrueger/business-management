import React, { useEffect, useState } from 'react';
import ReactModal from 'react-modal';
import EnterpriseService from '../../services/enterprise.service.ts'

ReactModal.setAppElement('#root');

const CreateEnterpriseModal = ({ userData, isOpen, onClose }) => {

  const [enterprise, setEnterprise] = useState({
    userId: userData._id,
    logo: '',
    name: '',
    email: '',
    phone: '',
    document: '',
    active: false,
  });
  const [logoPreview, setLogoPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEnterprise({ ...enterprise, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEnterprise({ ...enterprise, logo: file });
      const reader = new FileReader();
      reader.onload = () => setLogoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setEnterprise({ ...enterprise, [name]: checked });
  };

  const handleSubmit = () => {
    EnterpriseService.post(enterprise)
        .then((res) => onClose())
        .catch((err) => console.log(err))
    }

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Criar Nova Compania"
      style={{
        overlay: {
          zIndex:'100',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
        content: {
          maxWidth: '500px',
          margin: 'auto',
          borderRadius: '10px',
          padding: '20px',
        },
      }}
    >
      <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>Criar Nova Companhia</h2>
    {logoPreview && (
    <div style={{ marginTop: '10px', textAlign: 'center', }}>
        <img
        src={logoPreview}
        alt="Preview da Logo"
        style={{
            maxWidth: '100%',
            maxHeight: '150px',
            border: '1px solid #ccc',
            width:'40%'
        }}
        />
    </div>
    )}
      <form style={{ display: 'grid', gap: '15px' }}>
        {/* Logo */}
        <div>
          <label htmlFor="logo" style={{ fontWeight: 'bold' }}>Logo</label>
          <input
            type="file"
            id="logo"
            name="logo"
            accept="image/*"
            onChange={handleFileChange}
            style={{
              width: '100%',
              marginTop: '5px',
            }}
          />
        </div>

        {/* Nome */}
        <div>
          <label htmlFor="name" style={{ fontWeight: 'bold' }}>Nome</label>
          <input
            type="text"
            id="name"
            name="name"
            value={enterprise.name}
            onChange={handleChange}
            placeholder="Nome da empresa"
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '5px',
              marginTop: '5px',
            }}
          />
        </div>

        <div>
          <label htmlFor="email" style={{ fontWeight: 'bold' }}>Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={enterprise.email}
            onChange={handleChange}
            placeholder="Email da empresa"
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '5px',
              marginTop: '5px',
            }}
          />
        </div>

        <div>
          <label htmlFor="phone" style={{ fontWeight: 'bold' }}>Telefone</label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={enterprise.phone}
            onChange={handleChange}
            placeholder="Telefone de contato"
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '5px',
              marginTop: '5px',
            }}
          />
        </div>

        <div>
          <label htmlFor="document" style={{ fontWeight: 'bold' }}>Documento</label>
          <input
            type="text"
            id="document"
            name="document"
            value={enterprise.document}
            onChange={handleChange}
            placeholder="Documento (opcional)"
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '5px',
              marginTop: '5px',
            }}
          />
        </div>

        {/* Ativo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label htmlFor="active" style={{ fontWeight: 'bold', marginBottom: '0' }}>Ativo</label>
          <input
            type="checkbox"
            id="active"
            name="active"
            checked={enterprise.active}
            onChange={handleCheckboxChange}
          />
        </div>

        {/* Botões */}
        <div style={{ display: 'flex', flexDirection:'column', textAlign:'center', marginTop: '10px' }}>
          <button
            type="button"
            onClick={handleSubmit}
            style={{
              backgroundColor: '#4caf50',
              color: '#fff',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Criar
          </button>
          <p style={{fontSize:'9pt', color:'grey'}}>Para começar sua jornada, por favor crie sua primeira empresa para gerenciar</p>
        </div>
      </form>
    </ReactModal>
  );
};

export default CreateEnterpriseModal;
