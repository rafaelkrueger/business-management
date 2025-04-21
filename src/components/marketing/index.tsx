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
  alpha
} from "@mui/material";
import { Line, Bar } from "react-chartjs-2";
import {
  Brain,
  FileText,
  Zap
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import LeadGeneration from "./create-leads/index.tsx";
import React from "react";
import CapturePages from "./capture-pages/index.tsx";
import AutomationDashboard from "./automation/index.tsx";
import SocialMediaDashboard from "./social-media/index.tsx";
import StyledAIAssistant from "./ai/index.tsx";
import { useSnackbar } from 'notistack';

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


const MarketingDashboard: React.FC<{ activeCompany }> = ({ ...props }) => {
  const { t } = useTranslation();
  const [module, setModule] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const { enqueueSnackbar } = useSnackbar();

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
      label: "Conversões",
      data: [0, 0, 0, 0, 0],
      backgroundColor: alpha(theme.palette.success.main, 0.7),
      borderRadius: 4,
      borderWidth: 0,
      hoverBackgroundColor: theme.palette.success.main
    }]
  });

  const cards = [
    {
      icon: <Zap size={24} color={theme.palette.primary.main} />,
      title: t("marketing.automation"),
      description: t("marketing.automation_desc"),
      module: "automation",
      color: theme.palette.primary.main
    },
    {
      icon: <FileText size={24} color={theme.palette.error.light} />,
      title: t("marketing.landing_pages"),
      description: t("marketing.landing_pages_desc"),
      module: "createLeads",
      color: theme.palette.secondary.main
    },
    {
      icon: <Brain size={24} color={"#B0B0B0"} />,
      title: t("marketing.ai"),
      description: t("marketing.aiDescription"),
      module: "",
      color: "#e0e0e0",
      disabled: true
    },
    {
      icon: <Zap size={24} color={"#B0B0B0"} />,
      title: t("marketing.ab_tests"),
      description: t("marketing.ab_tests_desc"),
      module: "",
      color: "#e0e0e0",
      disabled: true
    },
    {
      icon: <FileText size={24} color={"#B0B0B0"} />,
      title: t("marketing.funnels"),
      description: t("marketing.funnels_desc"),
      module: "",
      color: "#e0e0e0",
      disabled: true
    },
    {
      icon: <Brain size={24} color={"#B0B0B0"} />,
      title: t("marketing.crm"),
      description: t("marketing.crm_desc"),
      module: "",
      color: "#e0e0e0",
      disabled: true
    },
    {
      icon: <Zap size={24} color={"#B0B0B0"} />,
      title: t("marketing.campaign_manager"),
      description: t("marketing.campaign_manager_desc"),
      module: "",
      color: "#e0e0e0",
      disabled: true
    }
  ];


  const getCardSize = () => {
    if (isMobile) return 12;
    if (isTablet) return 6;
    return 3;
  };

  return (
    <Box sx={{
      padding: isMobile ? 2 : 4,
      marginTop: isMobile ? '50px' : 'unset',
      background: theme.palette.mode === 'light'
        ? 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)'
        : 'linear-gradient(135deg, #121212 0%, #1e1e1e 100%)',
      minHeight: '100vh'
    }}>
      {module === '' ? (
        <>
          <Fade in timeout={500}>
            <Typography variant="h4" component="h1" sx={{
              mb: 4,
              fontWeight: 700,
              color: 'rgba(0,0,0,0.6)',
              textAlign: 'left'
            }}>
              {t("marketing.title")}
            </Typography>
          </Fade>

          <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500, color:'rgba(0,0,0,0.6)' }}>
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
                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
                  {t("marketing.conversions")}
                </Typography>
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
                <div onClick={() => enqueueSnackbar('This module is under maintenance', { variant: 'info' })}>
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
                <AnimatedCard onClick={() => setModule(card.module || '')}>
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
              </Zoom>
            )}
          </Grid>
        ))}
          </Grid>
        </>
      ) : module === 'createLeads' ? (
        <CapturePages activeCompany={props.activeCompany} setModule={setModule} />
      ) : module === 'automation' ? (
        <AutomationDashboard activeCompany={props.activeCompany} setModule={setModule} />
      ) : module === 'social-media' ? (
        <SocialMediaDashboard activeCompany={props.activeCompany} />
      ) : module === 'marketingAi' ? (
        <StyledAIAssistant/>
      ) : null}
    </Box>
  );
};

export default MarketingDashboard;