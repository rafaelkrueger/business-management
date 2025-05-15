import {
  Card,
  CardContent,
  Typography,
  Grid,
  useMediaQuery,
  useTheme,
  Box,
  Fade,
  Grow,
  Zoom,
  styled,
  alpha,
  LinearProgress,
  Badge,
  Chip,
  Avatar
} from "@mui/material";
import { Line, Bar } from "react-chartjs-2";
import {
  Brain,
  FileText,
  Layout,
  Users,
  Zap,
  Check,
  Lock,
  Rocket,
  Award,
  Star
} from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import LeadGeneration from "./create-leads/index.tsx";
import React from "react";
import CapturePages from "./capture-pages/index.tsx";
import AutomationDashboard from "./automation/index.tsx";
import SocialMediaDashboard from "./social-media/index.tsx";
import StyledAIAssistant from "./ai/index.tsx";
import { useSnackbar } from 'notistack';
import CRMApp from "./crm/index.tsx";
import SalesFunnel from "./funnel/index.tsx";
import Confetti from 'react-confetti';
import UserProgressService from '../../services/user-progress.service.ts'

const AnimatedCard = styled(Card)(({ theme }) => ({
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[8],
  },
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.background.default, 0.9)} 100%)`,
  backdropFilter: 'blur(10px)',
  borderRadius: '12px',
  overflow: 'hidden',
}));


const ModuleTimeline = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  margin: theme.spacing(3, 0),
  padding: theme.spacing(2),
  background: alpha(theme.palette.background.paper, 0.7),
  borderRadius: theme.shape.borderRadius,
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: theme.spacing(2),
    right: theme.spacing(2),
    height: 2,
    background: alpha(theme.palette.primary.main, 0.2),
    zIndex: 0
  }
}));

const ModuleStep = styled(Box)(({ theme, completed, active }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  zIndex: 1,
  '& .step-icon': {
    width: 40,
    height: 40,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: completed
      ? theme.palette.success.main
      : active
        ? theme.palette.primary.main
        : alpha(theme.palette.text.disabled, 0.2),
    color: completed || active ? '#fff' : theme.palette.text.disabled,
    marginBottom: theme.spacing(1),
    transition: 'all 0.3s ease',
    boxShadow: completed ? `0 0 0 4px ${alpha(theme.palette.success.main, 0.3)}` : 'none'
  },
  '& .step-label': {
    fontSize: 12,
    fontWeight: completed || active ? 600 : 400,
    color: completed
      ? theme.palette.success.main
      : active
        ? theme.palette.primary.main
        : theme.palette.text.disabled
  }
}));

const MarketingDashboard: React.FC<{ activeCompany }> = ({ ...props }) => {
  const { t } = useTranslation();
  const [module, setModule] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const { enqueueSnackbar } = useSnackbar();

  // Estado para controle de progresso e gamificação
  const [progress, setProgress] = useState(0);
  const [completedModules, setCompletedModules] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [unlockedTheme, setUnlockedTheme] = useState(null);

  useEffect(() => {
  const fetchProgress = async () => {
    if (!props.activeCompany) return;

    try {
      const res = await UserProgressService.get(props.activeCompany, 'marketing');
      if (res?.data?.completedSteps) {
        setCompletedModules(res.data.completedSteps);
      }
    } catch (error) {
      console.error('Erro ao buscar progresso:', error);
    }
  };

  fetchProgress();
}, [props.activeCompany, module]);

const moduleDependencies = {
  marketingAi: [],
  createLeads: ['marketingAi'],
  automation: ['marketingAi', 'createLeads', 'leadsForm'],
  crm: ['marketingAi', 'createLeads', 'leadsForm' ,'automation'],
  funnel: ['marketingAi', 'createLeads', 'leadsForm' , 'automation', 'crm']
};


const isModuleUnlocked = (moduleKey) => {
  const requiredSteps = moduleDependencies[moduleKey] || [];
  return requiredSteps.every(step => completedModules.includes(step));
};

const isModuleCompleted = (moduleKey) => {
  const requiredSteps = moduleDependencies[moduleKey] || [];
  return requiredSteps.every(step => completedModules.includes(step));
};

const isInProgress = (card) => {
  return isModuleUnlocked(card.module) && !card.completed;
};


  const [liveData, setLiveData] = useState({
    leads: 0,
    pageViews: 0,
    conversions: 0
  });

  useEffect(() => {
    if (completedModules.length > 0) {
      const interval = setInterval(() => {
        setLiveData(prev => ({
          leads: 0,
          pageViews: 0,
          conversions: 0
        }));
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [completedModules]);

  const handleModuleComplete = (moduleName) => {
    if (!completedModules.includes(moduleName)) {
      setCompletedModules([...completedModules, moduleName]);

      let message = '';
      let emoji = '✅';

      enqueueSnackbar(
        <Box display="flex" alignItems="center">
          <span style={{ marginRight: 8, fontSize: '1.2em' }}>{emoji}</span>
          <span>{message}</span>
        </Box>,
        {
          variant: 'success',
          autoHideDuration: 4000
        }
      );

      // Sugestão de próxima ação com IA
      setTimeout(() => {
        let suggestion = '';
        if (moduleName === 'createLeads') {
          suggestion = 'Baseado nos seus dados, sua próxima ação ideal seria configurar a Automação para capturar mais leads.';
        } else if (moduleName === 'automation') {
          suggestion = 'Ótimo trabalho! Agora você deve configurar o CRM para organizar seus novos leads.';
        }

        if (suggestion) {
          enqueueSnackbar(
            <Box display="flex" alignItems="center">
              <span style={{ marginRight: 8, fontSize: '1.2em' }}>🧠</span>
              <span>{suggestion}</span>
            </Box>,
            {
              variant: 'info',
              autoHideDuration: 5000
            }
          );
        }
      }, 2000);
    }
  };

  const DisabledCard = styled(AnimatedCard)(({ theme }) => ({
    position: 'relative',
    opacity: 0.7,
    cursor: 'not-allowed',
    height:'220px',
    '&:hover': {
      transform: 'none',
      boxShadow: theme.shadows[2]
    },
    '& .MuiTypography-root': {
      color: theme.palette.text.disabled
    },
    '& .MuiBox-root': {
      backgroundColor: alpha(theme.palette.grey[500], 0.1)
    }
  }));

  const [lineData] = useState({
    labels: ["Jan", "Fev", "Mar", "Abr", "Mai"],
    datasets: [
      {
        label: "Views",
        data: [0, 0, 0, 0, 0],
        borderColor: theme.palette.primary.main,
        backgroundColor: alpha(theme.palette.primary.main, 0.2),
        tension: 0.4,
        fill: true,
        borderWidth: 2,
        pointBackgroundColor: theme.palette.primary.main,
        pointRadius: 4,
        pointHoverRadius: 6
      },
      {
        label: "Clicks",
        data: [0, 0, 0, 0, 0],
        borderColor: theme.palette.secondary.main,
        backgroundColor: alpha(theme.palette.secondary.main, 0.2),
        tension: 0.4,
        fill: true,
        borderWidth: 2,
        pointBackgroundColor: theme.palette.secondary.main,
        pointRadius: 4,
        pointHoverRadius: 6
      }
    ]
  });

  const [barData] = useState({
    labels: ["Jan", "Fev", "Mar", "Abr", "Mai"],
    datasets: [{
      label: t("marketing.conversions"),
      data: [0, 0, 0, 0, 0],
      backgroundColor: alpha(theme.palette.success.main, 0.7),
      borderRadius: 4,
      borderWidth: 0,
      hoverBackgroundColor: theme.palette.success.main
    }]
  });

const cards = [
  {
    icon: <Brain size={24} color={"#9C27B0"} />,
    title: t("marketing.ai"),
    description: t("marketing.aiDescription"),
    module: "marketingAi",
    color: "#9C27B0",
    completed: isModuleCompleted("marketingAi"),
    disabled: false
  },
  {
    icon: <Layout size={24} color={theme.palette.error.light} />,
    title: t("marketing.landing_pages"),
    description: t("marketing.landing_pages_desc"),
    module: "createLeads",
    color: theme.palette.secondary.main,
    completed: isModuleCompleted("createLeads"),
    disabled: !isModuleUnlocked("createLeads"),
  },
  {
    icon: <Zap size={24} color={theme.palette.primary.main} />,
    title: t("marketing.automation"),
    description: t("marketing.automation_desc"),
    module: "automation",
    color: theme.palette.primary.main,
    completed: isModuleCompleted("automation"),
    disabled: !isModuleUnlocked("automation"),
  },
  {
    icon: <Users size={24} color={theme.palette.info.light} />,
    title: t("marketing.crmTitle"),
    description: t("marketing.crm_desc"),
    module: "crm",
    color: theme.palette.info.main,
    completed: isModuleCompleted("crm"),
    disabled: !isModuleUnlocked("crm"),
  },
  {
    icon: <FileText size={24} color={theme.palette.warning.light} />,
    title: t("marketing.funnels"),
    description: t("marketing.funnels_desc"),
    module: "funnel",
    color: theme.palette.warning.main,
    completed: isModuleCompleted("funnel"),
    disabled: !isModuleUnlocked("funnel"),
  },
];

  const getCardSize = () => {
    if (isMobile) return 12;
    if (isTablet) return 6;
    return 3;
  };

  const modulesTimeline = [
    { id: 'marketingAi', label: 'IA', icon: <Brain size={16} /> },
    { id: 'createLeads', label: 'Landing Page', icon: <Layout size={16} /> },
    { id: 'automation', label: 'Automação', icon: <Zap size={16} /> },
    { id: 'crm', label: 'CRM', icon: <Users size={16} /> },
    { id: 'funnel', label: 'Vendas', icon: <FileText size={16} /> }
  ];

  return (
    <Box sx={{
      padding: isMobile ? 2 : 4,
      marginTop: isMobile ? '50px' : 'unset',
      background: unlockedTheme === 'professional'
        ? 'linear-gradient(135deg, #121212 0%, #1a1a2e 100%)'
        : theme.palette.mode === 'light'
          ? 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)'
          : 'linear-gradient(135deg, #121212 0%, #1e1e1e 100%)',
      minHeight: '100vh',
      transition: 'background 0.5s ease'
    }}>
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={500}
        />
      )}

      {module === '' ? (
        <>
          <Fade in timeout={500}>
            <Box>
              <Typography variant="h4" component="h1" sx={{
                mb: 1,
                fontWeight: 700,
                color: theme.palette.text.primary,
                textAlign: 'left'
              }}>
              </Typography>

            <ModuleTimeline>
              {modulesTimeline.map((step, index) => {
                const isCompleted = completedModules.includes(step.id);
                const isUnlocked = isModuleUnlocked(step.id);

                return (
                  <ModuleStep
                    key={step.id}
                    completed={isCompleted}
                    active={!isCompleted && isUnlocked}
                  >
                    <Box className="step-icon">
                      {isCompleted ? <Check size={20} /> : isUnlocked ? step.icon : <Lock size={20} />}
                    </Box>
                    <Typography className="step-label">{step.label}</Typography>
                  </ModuleStep>
                );
              })}
            </ModuleTimeline>
            </Box>
          </Fade>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
                    {t("marketing.performance")}
                  </Typography>
                  <Box sx={{ height: 250 }}>
                    <Line
                      data={lineData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { position: 'top' } },
                        scales: {
                          x: { grid: { display: false } },
                          y: { grid: { color: '#f5f5f5' } }
                        }
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
                      {t("marketing.conversions")}
                    </Typography>
                    <Box display="flex">
                      <Chip
                        label={`${liveData.leads} Leads`}
                        size="small"
                        sx={{ mr: 1 }}
                        avatar={<Avatar sx={{ bgcolor: alpha(theme.palette.success.main, 0.2) }}>👥</Avatar>}
                      />
                      <Chip
                        label={`${liveData.conversions} ${t("marketing.conversions")}`}
                        size="small"
                        color="success"
                        avatar={<Avatar sx={{ bgcolor: alpha(theme.palette.success.main, 0.2) }}>📈</Avatar>}
                      />
                    </Box>
                  </Box>
                  <Box sx={{ height: 250 }}>
                    <Bar
                      data={barData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { position: 'top' } },
                        scales: {
                          x: { grid: { display: false } },
                          y: { grid: { color: '#f5f5f5' } }
                        }
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Typography variant="h5" component="h2" sx={{
            mt: 4,
            mb: 3,
            fontWeight: 600,
            color: theme.palette.text.primary
          }}>
            {t("marketing.tools")}
          </Typography>

          <Grid container spacing={3} sx={{ marginBottom: isMobile ? 3 : 6 }}>
            {cards.map((card, index) => (
              <Grid item xs={getCardSize()} key={index}>
                {card.disabled ? (
                  <Zoom in timeout={(index + 1) * 200}>
                    <div onClick={() => enqueueSnackbar(t('userProgress.blocked'), { variant: 'info' })}>
                      <DisabledCard>
                        <CardContent sx={{ flexGrow: 1 }}>
                          <Box sx={{
                            width: 48,
                            height: 48,
                            borderRadius: '50%',
                            backgroundColor: alpha(card.color, 0.1),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: 2
                          }}>
                            {card.icon}
                          </Box>
                          <Typography variant="h6" sx={{
                            mb: 1,
                            fontWeight: 600
                          }}>
                            {card.title}
                          </Typography>
                          <Typography variant="body2" sx={{
                            lineHeight: 1.6
                          }}>
                            {card.description}
                          </Typography>
                        </CardContent>
                      </DisabledCard>
                    </div>
                  </Zoom>
                ) : (
                  <Zoom in timeout={(index + 1) * 200}>
                    <div>
                        <AnimatedCard
                          sx={{
                            cursor: 'pointer',
                            position: 'relative',
                            overflow: 'hidden',
                          '&::after': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: 4,
                            background: isInProgress(card.module)
                              ? theme.palette.primary.main
                              : isModuleUnlocked(card.module)
                                ? theme.palette.success.main
                                : 'transparent',
                            transition: 'background 0.3s ease'
                          }
                          }}
                          onClick={() => setModule(card.module || '')}
                        >
                          <CardContent sx={{ flexGrow: 1 }}>
                            <Box sx={{
                              width: 48,
                              height: 48,
                              borderRadius: '50%',
                              backgroundColor: alpha(card.color, 0.1),
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              mb: 2
                            }}>
                              {card.icon}
                            </Box>
                            <Typography variant="h6" sx={{
                              mb: 1,
                              fontWeight: 600,
                              color: theme.palette.text.primary
                            }}>
                              {card.title}
                            </Typography>
                            <Typography variant="body2" sx={{
                              color: theme.palette.text.secondary,
                              lineHeight: 1.6
                            }}>
                              {card.description}
                            </Typography>
                          </CardContent>
                        </AnimatedCard>
                    </div>
                  </Zoom>
                )}
              </Grid>
            ))}
          </Grid>
        </>
      ) : module === 'createLeads' ? (
        <CapturePages
          activeCompany={props.activeCompany}
          setModule={setModule}
          onComplete={() => handleModuleComplete('createLeads')}
          liveData={liveData}
        />
      ) : module === 'automation' ? (
        <AutomationDashboard
          activeCompany={props.activeCompany}
          setModule={setModule}
          onComplete={() => handleModuleComplete('automation')}
        />
      ) : module === 'social-media' ? (
        <SocialMediaDashboard activeCompany={props.activeCompany} />
      ) : module === 'marketingAi' ? (
        <StyledAIAssistant
          activeCompany={props.activeCompany}
          setModule={setModule}
          onComplete={() => handleModuleComplete('marketingAi')}
        />
      ) : module === 'crm' ? (
        <CRMApp
          activeCompany={props.activeCompany}
          setModule={setModule}
          onComplete={() => handleModuleComplete('crm')}
        />
      ) : module === 'funnel' ? (
        <SalesFunnel/>
      ) : null}
    </Box>
  );
};

export default MarketingDashboard;