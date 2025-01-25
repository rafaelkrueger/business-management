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

const Config: React.FC<{ activeCompany, userData }> = ({ ...props }) => {
  const user = props.userData;
  const [companyInformation, setCompanyInformation] = useState();
  const [availableModules, setAvailableModules] = useState();
  const [activeModules, setActiveModules] = useState();

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
      console.log(res.data)
    })
    if (props.activeCompany) {
      EnterpriseService.get(props.activeCompany).then((res) => {
        setCompanyInformation(res.data);

        setCompanyData({
          name: res.data.name || "",
          email: res.data.email || "",
          phone: res.data.phone || "",
          document: res.data.document || "",
          modules: res.data.modules || { finance: false, sales: false, inventory: false },
        });
      });
    }
  }, [props.activeCompany]);

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
                />

                {/* E-mail */}
                <TextField
                  label="E-mail"
                  name="userEmail"
                  type="email"
                  value={user.email}
                  onChange={handleChange}
                  fullWidth
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
                  onChange={(event, newValue) => setSelectedEstablishment(newValue)}
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
                    display:'flex',
                    flexDirection:'column'
                  }}
                >
                  {availableModules?.map((module) => {
                    // Se o módulo estiver em activeModules, ele será marcado
                    const isActive = activeModules?.some((activeModule) => activeModule.name === module.name);
                    const isChecked = companyData.modules[module.key] !== undefined
                      ? companyData.modules[module.key]
                      : isActive;

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
                <Box mt={3}>
                <Button type="submit" variant="contained" color="primary" fullWidth>
                  Salvar Módulos
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
