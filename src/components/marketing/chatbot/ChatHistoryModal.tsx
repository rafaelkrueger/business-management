import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  CircularProgress,
  Card,
  CardActionArea,
  CardContent,
  Stack
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
  const [selected, setSelected] = useState<any | null>(null);

  useEffect(() => {
    if (open && botId) {
      setSelected(null);
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

  const renderThreadsList = () => (
    <Stack spacing={2}>
      {threads.map((thread, i) => {
        const first = thread.messages?.[0];
        const date = first?.createdAt ? new Date(first.createdAt).toLocaleString() : '';
        return (
          <Card key={thread.threadId || i} variant="outlined">
            <CardActionArea onClick={() => setSelected(thread)}>
              <CardContent>
                <Typography fontWeight={600} gutterBottom>
                  {t('chatbot.conversation')} {i + 1}
                </Typography>
                {date && (
                  <Typography variant="caption" color="textSecondary">
                    {date}
                  </Typography>
                )}
              </CardContent>
            </CardActionArea>
          </Card>
        );
      })}
    </Stack>
  );

  const renderMessages = () => (
    <Box>
      {selected.messages.map((msg: any, index: number) => (
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
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {selected ? `${t('chatbot.conversation')} ${threads.indexOf(selected) + 1}` : t('chatbot.historyTitle')}
      </DialogTitle>
      <DialogContent dividers sx={{ backgroundColor: '#F8FAFC' }}>
        {loading ? (
          <Box display="flex" justifyContent="center" p={2}>
            <CircularProgress />
          </Box>
        ) : threads.length === 0 ? (
          <Typography variant="body2" color="textSecondary" align="center">
            {t('chatbot.noHistory')}
          </Typography>
        ) : selected ? (
          renderMessages()
        ) : (
          renderThreadsList()
        )}
      </DialogContent>
      <DialogActions>
        {selected && (
          <Button onClick={() => setSelected(null)} variant="text">
            {t('sidepanel.back')}
          </Button>
        )}
        <Button onClick={onClose} variant="outlined">
          {t('aiAssistant.close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChatHistoryModal;
