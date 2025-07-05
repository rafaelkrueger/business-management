import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  CircularProgress
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import ChatbotService from '../../../services/chatbot.service.ts';

interface ChatHistoryModalProps {
  open: boolean;
  onClose: () => void;
  botId: string | null;
}

const ChatHistoryModal: React.FC<ChatHistoryModalProps> = ({ open, onClose, botId }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [threads, setThreads] = useState<any[]>([]);

  useEffect(() => {
    if (open && botId) {
      setLoading(true);
      ChatbotService.getHistory(botId)
        .then((res) => {
          setThreads(res || []);
        })
        .catch((err) => {
          console.error(err);
          setThreads([]);
        })
        .finally(() => setLoading(false));
    }
  }, [open, botId]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t('chatbot.historyTitle')}</DialogTitle>
      <DialogContent dividers sx={{ backgroundColor: '#F8FAFC' }}>
        {loading ? (
          <Box display="flex" justifyContent="center" p={2}>
            <CircularProgress />
          </Box>
        ) : threads.length === 0 ? (
          <Typography variant="body2" color="textSecondary" align="center">
            {t('chatbot.noHistory')}
          </Typography>
        ) : (
          threads.map((thread, i) => (
            <Box key={i} mb={3}>
              {thread.messages.map((msg: any, index: number) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row',
                    mb: 1
                  }}
                >
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 3,
                      backgroundColor: msg.sender === 'user' ? '#E0E7FF' : '#EDE9FE',
                      maxWidth: '80%',
                      borderBottomRightRadius: msg.sender === 'user' ? 4 : 18,
                      borderBottomLeftRadius: msg.sender === 'user' ? 18 : 4
                    }}
                  >
                    <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                      {msg.message}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          ))
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          {t('aiAssistant.close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChatHistoryModal;
