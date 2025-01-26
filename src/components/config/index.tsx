import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  Avatar,
  Grid,
  Stack,
  Divider,
  Checkbox,
  FormControlLabel,
  Autocomplete,
} from "@mui/material";
import useActiveCompanies from "../../hooks/useActiveCompanies.ts";
import EnterpriseService from "../../services/enterprise.service.ts";
import { AlertAdapter } from "../../global.components.tsx";
import ConfigService from "../../services/config.service.ts";
import ModulesService from "../../services/modules.service.ts";

const Config: React.FC<{ activeCompany, userData, modulesUpdating, setModulesUpdating }> = ({ ...props }) => {
  const user = props.userData;
  const [companyInformation, setCompanyInformation] = useState();
  const [availableModules, setAvailableModules] = useState();
  const [activeModules, setActiveModules] = useState();
  const [originalCompanyData, setOriginalCompanyData] = useState(null);


  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [selectedEstablishment, setSelectedEstablishment] = useState(null);

  const establishmentOptions = [
    "Restaurante",
    "Supermercado",
    "Salão",
    "Hospital",
    "Farmácia",
    "Escola",
    "Clínica",
    "Loja de Roupas",
    "Academia",
  ];

  const establishmentModules = {
    Restaurante: ["Home", "Pagamentos", "Produtos", "Funcionários", "Comandas", "Clientes"],
    Supermercado: ["Home", "Pagamentos", "Produtos", "Funcionários", "Clientes"],
    Salão: ["Home", "Pagamentos", "Produtos", "Funcionários", "Clientes", "Calendário"],
    Hospital: ["Home", "Pagamentos", "Produtos", "Funcionários", "Clientes"],
    Farmácia: ["Home", "Pagamentos", "Produtos", "Funcionários", "Clientes"],
    Escola: ["Home", "Pagamentos", "Produtos", "Funcionários", "Clientes"],
    Clínica: ["Home", "Pagamentos", "Produtos", "Funcionários", "Clientes", "Calendário"],
    "Loja de Roupas": ["Home", "Pagamentos", "Produtos", "Funcionários", "Clientes"],
    Academia: ["Home", "Pagamentos", "Funcionários", "Clientes", "Calendário"],
  };


  const [companyData, setCompanyData] = useState({
    companyName: "",
    companyImage: null,
    document: "",
    modules: {
      finance: false,
      sales: false,
      inventory: false,
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCompanyChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setCompanyData({
        ...companyData,
        modules: { ...companyData.modules, [name]: checked },
      });
    } else {
      setCompanyData({ ...companyData, [name]: value });
    }
  };

  const handleEstablishmentChange = (event, newValue) => {
    setSelectedEstablishment(newValue);

    if (newValue) {
      const selectedModules = establishmentModules[newValue] || [];

      // Garante que `prev.modules` exista e contenha os módulos disponíveis
      setCompanyData((prev) => ({
        ...prev,
        modules: {
          ...availableModules?.reduce(
            (acc, module) => ({
              ...acc,
              [module.key]: false, // Reseta todos os módulos como `false`
            }),
            {}
          ),
          ...Object.fromEntries(selectedModules.map((key) => [key, true])), // Ativa os módulos do estabelecimento selecionado
        },
      }));
    }
  };



  const handleCompanyImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCompanyData({ ...companyData, companyImage: URL.createObjectURL(file) });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedData = {
      id: companyInformation?.id,
      name: companyData.name || companyInformation?.name,
      email: companyData.email || companyInformation?.email,
      phone: companyData.phone || companyInformation?.phone,
      document: companyData.document || companyInformation?.document,
    };

    try {
      await EnterpriseService.update(updatedData);
      AlertAdapter('Informações da empresa foram atualizadas com sucesso!', 'success')
    } catch (error) {
      AlertAdapter('Erro ao atualizar!', 'error')
    }
  };

  useEffect(() => {
    ConfigService.getActiveModules().then((res)=>{
      setAvailableModules(res.data);
    })
    ModulesService.get(props.activeCompany).then((res)=>{
      setActiveModules(res.data)
    })
    if (props.activeCompany) {
      EnterpriseService.get(props.activeCompany).then((res) => {
        setCompanyInformation(res.data);

        const initialData = {
          name: res.data.name || "",
          email: res.data.email || "",
          phone: res.data.phone || "",
          document: res.data.document || "",
          modules: res.data.modules || { finance: false, sales: false, inventory: false },
        };

        setCompanyData(initialData);
        setOriginalCompanyData(initialData); // Salva os dados originais
      });
    }
  }, [props.activeCompany]);

  useEffect(() => {
    if (activeModules?.length > 0 && availableModules?.length > 0) {
      const initialModulesState = {};
      availableModules?.forEach((module) => {
        const isActive = activeModules?.some((activeModule) => activeModule.name === module.name);
        initialModulesState[module.key] = isActive;
      });

      setCompanyData((prev) => ({
        ...prev,
        modules: initialModulesState,
      }));
    }
  }, [activeModules, availableModules]);

  return (
    <>
    <Typography sx={{fontSize:'24pt', marginLeft:'30px', marginTop:'50px'}}>Configurações Gerais</Typography>
      <Box sx={{ padding: 4, display:'flex', width:'120%' }}>
        <Card sx={{ maxWidth: 600, margin: "0 auto", padding: 2, marginBottom: 4, width:'400px', marginLeft:'0%', height:'550px' }}>
          <CardContent>
            <form onSubmit={handleSubmit}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{marginBottom:'25px'}}>
                    <Avatar
                      src={companyData.companyImage}
                      sx={{ width: 80, height: 80 }}
                    />
                    <Button
                      variant="outlined"
                      component="label"
                    >
                      Alterar Foto
                      <input
                        hidden
                        accept="image/*"
                        type="file"
                        onChange={handleCompanyImageChange}
                      />
                    </Button>
                  </Stack>
              <Stack spacing={3}>
                {/* Nome */}
                <TextField
                  label="Nome"
                  name="userName"
                  value={user.name}
                  onChange={handleChange}
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                />

                {/* E-mail */}
                <TextField
                  label="E-mail"
                  name="userEmail"
                  type="email"
                  value={user.email}
                  onChange={handleChange}
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                />

                <Divider />
              </Stack>
            </form>
          </CardContent>
        </Card>


        <Card sx={{ maxWidth: 600, margin: "0 auto", padding: 2, width:'700px', marginLeft:'-120px', height:'552px' }}>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Stack direction="row" spacing={4} alignItems="flex-start">
                {/* Foto e Nome da Empresa */}
                <Stack spacing={3} flex={1}>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ marginBottom: "25px" }}>
                <Avatar src={companyData.companyImage} sx={{ width: 80, height: 80 }} />
                <Button variant="outlined" component="label">
                  Alterar Foto
                  <input hidden accept="image/*" type="file" onChange={handleCompanyImageChange} />
                </Button>
              </Stack>
              <Stack spacing={3}>
                <TextField
                  label="Nome da Empresa"
                  name="name"
                  value={companyData.name}
                  onChange={handleCompanyChange}
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <TextField
                  label="Email"
                  name="email"
                  value={companyData.email}
                  onChange={handleCompanyChange}
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <TextField
                  label="Celular"
                  name="phone"
                  value={companyData.phone}
                  onChange={handleCompanyChange}
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <TextField
                  label="Documento"
                  name="document"
                  value={companyData.document}
                  onChange={handleCompanyChange}
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Stack>
              <Box mt={3}>
                <Button type="submit" variant="contained" color="primary" fullWidth>
                  Salvar
                </Button>
              </Box>

                </Stack>

                <Divider orientation="vertical" flexItem />

                {/* Gerenciamento de Módulos */}
                <Stack spacing={2} flex={1}>
                <Typography variant="h6">Módulos Ativos</Typography>

                <Autocomplete
                options={establishmentOptions}
                value={selectedEstablishment}
                onChange={handleEstablishmentChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Estabelecimento"
                    placeholder="Digite para pesquisar..."
                    variant="outlined"
                  />
                )}
                sx={{ mt: 2 }}
              />


                <Box
                  sx={{
                    maxHeight: 1000,
                    height: "290px",
                    overflowY: "auto",
                    paddingRight: 2,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {availableModules?.map((module) => {
                    // Define o estado inicial da checkbox com base nos módulos ativos
                    const isActive = activeModules?.some((activeModule) => activeModule.name === module.name);
                    const isChecked = companyData.modules[module.key] ?? isActive ?? false;

                    return (
                      <FormControlLabel
                        key={module.id}
                        control={
                          <Checkbox
                            checked={isChecked}
                            onChange={(e) => handleCompanyChange(e, module.key)}
                            name={module.key}
                          />
                        }
                        label={module.name}
                      />
                    );
                  })}
                </Box>

                <Box mt={3} sx={{display:'flex', justifyContent:'space-between'}}>
                <Button
                  sx={{marginRight:'4px'}}
                    onClick={() => {
                      // Prepara os dados para o PATCH
                      const modulesPayload = availableModules?.map((module) => ({
                        id: module.id,
                        key: module.key,
                        name: module.name,
                        isActive: companyData.modules[module.key] ?? false,
                        companyId: props.activeCompany
                      }));

                      // Envia os dados para o endpoint
                      ModulesService.patch(modulesPayload)
                        .then(() => {
                          AlertAdapter("Módulos atualizados com sucesso!", "success");
                          props.setModulesUpdating(!props.modulesUpdating);
                        })
                        .catch((error) => {
                          console.error("Erro ao atualizar os módulos:", error);
                          AlertAdapter("Erro ao atualizar os módulos!", "error");
                        });
                    }}
                    variant="contained"
                    color="primary"
                    fullWidth
                  >
                    Salvar
                  </Button>
                  <Button
                  sx={{
                    marginLeft: '4px',
                    backgroundColor: 'gray',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'darkgray',
                    },
                  }}
                  onClick={() => {
                    if (originalCompanyData) {
                      setCompanyData(originalCompanyData); // Restaura os dados salvos
                      setSelectedEstablishment(null); // Limpa a seleção de estabelecimento
                      AlertAdapter("Alterações canceladas.", "info");
                    }
                  }}
                  variant="contained"
                  fullWidth
                >
                  Cancelar
                </Button>
                </Box>
              </Stack>

              </Stack>
            </form>
          </CardContent>
        </Card>
      </Box>
    </>
  );
};

export default Config;
