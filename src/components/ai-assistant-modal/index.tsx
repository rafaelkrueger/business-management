import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControlLabel,
  Switch,
  Typography,
  Box,
  CircularProgress,
  Paper,
  Skeleton,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import { Brain } from 'lucide-react';
import AiService from '../../services/ai.service.ts';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyId: string;
  type: string;
}

const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  isOpen,
  onClose,
  companyId,
  type,
}) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();

  const [assistantData, setAssistantData] = useState<any>(null);
  const [glanceData, setGlanceData] = useState<any>(null);
  const [toggleEnabled, setToggleEnabled] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && companyId) {
      AiService.getAiAssistant(companyId)
        .then((response) => {
          if (response && response.data && Object.keys(response.data).length > 0) {
            setAssistantData(response.data);
          } else {
            setAssistantData(null);
          }
        })
        .catch((error) => {
          console.error('Erro ao buscar assistente de IA:', error);
          setAssistantData(null);
        });
    }
  }, [isOpen, companyId]);

  // Quando existir o assistantData, chama o glance para buscar os insights
  useEffect(() => {
    if (assistantData && companyId) {
      AiService.glance(type, companyId)
        .then((response) => {
          if (response && response.data) {
            setGlanceData(response.data);
          } else {
            setGlanceData(null);
          }
        })
        .catch((error) => {
          console.error('Erro ao buscar dados do glance:', error);
          setGlanceData(null);
        });
    }
  }, [assistantData, companyId, type]);

  // Handler para habilitar o assistente via toggle
  const handleToggleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    setToggleEnabled(checked);
    if (checked) {
      setLoading(true);
      const payload = {
        companyId: companyId,
        name: companyId,
        instructions: t('aiAssistant.instructions'),
        model: 'gpt-3.5-turbo',
      };
      try {
        await AiService.craeteAiAssistant(payload);
        enqueueSnackbar(t('aiAssistant.enabledSuccess'), { variant: 'success' });
        // Atualiza os dados do assistente
        AiService.getAiAssistant(companyId)
          .then((response) => {
            if (response && response.data && Object.keys(response.data).length > 0) {
              setAssistantData(response.data);
            } else {
              setAssistantData(null);
            }
          });
      } catch (error) {
        console.error('Erro ao habilitar o assistente de IA:', error);
        enqueueSnackbar(t('aiAssistant.error'), { variant: 'error' });
        setToggleEnabled(false);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ marginBottom: '-5%' }}>
        <Box display="flex" alignItems="center" justifyContent="center">
          <Brain size={32} color="#7C4DFF" style={{ marginRight: '10px' }} />
          <Typography variant="h5" style={{ color: '#7C4DFF' }}>
            {t('aiAssistant.modalTitle')} {type}
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        {assistantData ? (
          <Box sx={{marginTop:'5%', marginBottom:'5%'}}>
            {glanceData ? (
              <Paper elevation={3} sx={{ p: 2, mt: 2, maxHeight: '400px', overflowY: 'auto' }}>
                <Typography variant="h6" gutterBottom>
                  AI Analysis
                </Typography>
                <Box component="pre" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontFamily: 'inherit' }}>
                  {glanceData}
                </Box>
              </Paper>
            ) : (
              <Paper elevation={3} sx={{ p: 2, mt: 2, maxHeight: '400px', overflowY: 'auto' }}>
                <Box component="pre" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontFamily: 'inherit' }}>
                  <Skeleton variant="text" width="100%" height={20} sx={{ mb: 1 }} />
                  <Skeleton variant="text" width="100%" height={20} sx={{ mb: 1 }} />
                  <Skeleton variant="text" width="100%" height={20} sx={{ mb: 1 }} />
                  <Skeleton variant="text" width="100%" height={20} sx={{ mb: 1 }} />
                  <Skeleton variant="text" width="100%" height={20} sx={{ mb: 1 }} />
                  <Skeleton variant="text" width="100%" height={20} sx={{ mb: 1 }} />
                  <Skeleton variant="text" width="100%" height={20} sx={{ mb: 1 }} />
                  <Skeleton variant="text" width="100%" height={20} sx={{ mb: 1 }} />
                  <Skeleton variant="text" width="100%" height={20} sx={{ mb: 1 }} />
                  <Skeleton variant="text" width="100%" height={20} sx={{ mb: 1 }} />
                  <Skeleton variant="text" width="100%" height={20} sx={{ mb: 1 }} />
                </Box>
            </Paper>
            )}
          </Box>
        ) : (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            p={2}
          >
            <Typography style={{ textAlign: 'center', color: 'rgba(0,0,0,0.5)' }}>
              {t('aiAssistant.info')}
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={toggleEnabled}
                  onChange={handleToggleChange}
                  color="primary"
                  disabled={loading}
                />
              }
              label={t('aiAssistant.enableLabel')}
            />
            {loading && <CircularProgress size={24} style={{ marginTop: '10px' }} />}
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ marginTop: '-6%' }}>
        <Button onClick={onClose} color="secondary" variant="outlined">
          {t('aiAssistant.close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AiAssistantModal;
