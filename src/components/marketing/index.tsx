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
  Avatar,
  Paper
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
  Star,
  Coins,
  BarChart2,
  ArrowRight
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
import { RobotOutlined } from "@ant-design/icons";
import MarketingService from "../../services/marketing.service.ts";
import {ChatbotManager} from "./chatbot/index.tsx";

// Gradientes modernos para light mode
const cardGradients = {
  active: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(245, 247, 252, 0.95) 100%)',
  disabled: 'linear-gradient(135deg, rgba(250, 250, 252, 0.7) 0%, rgba(245, 247, 252, 0.8) 100%)',
  completed: 'linear-gradient(135deg, rgba(232, 248, 255, 0.9) 0%, rgba(225, 240, 255, 0.95) 100%)'
};

const AnimatedCard = styled(Card)(({ theme }) => ({
  transition: 'all 0.3s ease-in-out',
  border: '1px solid',
  borderColor: alpha(theme.palette.divider, 0.1),
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 24px rgba(0,0,0,0.08)',
  },
  maxHeight: '240px',
  minHeight: '240px',
  display: 'flex',
  flexDirection: 'column',
  background: cardGradients.active,
  backdropFilter: 'blur(12px)',
  borderRadius: '16px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at top right, rgba(94, 114, 235, 0.05), transparent 70%)',
    zIndex: 0,
  }
}));

const ModuleTimeline = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  margin: theme.spacing(3, 0),
  padding: theme.spacing(2.5),
  background: 'rgba(255, 255, 255, 0.7)',
  borderRadius: '16px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: theme.spacing(2),
    right: theme.spacing(2),
    height: 3,
    background: alpha(theme.palette.primary.main, 0.1),
    zIndex: 0
  }
}));

const ModuleStep = styled(Box)(({ theme, completed, active }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  zIndex: 1,
  '& .step-icon': {
    width: 44,
    height: 44,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: completed
      ? 'linear-gradient(135deg, #00c6ff, #0072ff)'
      : active
        ? 'linear-gradient(135deg, #e6efff, #639cff)'
        : alpha(theme.palette.text.disabled, 0.1),
    color: completed || active ? '#fff' : '#639cff',
    marginBottom: theme.spacing(1.5),
    transition: 'all 0.3s ease',
    boxShadow: completed
      ? `0 0 0 4px ${alpha('#00c6ff', 0.2)}`
      : active
        ? `0 0 0 4px ${alpha(theme.palette.primary.main, 0.2)}`
        : 'none'
  },
  '& .step-label': {
    fontSize: 13,
    fontWeight: completed || active ? 600 : 500,
    color: completed
      ? theme.palette.success.main
      : active
        ? theme.palette.primary.main
        : theme.palette.text.secondary
  }
}));

const NextStepIndicator = styled(Box)(({ theme }) => ({
  position: 'relative',
  backgroundColor: alpha(theme.palette.primary.main, 0.05),
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  borderRadius: '16px',
  padding: theme.spacing(2.5),
  marginBottom: theme.spacing(3),
  display: 'flex',
  alignItems: 'center',
  backdropFilter: 'blur(8px)',
  boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `linear-gradient(90deg, ${alpha(theme.palette.primary.main, 0.03)} 0%, transparent 100%)`,
    borderRadius: 'inherit',
    zIndex: 0
  }
}));

const PulseDot = styled(Box)(({ theme }) => ({
  width: 12,
  height: 12,
  borderRadius: '50%',
  backgroundColor: theme.palette.primary.main,
  marginRight: theme.spacing(1.5),
  boxShadow: `0 0 0 0 ${alpha(theme.palette.primary.main, 0.3)}`,
  animation: 'pulse 1.5s infinite',
  '@keyframes pulse': {
    '0%': {
      transform: 'scale(0.95)',
      boxShadow: `0 0 0 0 ${alpha(theme.palette.primary.main, 0.3)}`
    },
    '70%': {
      transform: 'scale(1)',
      boxShadow: `0 0 0 10px ${alpha(theme.palette.primary.main, 0)}`
    },
    '100%': {
      transform: 'scale(0.95)',
      boxShadow: `0 0 0 0 ${alpha(theme.palette.primary.main, 0)}`
    }
  }
}));

const MarketingDashboard: React.FC<{ activeCompany }> = ({ ...props }) => {
  const { t } = useTranslation();
  const [module, setModule] = useState('');
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const [completedModules, setCompletedModules] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [glance, setGlance] = useState(null);

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

  useEffect(() => {
    const fetchGlance = async () => {
      if (!props.activeCompany) return;

      try {
        const res = await MarketingService.get(props.activeCompany);
        if (res?.data) {
          setGlance(res.data);
        }
      } catch (error) {
        console.error('Erro ao buscar progresso:', error);
      }
    };

    fetchGlance();
  }, [props.activeCompany, module]);

  const getNextStep = () => {
    if (!completedModules.includes('marketingAi')) return 'marketingAi';
    if (!completedModules.includes('createLeads')) return 'createLeads';
    if (!completedModules.includes('automation')) return 'automation';
    if (!completedModules.includes('crm')) return 'crm';
    if (!completedModules.includes('funnel')) return 'funnel';
    return null;
  };

  const moduleDependencies = {
    marketingAi: [],
    createLeads: ['marketingAi'],
    automation: ['marketingAi', 'createLeads'],
    crm: ['marketingAi', 'createLeads', 'automation'],
    funnel: ['marketingAi', 'createLeads', 'automation', 'crm']
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

  const handleModuleComplete = (moduleName) => {
    if (!completedModules.includes(moduleName)) {
      setCompletedModules([...completedModules, moduleName]);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);

      let message = '';
      let emoji = '✨';

      switch (moduleName) {
        case 'marketingAi':
          message = t('marketing.aiComplete');
          emoji = '🧠';
          break;
        case 'createLeads':
          message = t('marketing.leadsComplete');
          emoji = '🚀';
          break;
        case 'automation':
          message = t('marketing.automationComplete');
          emoji = '⚡';
          break;
        case 'crm':
          message = t('marketing.crmComplete');
          emoji = '👥';
          break;
        default:
          message = t('marketing.moduleComplete');
      }

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

      setTimeout(() => {
        let suggestion = '';
        if (moduleName === 'createLeads') {
          suggestion = t('marketing.suggestionAutomation');
        } else if (moduleName === 'automation') {
          suggestion = t('marketing.suggestionCRM');
        }

        if (suggestion) {
          enqueueSnackbar(
            <Box display="flex" alignItems="center">
              <span style={{ marginRight: 8, fontSize: '1.2em' }}>💡</span>
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
    '&:hover': {
      transform: 'none',
      boxShadow: 'none'
    },
    background: cardGradients.disabled,
    '& .MuiTypography-root': {
      color: theme.palette.text.disabled
    },
    '& .MuiBox-root': {
      backgroundColor: alpha(theme.palette.grey[500], 0.05)
    },
    '&::before': {
      background: 'radial-gradient(circle at top right, rgba(200,200,200,0.05), transparent 70%)',
    }
  }));

  const [lineData] = useState({
    labels: ["Jan", "Fev", "Mar", "Abr", "Mai"],
    datasets: [
      {
        label: "Views",
        data: [0, 0, 0, 0, 0],
        borderColor: '#728cdf',
        backgroundColor: alpha('#728cdf', 0.1),
        tension: 0.4,
        fill: true,
        borderWidth: 3,
        pointBackgroundColor: '#728cdf',
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBorderColor: '#fff',
        pointBorderWidth: 2
      },
      {
        label: "Clicks",
        data: [0, 0, 0, 0, 0],
        borderColor: '#0072ff',
        backgroundColor: alpha('#0072ff', 0.1),
        tension: 0.4,
        fill: true,
        borderWidth: 3,
        pointBackgroundColor: '#0072ff',
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBorderColor: '#fff',
        pointBorderWidth: 2
      }
    ]
  });

  const [barData] = useState({
    labels: ["Jan", "Fev", "Mar", "Abr", "Mai"],
    datasets: [{
      label: t("marketing.conversions"),
      data: [0, 0, 0, 0, 0],
      backgroundColor: alpha('#728cdf', 0.7),
      borderRadius: 6,
      borderWidth: 0,
      hoverBackgroundColor: '#728cdf'
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
    // disabled: !isModuleUnlocked("createLeads"),
    disabled:false,
  },
  {
    icon: <Zap size={24} color={theme.palette.primary.main} />,
    title: t("marketing.automation"),
    description: t("marketing.automation_desc"),
    module: "automation",
    color: theme.palette.primary.main,
    completed: isModuleCompleted("createLeads"),
    // disabled: !isModuleUnlocked("createLeads"),
    disabled:false,
  },
  {
    icon: <Users size={24} color={theme.palette.info.light} />,
    title: t("marketing.crmTitle"),
    description: t("marketing.crm_desc"),
    module: "crm",
    color: theme.palette.info.main,
    completed: isModuleCompleted("crm"),
    // disabled: !isModuleUnlocked("crm"),
    disabled:false,
  },
    {
    icon: <RobotOutlined size={24} color={'rgba(0,223,113)'} />,
    title: t("marketing.chatbot"),
    description: t("marketing.chatbot_desc"),
    module: "chatbot",
    color: 'rgb(0,0,0.4)',
    completed: isModuleCompleted("crm"),
    disabled: true,
  },
  {
    icon: <FileText size={24} color={theme.palette.warning.light} />,
    title: t("marketing.funnels"),
    description: t("marketing.funnels_desc"),
    module: "funnel",
    color: theme.palette.warning.main,
    completed:true,
    disabled: !isModuleUnlocked("funnel"),
  },
  {
    icon: <Coins size={24} color={theme.palette.text.disabled} />,
    title: t("marketing.sales_page"),
    description: t("marketing.sales_page_desc"),
    module: "salesPage",
    color: theme.palette.text.disabled,
    completed: isModuleCompleted("salesPage"),
    disabled: true,
    comingSoon: true
  },
];


  const getCardSize = () => {
    if (isMobile) return 12;
    if (isTablet) return 6;
    return 3;
  };

  const modulesTimeline = [
    { id: 'marketingAi', label: 'AI', icon: <Brain size={16} /> },
    { id: 'createLeads', label: 'Landing Page', icon: <Layout size={16} /> },
    { id: 'automation', label: 'Automation', icon: <Zap size={16} /> },
    { id: 'crm', label: 'CRM', icon: <Users size={16} /> },
    { id: 'funnel', label: 'Funnel', icon: <FileText size={16} /> }
  ];

  return (
    <Box sx={{
      padding: isMobile ? 2 : 4,
      background: 'linear-gradient(135deg, #f8f9fc 0%, #f0f4f9 100%)',
      minHeight: '100vh',
      color: '#334155',
      position: 'relative',
      overflowX: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(94, 114, 235, 0.03) 0%, transparent 20%), radial-gradient(circle at 90% 80%, rgba(139, 92, 246, 0.03) 0%, transparent 20%)',
        pointerEvents: 'none',
        zIndex: 0
      }
    }}>
      {showConfetti && <Confetti recycle={false} numberOfPieces={500} />}

      <Box sx={{ position: 'relative', zIndex: 1 }}>
        {module === '' ? (
          <>
            <Fade in timeout={500}>
              <Box>
                {getNextStep() && (
                  <NextStepIndicator>
                    <PulseDot />
                    <Box sx={{ position: 'relative', zIndex: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#0072ff' }}>
                        {t("marketing.nextStep")}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#64748b' }}>
                        {t(`marketing.nextStepDescription.${getNextStep()}`)}
                      </Typography>
                    </Box>
                  </NextStepIndicator>
                )}

                <ModuleTimeline>
                  {modulesTimeline.map((step, index) => {
                    const isCompleted = completedModules.includes(step.id);
                    const isUnlocked = isModuleUnlocked(step.id);
                    const isNextStep = step.id === getNextStep();

                    return (
                      <ModuleStep
                        key={step.id}
                        completed={isCompleted}
                        active={isNextStep}
                        sx={isNextStep ? {
                          '& .step-icon': {
                            boxShadow: `0 0 0 4px ${alpha(theme.palette.primary.main, 0.2)}`,
                            animation: 'pulse 2s infinite'
                          }
                        } : {}}
                      >
                        <Box className="step-icon">
                          {isCompleted ? <Check size={20} /> : isUnlocked ? step.icon : <Lock size={20} />}
                        </Box>
                        <Typography style={{color:'#464646'}} className="step-label">{step.label}</Typography>
                      </ModuleStep>
                    );
                  })}
                </ModuleTimeline>
              </Box>
            </Fade>

            {/* <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} md={6}>
                <Paper sx={{
                  background: 'rgba(255, 255, 255, 0.7)',
                  border: '1px solid rgba(0, 0, 0, 0.05)',
                  borderRadius: '16px',
                  backdropFilter: 'blur(12px)',
                  overflow: 'hidden',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.03)'
                }}>
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={2}>
                      <BarChart2 size={20} style={{ marginRight: 12, color: '#0072ff' }} />
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1e293b' }}>
                        {t("marketing.performance")}
                      </Typography>
                    </Box>
                    <Box sx={{ height: 250 }}>
                      <Line
                        data={lineData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: 'top',
                              labels: {
                                color: '#64748b',
                                usePointStyle: true,
                                pointStyle: 'circle',
                                padding: 20
                              }
                            }
                          },
                          scales: {
                            x: {
                              grid: {
                                display: false,
                                color: 'rgba(0, 0, 0, 0.03)'
                              },
                              ticks: {
                                color: '#64748b'
                              }
                            },
                            y: {
                              grid: {
                                color: 'rgba(0, 0, 0, 0.03)'
                              },
                              ticks: {
                                color: '#64748b'
                              }
                            }
                          }
                        }}
                      />
                    </Box>
                  </CardContent>
                </Paper>
              </Grid>

              <Grid item xs={12} md={6}>
                <Paper sx={{
                  background: 'rgba(255, 255, 255, 0.7)',
                  border: '1px solid rgba(0, 0, 0, 0.05)',
                  borderRadius: '16px',
                  backdropFilter: 'blur(12px)',
                  overflow: 'hidden',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.03)'
                }}>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      <Box display="flex" alignItems="center">
                        <BarChart2 size={20} style={{ marginRight: 12, color: '#0072ff' }} />
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1e293b' }}>
                          {t("marketing.conversions")}
                        </Typography>
                      </Box>
                      <Box display="flex">
                        <Chip
                          label={`${glance?.leads || 0} Leads`}
                          size="small"
                          sx={{
                            mr: 1,
                            background: 'rgba(56, 189, 248, 0.1)',
                            color: '#0ea5e9'
                          }}
                          avatar={<Avatar sx={{ bgcolor: 'transparent', color: '#0ea5e9' }}>👥</Avatar>}
                        />
                        <Chip
                          label={`${glance?.conversions || 0} ${t("marketing.conversions")}`}
                          size="small"
                          sx={{
                            background: 'rgba(16, 185, 129, 0.1)',
                            color: '#0072ff'
                          }}
                          avatar={<Avatar sx={{ bgcolor: 'transparent', color: '#0072ff' }}>📈</Avatar>}
                        />
                      </Box>
                    </Box>
                    <Box sx={{ height: 250 }}>
                      <Bar
                        data={barData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              display: false
                            }
                          },
                          scales: {
                            x: {
                              grid: {
                                display: false,
                                color: 'rgba(0, 0, 0, 0.03)'
                              },
                              ticks: {
                                color: '#64748b'
                              }
                            },
                            y: {
                              grid: {
                                color: 'rgba(0, 0, 0, 0.03)'
                              },
                              ticks: {
                                color: '#64748b'
                              }
                            }
                          }
                        }}
                      />
                    </Box>
                  </CardContent>
                </Paper>
              </Grid>
            </Grid> */}

            <Grid container spacing={3} sx={{ marginBottom: isMobile ? 3 : 6 }}>
              {cards.map((card, index) => (
                <Grid item xs={getCardSize()} key={index}>
                  {card.disabled ? (
                    <Zoom in timeout={(index + 1) * 200}>
                      <div onClick={() => {
                        const requiredStep = moduleDependencies[card.module]?.find(
                          step => !completedModules.includes(step)
                        );

                        if (requiredStep) {
                          const requiredStepName = cards.find(c => c.module === requiredStep)?.title || requiredStep;

                          enqueueSnackbar(
                            t('userProgress.blocked', { step: requiredStepName }),
                            { variant: 'info' }
                          );
                        } else {
                          enqueueSnackbar(t('userProgress.blocked_generic'), { variant: 'info' });
                        }
                      }}>
                        <DisabledCard>
                          {card?.comingSoon && (
                            <Chip
                              label={t("general.comingSoon")}
                              size="small"
                              variant="outlined"
                              sx={{
                                position: 'absolute',
                                top: 12,
                                right: 12,
                                fontWeight: 600,
                                fontSize: '0.65rem',
                                color: 'rgba(0, 0, 0, 0.6)',
                                borderColor: 'rgba(0, 0, 0, 0.15)',
                                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                                zIndex: 1
                              }}
                            />
                          )}
                          <CardContent sx={{
                            flexGrow: 1,
                            position: 'relative',
                            zIndex: 1
                          }}>
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
                              color: '#334155'
                            }}>
                              {card.title}
                            </Typography>
                            <Typography variant="body2" sx={{
                              lineHeight: 1.6,
                              color: '#64748b'
                            }}>
                              {card.description}
                            </Typography>
                            <Lock
                              size={20}
                              style={{
                                position: 'absolute',
                                bottom: 16,
                                right: 16,
                                color: 'rgba(0, 0, 0, 0.1)'
                              }}
                            />
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
                            ...(card.completed && {
                              background: cardGradients.completed,
                              '&::before': {
                                background: 'radial-gradient(circle at top right, rgba(56, 189, 248, 0.1), transparent 70%)',
                              }
                            }),
                            '&::after': {
                              content: '""',
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              right: 0,
                              height: 4,
                              background: card.completed
                                ? '#0072ff'
                                : isModuleUnlocked(card.module)
                                  ? '#0072ff'
                                  : 'transparent',
                              transition: 'background 0.3s ease'
                            }
                          }}
                          onClick={() => setModule(card.module || '')}
                        >
                          <Badge
                            badgeContent={isModuleUnlocked(card.module) && !card.completed ? t('marketing.currentStep') : null}
                            color="primary"
                            sx={{
                              '& .MuiBadge-badge': {
                                backgroundColor: alpha('#0072ff', 0.1),
                                border: `1px solid ${alpha('#0072ff', 0.3)}`,
                                color: '#8b5cf6',
                                right: 70,
                                top: 30,
                                fontWeight: 'bold',
                                fontSize: '0.65rem',
                                textTransform: 'uppercase',
                                padding: '0 8px',
                                animation: 'pulse 2s infinite',
                                '@keyframes pulse': {
                                  '0%': {
                                    boxShadow: `0 0 0 0 ${alpha('#8b5cf6', 0.3)}`
                                  },
                                  '70%': {
                                    boxShadow: `0 0 0 10px ${alpha('#8b5cf6', 0)}`
                                  },
                                  '100%': {
                                    boxShadow: `0 0 0 0 ${alpha('#8b5cf6', 0)}`
                                  }
                                }
                              }
                            }}
                          >
                            {card?.comingSoon && (
                              <Chip
                                label={t("general.comingSoon")}
                                size="small"
                                sx={{
                                  position: 'absolute',
                                  top: 12,
                                  right: 12,
                                  fontWeight: 600,
                                  fontSize: '0.65rem',
                                  backgroundColor: alpha(theme.palette.warning.main, 0.1),
                                  color: '#f59e0b',
                                  textTransform: 'uppercase',
                                  zIndex: 1
                                }}
                              />
                            )}
                            <CardContent sx={{
                              flexGrow: 1,
                              position: 'relative',
                              zIndex: 1
                            }}>
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
                                color: '#1e293b'
                              }}>
                                {card.title}
                              </Typography>
                              <Typography variant="body2" sx={{
                                color: '#64748b',
                                lineHeight: 1.6,
                                mb: 1
                              }}>
                                {card.description}
                              </Typography>
                            </CardContent>
                          </Badge>
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
          <SalesFunnel />
        ) : module === 'chatbot' ? (
          <ChatbotManager activeCompany={props.activeCompany} setModule={setModule} />
        ) : null}
      </Box>
    </Box>
  );
};

export default MarketingDashboard;