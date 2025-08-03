import React, { JSX, useEffect, useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  Box,
  Chip,
  Divider,
  IconButton,
  Tooltip,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  useMediaQuery,
  Menu,
  MenuItem
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
  FaFacebookF, FaInstagram, FaWhatsapp, FaLinkedinIn,
  FaTwitter, FaGoogle, FaYoutube, FaEnvelope,
  FaCheck, FaTimes, FaPlug, FaUnlink, FaEllipsisV,
  FaInfoCircle
} from 'react-icons/fa';
import FacebookService from '../../services/facebook.service.ts';
import InstagramService from '../../services/instagram.service.ts';
import WhatsappService from '../../services/whatsapp.service.ts';
import LinkedinService from '../../services/linkedin.service.ts';
import TwitterService from '../../services/twitter.service.ts';
import YouTubeService from '../../services/youtube.service.ts';
import EmailService from '../../services/email.service.ts';
import http from '../../services/http-business.ts';
import { motion } from 'framer-motion';

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
    icon: <FaFacebookF size={24} />,
    checkStatus: FacebookService.checkFacebookStatus,
    connect: (companyId) => FacebookService.getAuthLink(companyId),
    disconnect: (companyId) => http.delete(`/facebook/disconnect?companyId=${companyId}`),
  },
  {
    key: 'instagram',
    name: 'Instagram',
    color: '#E1306C',
    icon: <FaInstagram size={24} />,
    checkStatus: InstagramService.checkInstagramStatus,
    connect: (companyId) => InstagramService.getAuthLink(companyId),
    disconnect: (companyId) => http.delete(`/instagram/disconnect?companyId=${companyId}`),
  },
  {
    key: 'whatsapp',
    name: 'WhatsApp',
    color: '#25D366',
    icon: <FaWhatsapp size={24} />,
    checkStatus: WhatsappService.checkWhatsAppStatus,
    connect: (companyId) => WhatsappService.getQrCode(companyId),
    disconnect: (companyId) => http.delete(`/whatsapp/disconnect?companyId=${companyId}`),
  },
  {
    key: 'linkedin',
    name: 'LinkedIn',
    color: '#0A66C2',
    icon: <FaLinkedinIn size={24} />,
    checkStatus: LinkedinService.checkLinkedinStatus,
    connect: (companyId) => LinkedinService.getAuthLink(companyId),
    disconnect: (companyId) => http.delete(`/linkedin/disconnect?companyId=${companyId}`),
  },
  {
    key: 'twitter',
    name: 'Twitter',
    color: '#1DA1F2',
    icon: <FaTwitter size={24} />,
    checkStatus: TwitterService.checkTwitterStatus,
    connect: (companyId) => TwitterService.getAuthLink(companyId),
    disconnect: (companyId) => http.delete(`/twitter/disconnect?companyId=${companyId}`),
  },
  {
    key: 'google',
    name: 'Google',
    color: '#4285F4',
    icon: <FaGoogle size={24} />,
    checkStatus: (companyId) => http.get(`/google/status?companyId=${companyId}`),
    connect: (companyId) => http.get(`/google/auth-link?companyId=${companyId}`),
    disconnect: (companyId) => http.delete(`/google/disconnect?companyId=${companyId}`),
  },
  {
    key: 'youtube',
    name: 'YouTube',
    color: '#FF0000',
    icon: <FaYoutube size={24} />,
    checkStatus: YouTubeService.checkYoutubeStatus,
    connect: (companyId) => YouTubeService.getAuthLink(companyId),
    disconnect: (companyId) => http.delete(`/youtube/disconnect?companyId=${companyId}`),
  },
  {
    key: 'email',
    name: 'Email',
    color: '#555555',
    icon: <FaEnvelope size={24} />,
    checkStatus: (companyId) => EmailService.getAccount(companyId),
    connect: (companyId) => EmailService.createAccount({ companyId }),
    disconnect: (companyId) => http.delete(`/email/disconnect?companyId=${companyId}`),
  },
];

const IntegrationCard = ({
  integration,
  isConnected,
  handleConnect,
  handleDisconnect,
  openMenu,
  t
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        sx={{
          minWidth: 275,
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          background: 'linear-gradient(to bottom, #ffffff, #f8f9ff)',
          border: '1px solid #eef0f8',
          transition: 'all 0.3s ease',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          '&:hover': {
            boxShadow: '0 8px 25px rgba(87, 138, 205, 0.15)',
            transform: 'translateY(-3px)',
          },
        }}
      >
        <CardContent sx={{ pt: 3, pb: 2, flexGrow: 1, ml:4}}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center">
              <Avatar
                sx={{
                  width: 50,
                  height: 50,
                  mr: 2,
                  bgcolor: integration.color,
                  color: 'white',
                  boxShadow: `0 4px 12px ${integration.color}40`,
                }}
              >
                {integration.icon}
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight={600} color="text.primary">
                  {integration.name}
                </Typography>
              </Box>
            </Box>
          </Box>
        </CardContent>

        <Box sx={{ px: 0, pb: 0 }}>
{isConnected ? (
  <Button
    fullWidth
    variant="text"
    startIcon={<FaUnlink size={14} />}
    onClick={() => handleDisconnect(integration)}
    sx={{
      py: 1,
      fontWeight: 500,
      color: '#f44336',
      '&:hover': {
        backgroundColor: 'rgba(244, 67, 54, 0.04)',
      },
      '& .MuiButton-startIcon': {
        marginRight: '6px',
        transition: 'transform 0.2s ease'
      },
      '&:hover .MuiButton-startIcon': {
        transform: 'rotate(-15deg)'
      },
      position: 'relative',
      overflow: 'hidden',
      transition: 'all 0.3s ease'
    }}
  >
    {t('integration.disconnect')}
  </Button>
) : (
  <Button
    fullWidth
    variant="text"
    startIcon={<FaPlug size={14} />}
    onClick={() => handleConnect(integration)}
    sx={{
      py: 1,
      fontWeight: 500,
      color: '#578acd',
      '&:hover': {
        backgroundColor: 'rgba(87, 138, 205, 0.04)',
        color: '#3a6fb5',
      },
      '& .MuiButton-startIcon': {
        marginRight: '6px',
        transition: 'transform 0.2s ease'
      },
      '&:hover .MuiButton-startIcon': {
        transform: 'rotate(90deg)'
      },
      position: 'relative',
      overflow: 'hidden',
      transition: 'all 0.3s ease'
    }}
  >
    {t('integration.connect')}
  </Button>
)}
        </Box>
      </Card>
    </motion.div>
  );
};

const Integrations: React.FC<{ activeCompany: string }> = ({ activeCompany }) => {
  const { t } = useTranslation();
  const [status, setStatus] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [selectedIntegration, setSelectedIntegration] = useState<IntegrationConfig | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'connect' | 'disconnect' | 'info'>('info');
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'disconnecting' | 'idle'>('idle');

  useEffect(() => {
    if (!activeCompany) return;

    const fetchStatus = async () => {
      setLoading(true);
      const statuses: Record<string, boolean> = {};

      await Promise.all(integrations.map(async (integration) => {
        try {
          const result = await integration.checkStatus(activeCompany);
          statuses[integration.key] = !!result;
        } catch (err) {
          statuses[integration.key] = false;
        }
      }));

      setStatus(statuses);
      setLoading(false);
    };

    fetchStatus();
  }, [activeCompany]);

  const handleConnect = async (integration: IntegrationConfig) => {
    setConnectionStatus('connecting');
    try {
      const response = await integration.connect(activeCompany);
      if (response?.data) {
        window.location.href = response.data;
      }
    } catch (error) {
      console.error("Connection failed:", error);
    } finally {
      setConnectionStatus('idle');
      handleCloseDialog();
    }
  };

  const handleDisconnect = async (integration: IntegrationConfig) => {
    setConnectionStatus('disconnecting');
    try {
      await integration.disconnect(activeCompany);
      setStatus((prev) => ({ ...prev, [integration.key]: false }));
    } catch (error) {
      console.error("Disconnection failed:", error);
    } finally {
      setConnectionStatus('idle');
      handleCloseDialog();
    }
  };

  const openMenu = (event: React.MouseEvent<HTMLElement>, integration: IntegrationConfig) => {
    setSelectedIntegration(integration);
    setAnchorEl(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorEl(null);
  };

  const openDialog = (type: 'connect' | 'disconnect' | 'info') => {
    setDialogType(type);
    setDialogOpen(true);
    closeMenu();
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box mb={4}>
        <Typography variant="h4" fontWeight={700} sx={{ color: '#2d3748', mb: 1 }}>
          {t('integrations')}
        </Typography>
        <Typography variant="body1" sx={{ color: '#718096', maxWidth: 700 }}>
          {t('integrationsDescription')}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {integrations.map((integration) => {
          const isConnected = status[integration.key] || false;

          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={integration.key}>
              <IntegrationCard
                integration={integration}
                isConnected={isConnected}
                handleConnect={handleConnect}
                handleDisconnect={handleDisconnect}
                openMenu={openMenu}
                t={t}
              />
            </Grid>
          );
        })}
      </Grid>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={closeMenu}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => openDialog('info')}>
          <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 150 }}>
            <FaInfoCircle style={{ marginRight: 10, color: '#578acd' }} />
            <Typography>{t('integration.details')}</Typography>
          </Box>
        </MenuItem>
        <Divider />
        {status[selectedIntegration?.key || ''] ? (
          <MenuItem onClick={() => openDialog('disconnect')}>
            <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 150 }}>
              <FaUnlink style={{ marginRight: 10, color: '#f44336' }} />
              <Typography>{t('integration.disconnect')}</Typography>
            </Box>
          </MenuItem>
        ) : (
          <MenuItem onClick={() => openDialog('connect')}>
            <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 150 }}>
              <FaPlug style={{ marginRight: 10, color: '#4caf50' }} />
              <Typography>{t('integration.connect')}</Typography>
            </Box>
          </MenuItem>
        )}
      </Menu>

      {/* Confirmation Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ borderBottom: '1px solid #eee', pb: 2 }}>
          {dialogType === 'connect' && t('integration.confirmConnectTitle')}
          {dialogType === 'disconnect' && t('integration.confirmDisconnectTitle')}
          {dialogType === 'info' && t('integration.details')}
        </DialogTitle>

        <DialogContent sx={{ pt: 3 }}>
          {selectedIntegration && (
            <Box display="flex" alignItems="center" mb={3}>
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  mr: 2,
                  bgcolor: selectedIntegration.color,
                  color: 'white',
                }}
              >
                {selectedIntegration.icon}
              </Avatar>
              <Typography variant="h6" fontWeight={600}>
                {selectedIntegration.name}
              </Typography>
            </Box>
          )}

          {dialogType === 'connect' && (
            <Typography>
              {t('integration.confirmConnect', { integration: selectedIntegration?.name })}
            </Typography>
          )}

          {dialogType === 'disconnect' && (
            <Typography>
              {t('integration.confirmDisconnect', { integration: selectedIntegration?.name })}
            </Typography>
          )}

          {dialogType === 'info' && (
            <Typography>
              {t('integration.infoText', {
                integration: selectedIntegration?.name,
                status: status[selectedIntegration?.key || ''] ?
                  t('integration.connected') : t('integration.disconnected')
              })}
            </Typography>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2, borderTop: '1px solid #eee' }}>
          <Button
            onClick={handleCloseDialog}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            {t('integration.cancel')}
          </Button>

          {dialogType === 'connect' && (
            <Button
              variant="contained"
              onClick={() => selectedIntegration && handleConnect(selectedIntegration)}
              disabled={connectionStatus === 'connecting'}
              sx={{
                borderRadius: 2,
                background: 'linear-gradient(45deg, #578acd 30%, #6a9bdf 90%)',
                minWidth: 120,
              }}
            >
              {connectionStatus === 'connecting' ?
                t('integration.connecting') : t('integration.confirmConnect')
              }
            </Button>
          )}

          {dialogType === 'disconnect' && (
            <Button
              variant="contained"
              color="error"
              onClick={() => selectedIntegration && handleDisconnect(selectedIntegration)}
              disabled={connectionStatus === 'disconnecting'}
              sx={{ borderRadius: 2, minWidth: 120 }}
            >
              {connectionStatus === 'disconnecting' ?
                t('integration.disconnecting') : t('integration.confirmDisconnect')
              }
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Integrations;