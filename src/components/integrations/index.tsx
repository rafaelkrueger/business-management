import React, { useEffect, useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
  Avatar,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { FaFacebookF, FaInstagram, FaWhatsapp, FaLinkedinIn, FaTwitter, FaGoogle, FaYoutube, FaEnvelope } from 'react-icons/fa';
import FacebookService from '../../services/facebook.service.ts';
import InstagramService from '../../services/instagram.service.ts';
import WhatsappService from '../../services/whatsapp.service.ts';
import LinkedinService from '../../services/linkedin.service.ts';
import TwitterService from '../../services/twitter.service.ts';
import YouTubeService from '../../services/youtube.service.ts';
import EmailService from '../../services/email.service.ts';
import http from '../../services/http-business.ts';

type IntegrationConfig = {
  key: string;
  name: string;
  color: string;
  icon: JSX.Element;
  checkStatus: (companyId: string) => Promise<any>;
  connect: (companyId: string) => Promise<any>;
  disconnect: (companyId: string) => Promise<any>;
};

const integrations: IntegrationConfig[] = [
  {
    key: 'facebook',
    name: 'Facebook',
    color: '#1877F2',
    icon: <FaFacebookF size={40} />,
    checkStatus: FacebookService.checkFacebookStatus,
    connect: (companyId) => FacebookService.getAuthLink(companyId),
    disconnect: (companyId) => http.delete(`/facebook/disconnect?companyId=${companyId}`),
  },
  {
    key: 'instagram',
    name: 'Instagram',
    color: '#E1306C',
    icon: <FaInstagram size={40} />,
    checkStatus: InstagramService.checkInstagramStatus,
    connect: (companyId) => InstagramService.getAuthLink(companyId),
    disconnect: (companyId) => http.delete(`/instagram/disconnect?companyId=${companyId}`),
  },
  {
    key: 'whatsapp',
    name: 'WhatsApp',
    color: '#25D366',
    icon: <FaWhatsapp size={40} />,
    checkStatus: WhatsappService.checkWhatsAppStatus,
    connect: (companyId) => WhatsappService.getQrCode(companyId),
    disconnect: (companyId) => http.delete(`/whatsapp/disconnect?companyId=${companyId}`),
  },
  {
    key: 'linkedin',
    name: 'LinkedIn',
    color: '#0A66C2',
    icon: <FaLinkedinIn size={40} />,
    checkStatus: LinkedinService.checkLinkedinStatus,
    connect: (companyId) => LinkedinService.getAuthLink(companyId),
    disconnect: (companyId) => http.delete(`/linkedin/disconnect?companyId=${companyId}`),
  },
  {
    key: 'twitter',
    name: 'Twitter',
    color: '#1DA1F2',
    icon: <FaTwitter size={40} />,
    checkStatus: TwitterService.checkTwitterStatus,
    connect: (companyId) => TwitterService.getAuthLink(companyId),
    disconnect: (companyId) => http.delete(`/twitter/disconnect?companyId=${companyId}`),
  },
  {
    key: 'google',
    name: 'Google',
    color: '#4285F4',
    icon: <FaGoogle size={40} />,
    checkStatus: (companyId) => http.get(`/google/status?companyId=${companyId}`),
    connect: (companyId) => http.get(`/google/auth-link?companyId=${companyId}`),
    disconnect: (companyId) => http.delete(`/google/disconnect?companyId=${companyId}`),
  },
  {
    key: 'youtube',
    name: 'YouTube',
    color: '#FF0000',
    icon: <FaYoutube size={40} />,
    checkStatus: YouTubeService.checkYoutubeStatus,
    connect: (companyId) => YouTubeService.getAuthLink(companyId),
    disconnect: (companyId) => http.delete(`/youtube/disconnect?companyId=${companyId}`),
  },
  {
    key: 'email',
    name: 'Email',
    color: '#555555',
    icon: <FaEnvelope size={40} />,
    checkStatus: (companyId) => EmailService.getAccount(companyId),
    connect: (companyId) => EmailService.createAccount({ companyId }),
    disconnect: (companyId) => http.delete(`/email/disconnect?companyId=${companyId}`),
  },
];

const Integrations: React.FC<{ activeCompany: string }> = ({ activeCompany }) => {
  const { t } = useTranslation();
  const [status, setStatus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!activeCompany) return;
    integrations.forEach(async (integration) => {
      try {
        const result = await integration.checkStatus(activeCompany);
        setStatus((prev) => ({ ...prev, [integration.key]: !!result }));
      } catch (err) {
        setStatus((prev) => ({ ...prev, [integration.key]: false }));
      }
    });
  }, [activeCompany]);

  const handleConnect = async (integration: IntegrationConfig) => {
    const response = await integration.connect(activeCompany);
    if (response?.data) {
      window.location.href = response.data;
    }
  };

  const handleDisconnect = async (integration: IntegrationConfig) => {
    await integration.disconnect(activeCompany);
    setStatus((prev) => ({ ...prev, [integration.key]: false }));
  };

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
        {t('integrations')}
      </Typography>
      <Grid container spacing={4}>
        {integrations.map((integration) => {
          const isConnected = status[integration.key];
          return (
            <Grid item xs={12} sm={6} md={4} key={integration.key}>
              <Card
                sx={{
                  minWidth: 275,
                  borderRadius: 4,
                  boxShadow: 3,
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 },
                }}
              >
                <CardContent sx={{ textAlign: 'center' }}>
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      mb: 2,
                      mx: 'auto',
                      bgcolor: integration.color,
                      color: 'white',
                    }}
                  >
                    {integration.icon}
                  </Avatar>
                  <Typography variant="h5" component="div" sx={{ mb: 2 }}>
                    {integration.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {isConnected
                      ? t('integration.connected')
                      : t('integration.disconnected')}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
                  {isConnected ? (
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDisconnect(integration)}
                    >
                      {t('integration.disconnect')}
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      sx={{
                        borderRadius: 2,
                        bgcolor: integration.color,
                        '&:hover': { bgcolor: `${integration.color}CC` },
                      }}
                      onClick={() => handleConnect(integration)}
                    >
                      {t('integration.connect')}
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
};

export default Integrations;
