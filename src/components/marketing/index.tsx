import { Card, CardContent, Typography, Grid, useMediaQuery, useTheme } from "@mui/material";
import { Line, Bar } from "react-chartjs-2";
import { Target, Globe, Mail, DollarSign, MessageCircle, Users, BarChart2, FileText, Zap } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import LeadGeneration from "./create-leads/index.tsx";
import React from "react";
import CapturePages from "./capture-pages/index.tsx";
import AutomationDashboard from "./automation/index.tsx";
import SocialMediaDashboard from "./social-media/index.tsx";

const MarketingDashboard: React.FC<{ activeCompany }> = ({ ...props }) => {
  const { t } = useTranslation();
  const [module, setModule] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  const [lineData] = useState({
    labels: ["Jan", "Fev", "Mar", "Abr", "Mai"],
    datasets: [
      { label: "Visualizações", data: [0, 0, 0, 0, 0], borderColor: "blue", backgroundColor: "rgba(0, 0, 255, 0.2)" },
      { label: "Cliques", data: [0, 0, 0, 0, 0], borderColor: "red", backgroundColor: "rgba(255, 0, 0, 0.2)" }
    ]
  });

  const [barData] = useState({
    labels: ["Jan", "Fev", "Mar", "Abr", "Mai"],
    datasets: [{ label: "Conversões", data: [0, 0, 0, 0, 0], backgroundColor: "green" }]
  });

  const cards = [
    { icon: <Zap size={24} />, title: t("marketing.automation"), description: t("marketing.automation_desc"), module: "automation" },
    { icon: <FileText size={24} />, title: t("marketing.landing_pages"), description: t("marketing.landing_pages_desc"), module: "createLeads" },
    // { icon: <MessageCircle size={24} />, title: t("marketing.social"), description: t("marketing.social_desc"), module: "social-media" },
    // { icon: <Target size={24} />, title: t("marketing.paid_traffic"), description: t("marketing.paid_traffic_desc") },
    // { icon: <Globe size={24} />, title: t("marketing.seo"), description: t("marketing.seo_desc") },
    // { icon: <DollarSign size={24} />, title: t("marketing.community"), description: t("marketing.community_desc") },
    // { icon: <BarChart2 size={24} />, title: t("marketing.ab_testing"), description: t("marketing.ab_testing_desc") },
  ];

  // Determinar o tamanho dos cards baseado no dispositivo
  const getCardSize = () => {
    if (isMobile) return 12; // 1 card por linha em mobile
    if (isTablet) return 6;  // 2 cards por linha em tablet
    return 3;                // 4 cards por linha em desktop
  };

  return (
    <div style={{ padding: isMobile ? '10px' : '20px', marginTop: isMobile ? '50px' : 'unset' }}>
      {module === '' ? (
        <>
          <Grid container spacing={2} sx={{ marginBottom: 2 }}>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6">{t("marketing.performance")}</Typography>
                  <div style={{
                    width: "100%",
                    height: isMobile ? "200px" : "300px",
                    margin: "0 auto"
                  }}>
                    <Line
                      data={lineData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: isMobile ? 'bottom' : 'top'
                          }
                        }
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6">{t("marketing.conversions")}</Typography>
                  <div style={{
                    width: "100%",
                    height: isMobile ? "200px" : "300px",
                    margin: "0 auto"
                  }}>
                    <Bar
                      data={barData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: isMobile ? 'bottom' : 'top'
                          }
                        }
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Grid container spacing={2} sx={{ marginBottom: isMobile ? '20px' : '50px' }}>
            {cards.map((card, index) => (
              <Grid item xs={getCardSize()} key={index}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    minHeight: isMobile ? 'auto' : '180px',
                    height: '100%',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'scale(1.02)'
                    }
                  }}
                  onClick={() => setModule(card.module || '')}
                >
                  <CardContent>
                    <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {card.icon} {card.title}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {card.description}
                    </Typography>
                  </CardContent>
                </Card>
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
      ) : null}
    </div>
  );
};

export default MarketingDashboard;