import {
  Card,
  CardContent,
  Typography,
  Grid,
  useTheme,
  Box,
  styled,
  alpha,
  IconButton,
  Avatar,
  BottomNavigation,
  BottomNavigationAction,
  LinearProgress,
  Badge,
  Chip,
  useMediaQuery,
  Collapse
} from "@mui/material";
import { Line, Bar } from "react-chartjs-2";
import {
  Brain,
  FileText,
  Layout,
  Users,
  Zap,
  Home,
  BarChart2,
  Settings,
  ChevronLeft,
  Check,
  Lock,
  Award,
  Rocket,
  Star,
  Bell,
  Trophy,
  Coins
} from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSnackbar } from 'notistack';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import AutomationDashboard from '../automation/mobile/index.tsx';
import SocialMediaDashboard from "../social-media/index.tsx";
import CRMAppMobile from "../crm/mobile/index.tsx";
import SalesFunnel from "../funnel/index.tsx";
import UserProgressService from '../../../services/user-progress.service.ts'
import { RobotOutlined } from "@ant-design/icons";
import MobileCapturePages from "../capture-pages/mobile/index.tsx";
import PremiumMarketingAssistantMobile from "../ai/mobile/index.tsx";
import MarketingService from "../../../services/marketing.service.ts";
import {ChatbotManager} from "../chatbot/index.tsx";

const MobileMarketingDashboard: React.FC<{ activeCompany }> = ({ ...props }) => {
  const { t } = useTranslation();
  const [module, setModule] = useState('');
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const [navValue, setNavValue] = useState('home');
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
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
  }, [props.activeCompany]);

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

const moduleDependencies = {
  marketingAi: [],
  createLeads: ['marketingAi'],
  automation: ['marketingAi', 'createLeads'],
  crm: ['marketingAi', 'createLeads' ,'automation'],
  funnel: ['marketingAi', 'createLeads', 'automation', 'crm']
};

const isModuleCompleted = (moduleKey) => {
  const requiredSteps = moduleDependencies[moduleKey] || [];
  return requiredSteps.every(step => completedModules.includes(step));
};

const isModuleUnlocked = (moduleKey) => {
  const requiredSteps = moduleDependencies[moduleKey] || [];
  return requiredSteps.every(step => completedModules.includes(step));
};

  const ComingSoonBadge = styled('div')(({ theme }) => ({
    position: 'absolute',
    top: 8,
    right: 8,
    color: 'rgba(0, 0, 0, 0.8)',
    borderColor: '0.5pxrgba(0, 0, 0, 0.8) solid',
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: '12px',
    padding: '2px 8px',
    fontSize: '0.6rem',
    fontWeight: 700,
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
    backdropFilter: 'blur(4px)',
    zIndex: 1
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

  const NextStepIndicator = styled(Box)(({ theme }) => ({
  position: 'relative',
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
  borderRadius: '12px',
  padding: theme.spacing(2),
  marginBottom: theme.spacing(3),
  display: 'flex',
  alignItems: 'center',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `linear-gradient(90deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, transparent 100%)`,
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
  boxShadow: `0 0 0 0 ${alpha(theme.palette.primary.main, 0.7)}`,
  animation: 'pulse 1.5s infinite',
  '@keyframes pulse': {
    '0%': {
      transform: 'scale(0.95)',
      boxShadow: `0 0 0 0 ${alpha(theme.palette.primary.main, 0.7)}`
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

  const [progress, setProgress] = useState(0);
  const [completedModules, setCompletedModules] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [unlockedBadges, setUnlockedBadges] = useState([]);
  const [userPoints, setUserPoints] = useState(0);
  const [liveData, setLiveData] = useState({
    leads: 0,
    views: 0,
    conversions: 0
  });

    const modulesTimeline = [
      { id: 'marketingAi', label: 'IA', icon: <Brain size={16} /> },
      { id: 'createLeads', label: 'Landing Page', icon: <Layout size={16} /> },
      { id: 'automation', label: 'Automação', icon: <Zap size={16} /> },
      { id: 'crm', label: 'CRM', icon: <Users size={16} /> },
      { id: 'funnel', label: 'Vendas', icon: <FileText size={16} /> }
    ];

  useEffect(() => {
    const totalModules = 5;
    const calculatedProgress = (completedModules.length / totalModules) * 100;
    setProgress(calculatedProgress);

    if (calculatedProgress === 100) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
      enqueueSnackbar('🎉 Você completou todo o setup!', {
        variant: 'success',
        autoHideDuration: 3000
      });
      addBadge('rocket');
    }
  }, [completedModules]);

  useEffect(() => {
    if (completedModules.length > 0) {
      const interval = setInterval(() => {
        setLiveData(prev => ({
          leads: prev.leads + (completedModules.includes('createLeads') ? Math.floor(Math.random() * 2) : 0),
          views: prev.views + (completedModules.includes('createLeads') ? Math.floor(Math.random() * 5) : 0),
          conversions: prev.conversions + (completedModules.includes('automation') ? Math.floor(Math.random() * 1) : 0)
        }));
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [completedModules]);

  const addBadge = (badgeType) => {
    if (!unlockedBadges.includes(badgeType)) {
      setUnlockedBadges([...unlockedBadges, badgeType]);
      enqueueSnackbar(
        <Box display="flex" alignItems="center">
          <Trophy size={20} style={{ marginRight: 8 }} />
          <span>Novo emblema desbloqueado!</span>
        </Box>,
        { variant: 'success', autoHideDuration: 3000 }
      );
    }
  };

  const handleModuleComplete = (moduleName) => {
    if (!completedModules.includes(moduleName)) {
      setCompletedModules([...completedModules, moduleName]);

      let message = '';
      let emoji = '✅';

      switch(moduleName) {
        case 'createLeads':
          message = 'Página ativada! Primeiros leads chegando...';
          emoji = '📈';
          addBadge('page-creator');
          break;
        case 'automation':
          message = 'Automação ligada! Seu marketing agora trabalha 24/7';
          emoji = '⚡';
          addBadge('automation-pro');
          break;
        case 'crm':
          message = 'CRM pronto! Organize seus leads agora';
          emoji = '👥';
          addBadge('crm-expert');
          break;
      }

      enqueueSnackbar(
        <Box display="flex" alignItems="center">
          <span style={{ marginRight: 8 }}>{emoji}</span>
          <span>{message}</span>
        </Box>,
        { variant: 'success', autoHideDuration: 3000 }
      );

      setUserPoints(prev => prev + 20);
    }
  };

  const getNextStep = () => {
    if (!completedModules.includes('marketingAi')) return 'marketingAi';
    if (!completedModules.includes('createLeads')) return 'createLeads';
    if (!completedModules.includes('automation')) return 'automation';
    if (!completedModules.includes('crm')) return 'crm';
    if (!completedModules.includes('funnel')) return 'funnel';
    return null;
  };

  const GlassCard = styled(Card)(({ theme }) => ({
    background: `linear-gradient(135deg, ${alpha('#578acd', 0.15)} 0%, ${alpha('#fff', 0.2)} 100%)`,
    backdropFilter: 'blur(12px)',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.1)',
    overflow: 'hidden',
    maxHeight:'160px',
    minHeight:'160px',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 12px 40px 0 rgba(31, 38, 135, 0.2)'
    }
  }));

  const DisabledCard = styled(GlassCard)(({ theme }) => ({
    opacity: 0.6,
    maxHeight:'160px',
    minHeight:'160px',
    '&:hover': {
      transform: 'none',
      boxShadow: 'none'
    }
  }));

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
    icon: <RobotOutlined size={24} color={theme.palette.text.disabled} />,
    title: t("marketing.chatbot"),
    description: t("marketing.chatbot_desc"),
    module: "chatbot",
    color: theme.palette.text.disabled,
    completed: isModuleCompleted("chatbot"),
    disabled: false,
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

  if (module === 'createLeads') {
    return <MobileCapturePages
    activeCompany={props.activeCompany}
    setModule={setModule}
    onComplete={() => handleModuleComplete('createLeads')}
    liveData={liveData} />;
  } else if (module === 'automation') {
    return <AutomationDashboard activeCompany={props.activeCompany} setModule={setModule} onComplete={() => handleModuleComplete('automation')} />;
  } else if (module === 'social-media') {
    return <SocialMediaDashboard activeCompany={props.activeCompany} />;
  } else if (module === 'marketingAi') {
    return <PremiumMarketingAssistantMobile activeCompany={props.activeCompany} setModule={setModule} onComplete={() => handleModuleComplete('marketingAi')} />;
  } else if (module === 'crm') {
    return <CRMAppMobile activeCompany={props.activeCompany} setModule={setModule} onComplete={() => handleModuleComplete('crm')} />;
  } else if (module === 'funnel') {
    return <SalesFunnel />;
  }else if (module === 'chatbot') {
    return <ChatbotManager activeCompany={props.activeCompany} setModule={setModule} />;
  }

  return (
    <Box sx={{
      pb: 7,
      background: 'linear-gradient(180deg, #f8faff 0%, #ffffff 100%)',
      minHeight: '100vh'
    }}>
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={isSmallScreen ? 200 : 400}
        />
      )}

      <Box sx={{ p: 2 }}>
      {getNextStep() && (
        <NextStepIndicator>
          <PulseDot />
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
              {t("marketing.nextStep")}
            </Typography>
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
              {t(`marketing.nextStepDescription.${getNextStep()}`)}
            </Typography>
          </Box>
        </NextStepIndicator>
      )}
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


        <Grid container spacing={2} sx={{ mb: 2 }}>
          {[
            { value: glance?.views, label: t("marketing.views"), icon: <BarChart2 size={16} />, color: '#578acd' },
            { value: glance?.leads, label: t("marketing.leads"), icon: <Users size={16} />, color: '#4caf50' },
            { value: 0, label: t("marketing.conversions"), icon: <Zap size={16} />, color: '#ff9800' }
          ].map((stat, index) => (
            <Grid item xs={4} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + (index * 0.1) }}
              >
                <GlassCard sx={{minHeight:'110px', maxHeight:'110px'}}>
                  <CardContent sx={{ p: 1, textAlign: 'center' }}>
                    <Avatar sx={{
                      bgcolor: alpha(stat.color, 0.1),
                      width: 32,
                      height: 32,
                      mb: 0.5,
                      margin: '0 auto',
                      color: stat.color
                    }}>
                      {stat.icon}
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {stat.label}
                    </Typography>
                  </CardContent>
                </GlassCard>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Seção de Ferramentas */}
        <Typography variant="subtitle1" sx={{
          fontWeight: 600,
          mb: 1.5,
          mt: 2,
          display: 'flex',
          alignItems: 'center'
        }}>
          <Zap size={18} style={{ marginRight: 8 }} color="#578acd" />
          {t("marketing.tools")}
        </Typography>

        <Grid container spacing={2}>
        {cards.map((card, index) => (
          <Grid item xs={6} key={index}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index }}
              whileTap={{ scale: 0.95 }}
              style={{ position: 'relative' }}
            >
              {card.disabled ? (
                <DisabledCard onClick={() => {
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
                  {card.comingSoon && <ComingSoonBadge>{t("general.comingSoon")}</ComingSoonBadge>}
                  <CardContent sx={{ p: 1.5 }}>
                    <Badge
                      overlap="circular"
                      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                      badgeContent={card.comingSoon ? null : <Lock size={12} />}
                    >
                      <Avatar sx={{
                        bgcolor: alpha(card.color, 0.1),
                        width: 36,
                        height: 36,
                        mb: 1,
                        color: card.color
                      }}>
                        {card.icon}
                      </Avatar>
                    </Badge>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {card.title}
                    </Typography>
                    <Typography variant="caption" sx={{
                      color: 'text.secondary',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {card.description}
                    </Typography>
                  </CardContent>
                </DisabledCard>
              ) : (
                <GlassCard
                  sx={{
                    borderTop: isModuleCompleted(card.module)
                      ? `5px solid ${theme.palette.success.main}`
                      : isModuleUnlocked(card.module)
                        ? `5px solid ${theme.palette.primary.main}`
                        : '5px solid transparent'
                  }}
                  onClick={() => setModule(card.module)}
                >
                  {card.module === getNextStep() && (
                  <Chip
                      label={t("marketing.currentStep")}
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 12.3,
                        right: 12,
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        border: `1px solid ${alpha(theme.palette.primary.main, 0.5)}`,
                        color: theme.palette.primary.main,
                        fontWeight: 700,
                        fontSize: '0.6rem',
                        textTransform: 'uppercase',
                        zIndex: 2,
                        animation: 'pulse 2s infinite',
                        '@keyframes pulse': {
                          '0%': {
                            boxShadow: `0 0 0 0 ${alpha(theme.palette.primary.main, 0.4)}`
                          },
                          '70%': {
                            boxShadow: `0 0 0 8px ${alpha(theme.palette.primary.main, 0)}`
                          },
                          '100%': {
                            boxShadow: `0 0 0 0 ${alpha(theme.palette.primary.main, 0)}`
                          }
                        }
                      }}
                    />
                  )}
                  {card.comingSoon && <ComingSoonBadge>{t("general.comingSoon")}</ComingSoonBadge>}
                  <CardContent sx={{ p: 1.5 }}>
                    <Avatar sx={{
                      bgcolor: alpha(card.color, 0.1),
                      width: 36,
                      height: 36,
                      mb: 1,
                      color: card.color
                    }}>
                      {card.icon}
                    </Avatar>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {card.title}
                    </Typography>
                    <Typography variant="caption" sx={{
                      color: 'text.secondary',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {card.description}
                    </Typography>
                  </CardContent>
                </GlassCard>
              )}
            </motion.div>
          </Grid>
        ))}
        </Grid>
      </Box>

      {/* Bottom Navigation */}
      <BottomNavigation
        value={navValue}
        onChange={(event, newValue) => setNavValue(newValue)}
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          bgcolor: '#fff',
          boxShadow: '0 -2px 10px rgba(0,0,0,0.05)',
          borderTop: '1px solid rgba(0,0,0,0.05)'
        }}
      >
        <BottomNavigationAction
          value="home"
          icon={<Home size={20} />}
          sx={{ minWidth: 0 }}
        />
        <BottomNavigationAction
          value="analytics"
          icon={
            <Badge badgeContent={unlockedBadges.length} color="primary">
              <BarChart2 size={20} />
            </Badge>
          }
          sx={{ minWidth: 0 }}
        />
        <BottomNavigationAction
          value="settings"
          icon={<Settings size={20} />}
          sx={{ minWidth: 0 }}
        />
      </BottomNavigation>
    </Box>
  );
};

export default MobileMarketingDashboard;