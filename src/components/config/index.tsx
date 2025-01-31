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
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import useActiveCompanies from "../../hooks/useActiveCompanies.ts";
import EnterpriseService from "../../services/enterprise.service.ts";
import { AlertAdapter } from "../../global.components.tsx";
import ConfigService from "../../services/config.service.ts";
import ModulesService from "../../services/modules.service.ts";
import CreateEnterpriseModal from '../../components/register-enterprise/index.tsx'
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import { AllInOneApi } from "../../Api.ts";

const Config: React.FC<{ activeCompany, userData, modulesUpdating, setModulesUpdating }> = ({ ...props }) => {
  const user = props.userData;
  const [companyInformation, setCompanyInformation] = useState();
  const [availableModules, setAvailableModules] = useState();
  const [activeModules, setActiveModules] = useState();
  const [originalCompanyData, setOriginalCompanyData] = useState(null);
  const [createCompany, setCreateCompany] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();



  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [selectedEstablishment, setSelectedEstablishment] = useState(null);

  const establishmentOptions = [
    t("config.establishmentOptions.restaurant"),
    t("config.establishmentOptions.supermarket"),
    t("config.establishmentOptions.salon"),
    t("config.establishmentOptions.hospital"),
    t("config.establishmentOptions.pharmacy"),
    t("config.establishmentOptions.school"),
    t("config.establishmentOptions.clinic"),
    t("config.establishmentOptions.clothingStore"),
    t("config.establishmentOptions.gym"),
  ];

  // Traduzindo módulos por estabelecimento
  const establishmentModules = {
    [t("config.establishmentOptions.restaurant")]: [
      t("config.establishmentModules.home"),
      t("config.establishmentModules.payments"),
      t("config.establishmentModules.products"),
      t("config.establishmentModules.employees"),
      t("config.establishmentModules.orders"),
      t("config.establishmentModules.customers"),
    ],
    [t("config.establishmentOptions.supermarket")]: [
      t("config.establishmentModules.home"),
      t("config.establishmentModules.payments"),
      t("config.establishmentModules.products"),
      t("config.establishmentModules.employees"),
      t("config.establishmentModules.customers"),
    ],
    [t("config.establishmentOptions.salon")]: [
      t("config.establishmentModules.home"),
      t("config.establishmentModules.payments"),
      t("config.establishmentModules.products"),
      t("config.establishmentModules.employees"),
      t("config.establishmentModules.customers"),
      t("config.establishmentModules.calendar"),
    ],
    [t("config.establishmentOptions.hospital")]: [
      t("config.establishmentModules.home"),
      t("config.establishmentModules.payments"),
      t("config.establishmentModules.products"),
      t("config.establishmentModules.employees"),
      t("config.establishmentModules.customers"),
    ],
    [t("config.establishmentOptions.pharmacy")]: [
      t("config.establishmentModules.home"),
      t("config.establishmentModules.payments"),
      t("config.establishmentModules.products"),
      t("config.establishmentModules.employees"),
      t("config.establishmentModules.customers"),
    ],
    [t("config.establishmentOptions.school")]: [
      t("config.establishmentModules.home"),
      t("config.establishmentModules.payments"),
      t("config.establishmentModules.products"),
      t("config.establishmentModules.employees"),
      t("config.establishmentModules.customers"),
    ],
    [t("config.establishmentOptions.clinic")]: [
      t("config.establishmentModules.home"),
      t("config.establishmentModules.payments"),
      t("config.establishmentModules.products"),
      t("config.establishmentModules.employees"),
      t("config.establishmentModules.customers"),
      t("config.establishmentModules.calendar"),
    ],
    [t("config.establishmentOptions.clothingStore")]: [
      t("config.establishmentModules.home"),
      t("config.establishmentModules.payments"),
      t("config.establishmentModules.products"),
      t("config.establishmentModules.employees"),
      t("config.establishmentModules.customers"),
    ],
    [t("config.establishmentOptions.gym")]: [
      t("config.establishmentModules.home"),
      t("config.establishmentModules.payments"),
      t("config.establishmentModules.employees"),
      t("config.establishmentModules.customers"),
      t("config.establishmentModules.calendar"),
    ],
  };


  const [companyData, setCompanyData] = useState({
    companyName: "",
    logo: null,
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
    if (!newValue) {
      setSelectedEstablishment(null);
      setActiveModules([]);
      return;
    }

    const translatedValue = establishmentOptions.find(
      (option) => option === newValue
    );
    setSelectedEstablishment(translatedValue);

    if (translatedValue) {
      const selectedModules = establishmentModules[translatedValue] || [];
      const filteredModules = availableModules
        .filter((module) => selectedModules.includes(t(`config.establishmentModules.${module.key}`)))
        .map((module) => ({
          ...module,
          isActive: true,
        }));
      setActiveModules(filteredModules);
    }
  };


  const handleCompanyImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCompanyData((prev) => ({
        ...prev,
        logo: file,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      let imageUrl = '';
      formData.append("id", companyInformation?.id);
      formData.append("name", companyData.name || companyInformation?.name);
      formData.append("email", companyData.email || companyInformation?.email);
      formData.append("phone", companyData.phone || companyInformation?.phone);
      formData.append("document", companyData.document || companyInformation?.document);

      if (companyData.logo instanceof File) {
        const formDataFile = new FormData();
        formDataFile.append('path', 'logos');
        formDataFile.append('file', companyData.logo);
        const response = await AllInOneApi.post('shared/image', formDataFile, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'accept': '*/*',
          },
        });
        imageUrl = response.data.url;
      }
      formData.append("logo", imageUrl || companyData?.logo);
      await EnterpriseService.update(formData);
      props.setModulesUpdating(!props.modulesUpdating);
      enqueueSnackbar(t("config.form.companyUpdatedSuccess"), { variant: "success" });
    } catch (error) {
      enqueueSnackbar(t("config.form.companyUpdateError"), { variant: "error" });
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
          logo: res.data.logo || "",
          modules: res.data.modules || { finance: false, sales: false, inventory: false },
        };

        setCompanyData(initialData);
        setOriginalCompanyData(initialData);
      });
    }
  }, [props.activeCompany]);

  useEffect(() => {
    if (activeModules?.length > 0 && availableModules?.length > 0) {
      const initialModulesState = {};

      availableModules?.forEach((module) => {
        const isActive = activeModules?.some((activeModule) => {
          if(module && activeModule){
            return activeModule?.name === module.name;
          }
        });
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
        <Typography
          sx={{
            fontSize: '24pt',
            marginLeft: '30px',
            marginTop: { xs: '55px', md: '35px', lg: '25px' },
          }}
        >
        {t(`config.title`)}
      </Typography>
      <Box sx={{ padding: 4, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
        <Card
            sx={{
              width: { xs: 300, md: 620, lg: 602 },
              minWidth:300,
              flex: 1,
              padding: 2,
              height: 'auto',
            }}
          >
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ marginBottom: '25px' }}>
                <Avatar src={companyData.companyImage} sx={{ width: 80, height: 80 }} />
                <Button variant="outlined" component="label">
                  {t("config.form.changePhoto")}
                  <input hidden accept="image/*" type="file" onChange={handleCompanyImageChange} />
                </Button>
              </Stack>
              <Stack spacing={3}>
              <TextField
                label={t("config.form.name")}
                name="userName"
                value={props.userData.name}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />

              <TextField
                label={t("config.form.email")}
                name="userEmail"
                type="email"
                value={props.userData.email}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />

              <Divider />

              <TextField
                label={t("config.form.phone")}
                name="phone"
                type="text"
                value={props.userData.cellphone}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />

              <TextField
                label={t("config.form.document")}
                name="document"
                type="text"
                value={props.userData.document}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
              <p style={{textAlign:'center', color:'rgba(0,0,0,0.45)'}}>{t('support')}</p>
              </Stack>
            </form>
          </CardContent>
        </Card>

        {/* Card da Empresa */}
        <Card sx={{ maxWidth: 600, flex: 2, minWidth: 300, padding: 2, height: 'auto' }}>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Stack direction={{ xs: 'column-reverse', md: 'row' }} spacing={4} alignItems="flex-start">
                {/* Informações da Empresa */}
                <Stack spacing={3} flex={1} sx={{width:'100%'}}>
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ marginBottom: '25px' }}>
                    <Avatar src={companyData.previewLogo || companyData.logo || ''} sx={{ width: 80, height: 80 }} />
                    <Button variant="outlined" component="label">
                      {t("config.form.changePhoto")}
                      <input
                        hidden
                        accept="image/*"
                        type="file"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const previewUrl = URL.createObjectURL(file);
                            setCompanyData((prev) => ({
                              ...prev,
                              logo: file,
                              previewLogo: previewUrl,
                            }));
                          }
                        }}
                      />
                    </Button>
                  </Stack>
                  <TextField
                    label={t("config.form.companyName")}
                    name="name"
                    value={companyData?.name}
                    onChange={handleCompanyChange}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    label="Email"
                    name="email"
                    value={companyData.email}
                    onChange={handleCompanyChange}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    label="Celular"
                    name="phone"
                    value={companyData.phone}
                    onChange={handleCompanyChange}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    label={t("config.form.document")}
                    name="document"
                    value={companyData.document}
                    onChange={handleCompanyChange}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                  <Box mt={3}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{
                          '&:hover': {
                            backgroundColor: 'white',
                            color: 'rgb(25, 118, 210)',
                            border: '1px rgb(25, 118, 210) solid',
                          },
                        }}
                      >
                        {t("config.form.save")}
                      </Button>
                      <Button
                        variant="contained"
                        fullWidth
                        sx={{
                          '&:hover': {
                            backgroundColor: 'white',
                            color: 'rgb(25, 118, 210)',
                            border: '1px rgb(25, 118, 210) solid',
                          },
                        }}
                        onClick={() => {
                          if (originalCompanyData) {
                            setCompanyData(originalCompanyData);
                            setSelectedEstablishment(null);
                            enqueueSnackbar(t('notification.canceled-modules'), { variant: 'info' });
                          }
                        }}
                      >
                        {t("config.form.cancel")}
                      </Button>
                    </Box>
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{
                        backgroundColor: 'white',
                        marginTop: '15px',
                        color: 'rgb(25, 118, 210)',
                        border: '1px rgb(25, 118, 210) solid',
                        '&:hover': {
                          backgroundColor: 'rgb(25, 118, 210)',
                          color: 'white',
                        },
                      }}
                    >
                      {t("config.form.disableCompany")}
                    </Button>
                  </Box>
                </Stack>

                <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' } }} />

                {/* Módulos Ativos */}
                <Stack spacing={2} flex={1}  sx={{width:'100%'}}>
                  <Typography variant="h6">{t("config.form.activeModules")}</Typography>
                  <Autocomplete
                    options={establishmentOptions}
                    value={selectedEstablishment}
                    onChange={handleEstablishmentChange}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={t("config.form.establishment.label")}
                        placeholder={t("config.form.establishment.placeholder")}
                        variant="outlined"
                      />
                    )}
                    sx={{ mt: 2 }}
                  />
                  <Box
                    sx={{
                      maxHeight: 1000,
                      height: '290px',
                      overflowY: 'auto',
                      paddingRight: 2,
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    {availableModules?.map((module) => {
                      const isActive = activeModules?.some((activeModule) => activeModule?.name === module ? module?.name : '');
                      const isChecked =  companyData.modules[module.key] ?? isActive ?? false;
                      const translatedModuleName = t(`config.establishmentModules.${module.key}`, module.name);
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
                          label={translatedModuleName}
                        />
                      );
                    })}
                  </Box>
                  <Box mt={3} sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      sx={{
                        '&:hover': {
                          backgroundColor: 'white',
                          color: 'rgb(25, 118, 210)',
                          border: '1px rgb(25, 118, 210) solid',
                        },
                      }}
                      onClick={() => {
                        const modulesPayload = availableModules?.map((module) => ({
                          id: module.id,
                          key: module.key,
                          name: module.name,
                          isActive: companyData.modules[module.key] ?? false,
                          companyId: props.activeCompany,
                        }));
                        ModulesService.patch(modulesPayload)
                          .then(() => {
                            enqueueSnackbar(t('notification.updated-modules'), { variant: 'success' });
                            props.setModulesUpdating(!props.modulesUpdating);
                          })
                          .catch((error) => {
                            console.error("Erro ao atualizar os módulos:", error);
                            enqueueSnackbar(t('notification.error-modules'), { variant: 'error' });
                          });
                      }}
                    >
                      {t("config.form.save")}
                    </Button>
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{
                        '&:hover': {
                          backgroundColor: 'white',
                          color: 'rgb(25, 118, 210)',
                          border: '1px rgb(25, 118, 210) solid',
                        },
                      }}
                      onClick={() => {
                        if (originalCompanyData) {
                          setCompanyData(originalCompanyData);
                          setSelectedEstablishment(null);
                          enqueueSnackbar(t('notification.canceled-modules'), { variant: 'info' });
                        }
                      }}
                    >
                      {t("config.form.cancel")}
                    </Button>
                  </Box>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      backgroundColor: 'white',
                      color: 'rgb(25, 118, 210)',
                      border: '1px rgb(25, 118, 210) solid',
                      '&:hover': {
                        backgroundColor: 'rgb(25, 118, 210)',
                        color: 'white',
                      },
                    }}
                    onClick={() => enqueueSnackbar('New companies are eligible for the Plus plan.', { variant: 'info' })}
                  >
                    {t("config.form.newCompany")}
                  </Button>
                </Stack>
              </Stack>
            </form>
          </CardContent>
        </Card>
        <CreateEnterpriseModal userData={user} isOpen={createCompany} onClose={()=>{setCreateCompany(false)}}/>
      </Box>
    </>
  );
};

export default Config;
