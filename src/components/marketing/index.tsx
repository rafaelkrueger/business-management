import { Card, CardContent, Typography, Grid } from "@mui/material";
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
    { icon: <FileText size={24} />, title: t("marketing.landing_pages"), description: t("marketing.landing_pages_desc"), module: "createLeads" },
    { icon: <Zap size={24} />, title: t("marketing.automation"), description: t("marketing.automation_desc"), module: "automation" },
    { icon: <MessageCircle size={24} />, title: t("marketing.social"), description: t("marketing.social_desc"), module: "social-media" },
    { icon: <Target size={24} />, title: t("marketing.paid_traffic"), description: t("marketing.paid_traffic_desc") },
    { icon: <Globe size={24} />, title: t("marketing.seo"), description: t("marketing.seo_desc") },
    { icon: <DollarSign size={24} />, title: t("marketing.community"), description: t("marketing.community_desc") },
    { icon: <BarChart2 size={24} />, title: t("marketing.ab_testing"), description: t("marketing.ab_testing_desc") },
  ];

  return (
    <>
      {module === '' ? (
        <div style={{ display: "grid", gap: "20px", padding: "20px" }}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{t("marketing.performance")}</Typography>
                  <div style={{ width: "100%", maxWidth: "600px", height: "300px" }}>
                    <Line data={lineData} options={{ responsive: true, maintainAspectRatio: false }} />
                  </div>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{t("marketing.conversions")}</Typography>
                  <div style={{ width: "100%", maxWidth: "600px", height: "300px" }}>
                    <Bar data={barData} options={{ responsive: true, maintainAspectRatio: false }} />
                  </div>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Grid sx={{marginBottom:'50px'}} container spacing={2}>
            {cards.map((card, index) => (
              <Grid item xs={3} key={index}>
                <Card sx={{ cursor: 'pointer', minHeight:'180px', maxHeight:'180px' }} onClick={() => setModule(card.module || '')}>
                  <CardContent>
                    <Typography variant="h6">{card.icon} {card.title}</Typography>
                    <Typography variant="body2">{card.description}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </div>
      ) : module === 'createLeads' ? (
        <CapturePages activeCompany={props.activeCompany} setModule={setModule} />
      ) : module === 'automation' ? (
        <AutomationDashboard activeCompany={props.activeCompany} />
      ) : module === 'social-media' ? (
        <SocialMediaDashboard activeCompany={props.activeCompany} />
      ) : null}
    </>
  );
};

export default MarketingDashboard;