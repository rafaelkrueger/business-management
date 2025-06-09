import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  Avatar,
  Stack,
  Checkbox,
  FormControlLabel,
  Autocomplete,
  useTheme,
  BottomNavigation,
  BottomNavigationAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  styled,
  alpha,
  Select,
  MenuItem,
  ToggleButton,
  ToggleButtonGroup
} from "@mui/material";
import {
  User,
  Building,
  MessageSquare,
  Save,
  X,
  Upload
} from "lucide-react";
import EnterpriseService from "../../../services/enterprise.service.ts";
import ConfigService from "../../../services/config.service.ts";
import ModulesService from "../../../services/modules.service.ts";
import CreateEnterpriseModal from "../../../components/register-enterprise/index.tsx";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";
import { AllInOneApi } from "../../../Api.ts";

const GlassCard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(135deg, ${alpha('#578acd', 0.15)} 0%, ${alpha('#fff', 0.2)} 100%)`,
  backdropFilter: 'blur(12px)',
  borderRadius: '16px',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
  marginBottom: theme.spacing(2),
}));

const MobileConfig: React.FC<{
  activeCompany: string;
  userData: any;
  modulesUpdating: boolean;
  setModulesUpdating: (b: boolean) => void;
  companies: any[];
  setActiveCompany: (id: string) => void;
}> = ({ activeCompany, userData, modulesUpdating, setModulesUpdating, companies = [], setActiveCompany }) => {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const [navValue, setNavValue] = useState<'profile'|'company'|'feedback'>('company');

  const [companyInformation, setCompanyInformation] = useState<any>(null);
  const [availableModules, setAvailableModules] = useState<any[]>([]);
  const [activeModules, setActiveModules] = useState<any[]>([]);
  const [originalCompanyData, setOriginalCompanyData] = useState<any>(null);
  const [createCompany, setCreateCompany] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedEstablishment, setSelectedEstablishment] = useState<string | null>(null);

  const [companyData, setCompanyData] = useState<any>({
    name: "",
    email: "",
    phone: "",
    document: "",
    logo: null,
    previewLogo: "",
    modules: {}
  });
  const [feedbackMessage, setFeedbackMessage] = useState("");

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

  useEffect(()=>{
    console.log(userData)
  },[userData])

  useEffect(() => {
    ConfigService.getActiveModules().then((res) => {
      setAvailableModules(res.data);
    });
    ModulesService.get(activeCompany).then((res) => {
      setActiveModules(res.data);
    });
    if (activeCompany) {
      EnterpriseService.get(activeCompany).then((res) => {
        setCompanyInformation(res.data);

        const initialData = {
          name: res.data.name || "",
          email: res.data.email || "",
          phone: res.data.phone || "",
          document: res.data.document || "",
          logo: res.data.logo || "",
          modules: res.data.modules || {
            finance: false,
            sales: false,
            inventory: false,
          },
        };

        setCompanyData(initialData);
        setOriginalCompanyData(initialData);
      });
    }
  }, [activeCompany]);

  useEffect(() => {
    if (activeModules?.length > 0 && availableModules?.length > 0) {
      const initialModulesState = {};

      availableModules.forEach((module) => {
        const isActive = activeModules?.some((activeModule) => {
          if (module && activeModule) {
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

  // Handlers
  const handleCompanyChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setCompanyData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      modules: type === 'checkbox' ? { ...prev.modules, [name]: checked } : prev.modules
    }));
  };
  const handleCompanyImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCompanyData(prev => ({
        ...prev,
        logo: file,
        previewLogo: URL.createObjectURL(file)
      }));
    }
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    AllInOneApi.post('/user/contact', {
      name: userData.name,
      email: userData.email,
      message: feedbackMessage,
      createdAt: Date.now(),
    }).then(() => {
      enqueueSnackbar(t("feedback.feedbackSentSuccess"), { variant: 'success' });
      setFeedbackMessage("");
    }).catch(() => {
      enqueueSnackbar(t("feedback.feedbackSentError"), { variant: 'error' });
    });
  };
  const saveModules = () => {
    const payload = availableModules.map(mod => ({
      id: mod.id,
      key: mod.key,
      isActive: companyData.modules[mod.key] || false,
      companyId: activeCompany
    }));
    ModulesService.patch(payload)
      .then(() => { enqueueSnackbar(t("notification.updated-modules"), { variant: 'success' }); setModulesUpdating(prev => !prev); })
      .catch(() => enqueueSnackbar(t("notification.error-modules"), { variant: 'error' }));
  };

  const submitCompanyInfo = async () => {
    const form = new FormData();
    form.append('id', companyInformation.id);
    ['name','email','phone','document'].forEach(key => form.append(key, companyData[key]));
    if (companyData.logo instanceof File) {
      const fileForm = new FormData(); fileForm.append('path','logos'); fileForm.append('file', companyData.logo as File);
      const res = await AllInOneApi.post('shared/image', fileForm);
      form.append('logo', res.data.url);
    } else form.append('logo', companyData.logo || '');
    try {
      await EnterpriseService.update(form);
      enqueueSnackbar(t("config.form.companyUpdatedSuccess"), { variant: 'success' });
      setModulesUpdating(prev => !prev);
    } catch {
      enqueueSnackbar(t("config.form.companyUpdateError"), { variant: 'error' });
    }
  };

  // Sections
  const renderProfile = () => (
    <Box sx={{ p:2, overflowY:'auto', flexGrow:1 }}>
      <GlassCard>
        <CardContent>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb:2 }}>
            <Avatar src={userData.profileImage} sx={{ width:60, height:60 }} />
            <Button variant="outlined" component="label" size="small" startIcon={<Upload size={16}/>}> {t("config.form.changePhoto")} <input hidden type="file" accept="image/*"/> </Button>
          </Stack>
          {['name','email','cellphone','document'].map(field => (
            <TextField
              key={field}
              label={t(`config.form.${field}`)}
              value={(userData as any)[field] || ''}
              disabled
              fullWidth size="small"
              sx={{ mb:1 }}
            />
          ))}
        </CardContent>
      </GlassCard>
    </Box>
  );
  const renderCompany = () => (
    <Box sx={{ p:2, overflowY:'auto', flexGrow:1 }}>
      <Select
        fullWidth
        size="small"
        value={activeCompany || ''}
        onChange={(e) => setActiveCompany(e.target.value as string)}
        sx={{ mb:2 }}
      >
        {companies.map((comp) => (
          <MenuItem key={comp.id} value={comp.id}>
            {comp.name}
          </MenuItem>
        ))}
      </Select>
      <GlassCard>
        <CardContent>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb:2 }}>
            <Avatar src={companyData.previewLogo} sx={{ width:60, height:60 }}/>
            <Button variant="outlined" component="label" size="small" startIcon={<Upload size={16}/>}> {t("config.form.changePhoto")} <input hidden type="file" onChange={handleCompanyImageChange} accept="image/*"/> </Button>
          </Stack>
          {['name','email','phone','document'].map(key => (
            <TextField
              key={key}
              label={t(`config.form.${key}`)}
              name={key}
              value={companyData[key] || ''}
              onChange={handleCompanyChange}
              fullWidth size="small"
              sx={{ mb:1 }}
            />
          ))}
          <Stack direction="row" spacing={1} sx={{ mt:2 }}>
            <Button variant="contained" size="small" fullWidth onClick={submitCompanyInfo} startIcon={<Save size={16}/>}>{t(`config.form.save`)}</Button>
            <Button variant="outlined" size="small" fullWidth onClick={()=>setCompanyData(originalCompanyData)} startIcon={<X size={16}/>}>{t(`config.form.cancel`)}</Button>
          </Stack>
        </CardContent>
      </GlassCard>
      <GlassCard>
        <CardContent>
          <Typography variant="subtitle1" sx={{ mb:2, fontWeight:600 }}>{t("config.form.activeModules")}</Typography>
          <Autocomplete
            options={establishmentOptions}
            value={selectedEstablishment}
            onChange={(_, v) => setSelectedEstablishment(v)}
            renderInput={params => <TextField {...params} label={t("config.form.establishment.label")} size="small" />}
            sx={{ mb:2 }}
          />
          <Box sx={{ maxHeight:300, overflowY:'auto', bgcolor:alpha(theme.palette.primary.main,0.05), p:1, borderRadius:1 }}>
            {availableModules.map(mod => (
              <FormControlLabel
                key={mod.id}
                control={<Checkbox size="small" checked={companyData.modules[mod.key]||false} onChange={handleCompanyChange} name={mod.key}/>}
                label={t(`config.establishmentModules.${mod.key}`, mod.name)}
                sx={{ mb:0.5 }}
              />
            ))}
          </Box>
          <Stack direction="row" spacing={1} sx={{ mt:2 }}>
            <Button variant="contained" size="small" fullWidth onClick={saveModules} startIcon={<Save size={16}/>}>{t(`config.form.save`)}</Button>
            <Button variant="outlined" size="small" fullWidth onClick={()=>setCompanyData(originalCompanyData)} startIcon={<X size={16}/>}>{t(`config.form.cancel`)}</Button>
          </Stack>
        </CardContent>
      </GlassCard>
    </Box>
  );
  const renderFeedback = () => (
    <Box sx={{ p:2, overflowY:'auto', flexGrow:1 }}>
      <GlassCard>
        <CardContent>
          <Typography variant="subtitle1" sx={{ mb:2, fontWeight:600 }}>{t("feedback.title")}</Typography>
          <form onSubmit={handleFeedbackSubmit}>
            <Stack spacing={2}>
              <TextField
                label={t("feedback.message")}
                multiline rows={4}
                value={feedbackMessage}
                onChange={e=>setFeedbackMessage(e.target.value)}
                fullWidth size="small"
              />
              <Button type="submit" variant="contained" size="small" startIcon={<MessageSquare size={16}/>}>{t("feedback.send")}</Button>
            </Stack>
          </form>
        </CardContent>
      </GlassCard>
    </Box>
  );

  return (
    <Box sx={{ display:'flex', flexDirection:'column', height:'100vh', background:'linear-gradient(180deg,#f8faff 0%,#fff 100%)' }}>
    <ToggleButtonGroup
    value={navValue}
    exclusive
    onChange={(_, v) => v && setNavValue(v)}
    sx={{
        bgcolor: '#fff',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        mb: 2,
        mx: 2,
        borderRadius: 2,
        overflow: 'hidden',
        alignSelf: 'center',
        width:'378px',
    }}
    >
    <ToggleButton value="profile" sx={{ px: 3, py: 1, textTransform: 'none' }}>
        <User size={18} style={{ marginRight: 8 }} />
        {t("config.profile")}
    </ToggleButton>
    <ToggleButton value="company" sx={{ px: 3, py: 1, textTransform: 'none' }}>
        <Building size={18} style={{ marginRight: 8 }} />
        {t("config.company")}
    </ToggleButton>
    <ToggleButton value="feedback" sx={{ px: 3, py: 1, textTransform: 'none' }}>
        <MessageSquare size={18} style={{ marginRight: 8 }} />
        {t("feedback.title")}
    </ToggleButton>
    </ToggleButtonGroup>
      {navValue === 'profile' && renderProfile()}
      {navValue === 'company' && renderCompany()}
      {navValue === 'feedback' && renderFeedback()}
      <Dialog open={confirmDialogOpen} onClose={()=>setConfirmDialogOpen(false)}>
        <DialogTitle>{t("config.disableCompanyConfirm")}</DialogTitle>
        <DialogContent><Typography>{t("config.disableCompanyWarning")}</Typography></DialogContent>
        <DialogActions>
          <Button onClick={()=>setConfirmDialogOpen(false)}>{t("config.cancel")}</Button>
          <Button color="error" onClick={()=>{setConfirmDialogOpen(false); enqueueSnackbar(t("config.companyDisabled"),{variant:'info'});}}>{t("config.confirm")}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MobileConfig;
