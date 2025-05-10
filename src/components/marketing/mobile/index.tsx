import {
  Card,
  CardContent,
  Typography,
  Grid,
  useTheme,
  Box,
  Fade,
  Grow,
  Zoom,
  styled,
  alpha,
  IconButton,
  Avatar,
  Divider,
  BottomNavigation,
  BottomNavigationAction
} from "@mui/material";
import { Line, Bar, Pie } from "react-chartjs-2";
import {
  Brain,
  FileText,
  Layout,
  Users,
  Zap,
  Home,
  BarChart2,
  Settings,
  Bell,
  ChevronLeft
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSnackbar } from 'notistack';
import { motion } from 'framer-motion';
import LeadGeneration from "./create-leads/index.tsx";
import CapturePages from "../capture-pages/index.tsx";
import AutomationDashboard from "../automation/index.tsx";
import SocialMediaDashboard from "../social-media/index.tsx";
import StyledAIAssistant from "../ai/index.tsx";
import CRMApp from "../crm/index.tsx";
import SalesFunnel from "../funnel/index.tsx";

const MobileMarketingDashboard: React.FC<{ activeCompany }> = ({ ...props }) => {
  const { t } = useTranslation();
  const [module, setModule] = useState('');
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const [navValue, setNavValue] = useState('home');

  // Custom styled components
  const GlassCard = styled(Card)(({ theme }) => ({
    background: `linear-gradient(135deg, ${alpha('#578acd', 0.15)} 0%, ${alpha('#fff', 0.2)} 100%)`,
    backdropFilter: 'blur(12px)',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.1)',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 12px 40px 0 rgba(31, 38, 135, 0.2)'
    }
  }));

  const DisabledCard = styled(GlassCard)(({ theme }) => ({
    opacity: 0.6,
    '&:hover': {
      transform: 'none',
      boxShadow: 'none'
    }
  }));

  // Chart data
  const [lineData] = useState({
    labels: ["Jan", "Fev", "Mar", "Abr", "Mai"],
    datasets: [
      {
        label: t("marketing.views"),
        data: [0, 0, 0, 0, 0],
        borderColor: '#578acd',
        backgroundColor: alpha('#578acd', 0.2),
        tension: 0.4,
        borderWidth: 2,
        pointBackgroundColor: '#578acd',
        pointRadius: 4
      },
      {
        label: t("marketing.clicks"),
        data: [0, 0, 0, 0, 0],
        borderColor: '#4caf50',
        backgroundColor: alpha('#4caf50', 0.2),
        tension: 0.4,
        borderWidth: 2,
        pointBackgroundColor: '#4caf50',
        pointRadius: 4
      }
    ]
  });

  const [barData] = useState({
    labels: ["Jan", "Fev", "Mar", "Abr", "Mai"],
    datasets: [{
      label: t("marketing.conversions"),
      data: [0, 0, 0, 0, 0],
      backgroundColor: alpha('#578acd', 0.7),
      borderRadius: 8
    }]
  });

  const [pieData] = useState({
    labels: [
      t("marketing.automation"),
      t("marketing.landing_pages"),
      t("marketing.crmTitle"),
      t("marketing.ai")
    ],
    datasets: [{
      data: [0, 0, 0, 0],
      backgroundColor: [
        alpha('#578acd', 0.8),
        alpha('#4caf50', 0.8),
        alpha('#ff9800', 0.8),
        alpha('#9c27b0', 0.8)
      ],
      borderWidth: 0
    }]
  });

  // Dashboard cards
  const cards = [
    {
      icon: <Zap size={20} color="#578acd" />,
      title: t("marketing.automation"),
      description: t("marketing.automation_desc"),
      module: "automation",
      color: '#578acd'
    },
    {
      icon: <Layout size={20} color="#4caf50" />,
      title: t("marketing.landing_pages"),
      description: t("marketing.landing_pages_desc"),
      module: "createLeads",
      color: '#4caf50',
    },
    {
      icon: <Users size={20} color="#ff9800" />,
      title: t("marketing.crmTitle"),
      description: t("marketing.crm_desc"),
      module: "crm",
      color: '#ff9800',
    },
    {
      icon: <FileText size={20} color="#f44336" />,
      title: t("marketing.funnels"),
      description: t("marketing.funnels_desc"),
      module: "funnel",
      color: '#f44336',
      disabled: true
    },
    {
      icon: <Brain size={20} color="#9c27b0" />,
      title: t("marketing.ai"),
      description: t("marketing.aiDescription"),
      module: "marketingAi",
      color: "#9c27b0",
    }
  ];

  // Stats data
  const stats = [
    { value: "0", label: t("marketing.visits"), change: "+0%" },
    { value: "0", label: t("marketing.leads"), change: "+0%" },
    { value: "0%", label: t("marketing.conversion"), change: "+0%" }
  ];

  if (module === 'createLeads') {
    return <CapturePages activeCompany={props.activeCompany} setModule={setModule} />;
  } else if (module === 'automation') {
    return <AutomationDashboard activeCompany={props.activeCompany} setModule={setModule} />;
  } else if (module === 'social-media') {
    return <SocialMediaDashboard activeCompany={props.activeCompany} />;
  } else if (module === 'marketingAi') {
    return <StyledAIAssistant activeCompany={props.activeCompany} setModule={setModule} />;
  } else if (module === 'crm') {
    return <CRMApp activeCompany={props.activeCompany} setModule={setModule} />;
  } else if (module === 'funnel') {
    return <SalesFunnel />;
  } else if (module) {
    return (
      <Box sx={{ p: 2, height: '100vh' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton onClick={() => setModule('')} sx={{ mr: 1 }}>
            <ChevronLeft size={24} />
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {cards.find(c => c.module === module)?.title || t("marketing.module")}
          </Typography>
        </Box>
        <Box sx={{
          bgcolor: 'background.paper',
          borderRadius: 3,
          p: 3,
          textAlign: 'center',
          boxShadow: theme.shadows[1]
        }}>
          <Typography color="text.secondary">
            {t("marketing.module_content")}
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{
      pb: 7,
      background: 'linear-gradient(180deg, #f8faff 0%, #ffffff 100%)',
      minHeight: '100vh'
    }}>

      {/* Main Content */}
      <Box sx={{ p: 2 }}>
        {/* Stats Overview */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          {stats.map((stat, index) => (
            <Grid item xs={4} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard>
                  <CardContent sx={{ p: 1.5, textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#578acd' }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {stat.label}
                    </Typography>
                    <Typography variant="caption" sx={{
                      display: 'block',
                      color: stat.change.startsWith('+') ? '#4caf50' : '#f44336',
                      fontWeight: 500
                    }}>
                      {stat.change}
                    </Typography>
                  </CardContent>
                </GlassCard>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Mini Charts */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <GlassCard>
                <CardContent sx={{ p: 1.5 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                    {t("marketing.performance")}
                  </Typography>
                  <Box sx={{ height: 150 }}>
                    <Line
                      data={lineData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        scales: {
                          x: { grid: { display: false } },
                          y: { grid: { color: 'rgba(0,0,0,0.05)' } }
                        }
                      }}
                    />
                  </Box>
                </CardContent>
              </GlassCard>
            </motion.div>
          </Grid>
          <Grid item xs={12} sm={6}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <GlassCard>
                <CardContent sx={{ p: 1.5 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                    {t("marketing.conversions")}
                  </Typography>
                  <Box sx={{ height: 150 }}>
                    <Bar
                      data={barData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        scales: {
                          x: { grid: { display: false } },
                          y: { grid: { color: 'rgba(0,0,0,0.05)' } }
                        }
                      }}
                    />
                  </Box>
                </CardContent>
              </GlassCard>
            </motion.div>
          </Grid>
        </Grid>

        {/* Tools Section */}
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
              >
                {card.disabled ? (
                  <DisabledCard onClick={() => enqueueSnackbar(t("marketing.module_maintenance"), { variant: 'info' })}>
                    <CardContent sx={{ p: 2 }}>
                      <Avatar sx={{
                        bgcolor: alpha(card.color, 0.1),
                        width: 36,
                        height: 36,
                        mb: 1
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
                  </DisabledCard>
                ) : (
                  <GlassCard onClick={() => setModule(card.module)}>
                    <CardContent sx={{ p: 2 }}>
                      <Avatar sx={{
                        bgcolor: alpha(card.color, 0.1),
                        width: 36,
                        height: 36,
                        mb: 1
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
          icon={<BarChart2 size={20} />}
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