import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Snackbar,
  Alert,
  Switch,
  useTheme,
  Button,
  IconButton
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import TrackingService from '../../services/tracking.service.ts';
import { IoIosRocket } from "react-icons/io";
import { ContentCopy } from '@mui/icons-material';
import TrackingHome from './smart-tag-home/index.tsx';
import PageViewChart from './page-view-chart/index.tsx';

const Tracking: React.FC<{ activeCompany: string, userData: any }> = ({ activeCompany, userData }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [tagStatus, setTagStaus] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isToggleOn, setIsToggleOn] = useState(false);
  const [tagData, setTagData] = useState<any>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [hasTagData, setHasTagData] = useState(false);

  useEffect(() => {
    const getTag = async () => {
      try {
        const response = await TrackingService.get(activeCompany);
        setApiKey(response.data.apiKey);
        setTagStaus(response.data.isActive);
        if (response.data) {
          setHasTagData(true);
        }
      } catch (err) {
        console.error(err);
      }
    };
    getTag();
  }, [activeCompany]);

  const handleToggle = async () => {
    if (!isToggleOn) {
      setLoading(true);
      setError(null);
      try {
        const response = await TrackingService.create({ companyId: activeCompany });
        setTagData(response.data);
        setSuccess(true);
        setIsToggleOn(true);
      } catch (err) {
        setError(t('tracking.errorCreatingTag'));
      } finally {
        setLoading(false);
      }
    } else {
      setIsToggleOn(false);
      setTagData(null);
    }
  };

  const handleCopy = () => {
    const scriptTag = `<script src="https://roktune.duckdns.org/integracao.js" data-api-key="${tagData.apiKey}"></script>`;
    navigator.clipboard.writeText(scriptTag);
    setCopySuccess(true);
  };

  const handleNext = () => {
    setHasTagData(true);
  };

  return (
    <>
      {!hasTagData ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100vh"
          bgcolor={theme.palette.background.default}
        >
          <Paper
            elevation={4}
            sx={{
              p: 4,
              borderRadius: '16px',
              width: '100%',
              maxWidth: '550px',
              textAlign: 'center',
              backgroundColor: theme.palette.background.paper,
              wordWrap: 'break-word',
              overflowWrap: 'break-word',
            }}
          >
            {!tagData ? (
              <>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    mb: 3,
                    color: theme.palette.primary.main,
                  }}
                >
                  <IoIosRocket size={120} color={theme.palette.primary.main} />
                </Box>

                {/* Título e subtítulo utilizando as traduções */}
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  gutterBottom
                  sx={{ color: theme.palette.text.primary, wordBreak: 'break-word' }}
                >
                  {t("tracking.welcome")}
                </Typography>
                <Typography
                  variant="body1"
                  color="textSecondary"
                  gutterBottom
                  sx={{ mb: 4, wordBreak: 'break-word' }}
                >
                  {t("tracking.intro")}
                </Typography>

                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  sx={{ position: 'relative', mt: 2 }}
                >
                  {loading ? (
                    <CircularProgress size={32} color="primary" />
                  ) : (
                    <Switch
                      checked={isToggleOn}
                      onChange={handleToggle}
                      color="primary"
                      disabled={loading}
                      sx={{
                        '& .MuiSwitch-thumb': {
                          backgroundColor: isToggleOn ? theme.palette.primary.main : theme.palette.grey[400],
                        },
                        '& .MuiSwitch-track': {
                          backgroundColor: isToggleOn ? theme.palette.primary.light : theme.palette.grey[500],
                        },
                      }}
                    />
                  )}
                </Box>
              </>
            ) : (
              <Box mt={4} textAlign="left">
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  sx={{ wordBreak: 'break-word' }}
                >
                  {t("tracking.integrationTag")}
                </Typography>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    mt: 1,
                    bgcolor: theme.palette.grey[100],
                    borderRadius: '8px',
                    wordBreak: 'break-word'
                  }}
                >
                  <Typography variant="body2">
                    <strong>{t("tracking.companyId")}:</strong> {tagData.companyId}
                  </Typography>
                  <Typography variant="body2">
                    <strong>{t("tracking.apiKey")}:</strong> {tagData.apiKey}
                  </Typography>
                  <Typography variant="body2">
                    <strong>{t("tracking.secret")}:</strong> {tagData.secret}
                  </Typography>
                </Paper>

                <Typography
                  variant="subtitle2"
                  mt={3}
                  sx={{ wordBreak: 'break-word' }}
                >
                  {t("tracking.integrationInstructions")}
                </Typography>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    mt: 1,
                    bgcolor: theme.palette.grey[100],
                    borderRadius: '8px',
                    wordBreak: 'break-word'
                  }}
                >
                  <Typography variant="body2">
                    {t("tracking.copyScriptInstruction")} <strong>&lt;head&gt;</strong> {t("tracking.ofYourSite")}
                  </Typography>
                  <Box
                    component="pre"
                    sx={{
                      bgcolor: '#eee',
                      p: 2,
                      borderRadius: '8px',
                      mt: 1,
                      wordBreak: 'break-word',
                      whiteSpace: 'pre-wrap',
                      position: 'relative'
                    }}
                  >
                    {`<script src="https://roktune.duckdns.org/integracao.js" data-api-key="${tagData.apiKey}"></script>`}
                    <IconButton
                      onClick={handleCopy}
                      sx={{ position: 'absolute', top: 8, right: 8 }}
                      size="small"
                    >
                      <ContentCopy fontSize="small" />
                    </IconButton>
                  </Box>
                </Paper>
                <Box textAlign="right" width="100%">
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ mt: 3 }}
                    onClick={handleNext}
                  >
                    {t("tracking.next")}
                  </Button>
                </Box>
              </Box>
            )}
          </Paper>

          <Snackbar
            open={success}
            autoHideDuration={6000}
            onClose={() => setSuccess(false)}
          >
            <Alert
              onClose={() => setSuccess(false)}
              severity="success"
              sx={{ width: '100%' }}
            >
              {t("tracking.tagCreatedSuccess")}
            </Alert>
          </Snackbar>

          <Snackbar
            open={Boolean(error)}
            autoHideDuration={6000}
            onClose={() => setError(null)}
          >
            <Alert
              onClose={() => setError(null)}
              severity="error"
              sx={{ width: '100%' }}
            >
              {error}
            </Alert>
          </Snackbar>

          <Snackbar
            open={copySuccess}
            autoHideDuration={3000}
            onClose={() => setCopySuccess(false)}
          >
            <Alert
              onClose={() => setCopySuccess(false)}
              severity="success"
              sx={{ width: '100%' }}
            >
              {t("tracking.copySuccess")}
            </Alert>
          </Snackbar>
        </Box>
      ) : (
        <TrackingHome activeCompany={activeCompany} user={userData} apiKey={apiKey} tagStatus={tagStatus} tagData={tagData} />
      )}
    </>
  );
};

export default Tracking;
