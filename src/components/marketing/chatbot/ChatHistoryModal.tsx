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
  Stack,
  Grid,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import ChatbotService from '../../../services/chatbot.service.ts';
import { AccessTime, Delete, DeleteForeverOutlined, RemoveRedEyeOutlined, Launch } from '@mui/icons-material';

interface ChatHistoryModalProps {
  open: boolean;
  onClose: () => void;
  botId: string | null;
  botSlug: string | null;
}

const ChatHistoryModal: React.FC<ChatHistoryModalProps> = ({ open, onClose, botId, botSlug }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [threads, setThreads] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);
  const [threadToDelete, setThreadToDelete] = useState<string | null>(null);

  const handleDeleteThread = async (threadId: string) => {
    try {
      await ChatbotService.deleteThread(threadId);
      setThreads((prev) => prev.filter((t) => t.threadId !== threadId));
    } catch (err) {
      console.error(err);
    }
  };

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

const renderThreadsList = () => {
  // Ordena threads por data de criação (mais recente primeiro)
  const sortedThreads = [...threads].sort((a, b) => {
    const aDate = a.messages?.[0]?.createdAt || 0;
    const bDate = b.messages?.[0]?.createdAt || 0;
    return new Date(bDate).getTime() - new Date(aDate).getTime();
  });

  return (
    <Grid container spacing={2}>
      {sortedThreads.map((thread, i) => {
        const firstMessage = thread.messages?.[0];
        const date = firstMessage?.createdAt
          ? new Date(firstMessage.createdAt)
          : null;

        // Formatação de data amigável
        const formattedDate = date
          ? date.toLocaleDateString([], {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })
          : '';

        const formattedTime = date
          ? date.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            })
          : '';

        return (
          <Grid item xs={12} sm={6} key={thread.threadId || i}>
            <Card
              variant="outlined"
              sx={{
                position: 'relative',
                height: '100%',
                borderRadius: 2,
                boxShadow: '0px 2px 8px rgba(0,0,0,0.08)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0px 4px 12px rgba(0,0,0,0.12)'
                }
              }}
            >
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  setThreadToDelete(thread.threadId);
                }}
                sx={{ position: 'absolute', bottom: 6, right: 8 }}
              >
                <DeleteForeverOutlined fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => setSelected(thread)}
                sx={{ position: 'absolute', bottom: 6, right: 30 }}
              >
                <RemoveRedEyeOutlined fontSize="small" />
              </IconButton>
              {botSlug && (
                <Tooltip title={t('chatbot.openConversation')} arrow>
                  <IconButton
                    size="small"
                    onClick={() => window.open(`https://core.roktune.com/chatbot/s/${botSlug}?threadId=${thread.threadId}`, '_blank')}
                    sx={{ position: 'absolute', bottom: 6, right: 52 }}
                  >
                    <Launch fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
              <Card
                sx={{
                  height: '100%',
                  p: 1.5
                }}
              >
                <CardContent sx={{ p: 0 }}>
                  <Box display="flex" justifyContent="space-between">
                    <Typography
                      variant="overline"
                      color="primary"
                      fontWeight={700}
                      letterSpacing={1.1}
                    >
                      {`Conversa ${sortedThreads.length - i}`}
                    </Typography>

                    {date && (
                      <Chip
                        size="small"
                        label={formattedTime}
                        sx={{ bgcolor: 'grey.100' }}
                      />
                    )}
                  </Box>

                  {firstMessage?.content && (
                    <Typography
                      variant="body2"
                      sx={{
                        mt: 1.5,
                        mb: 1,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        lineHeight: 1.4,
                        color: 'text.secondary'
                      }}
                    >
                      {firstMessage.content}
                    </Typography>
                  )}

                  {formattedDate && (
                    <Box display="flex" alignItems="center" mt={1}>
                      <AccessTime fontSize="small" sx={{ mr: 0.5, fontSize: 14 }} />
                      <Typography
                        variant="caption"
                        color="text.disabled"
                      >
                        {formattedDate}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};

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
    <>
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
    <Dialog open={Boolean(threadToDelete)} onClose={() => setThreadToDelete(null)} maxWidth="xs" fullWidth>
      <DialogTitle>{t('chatbot.confirmDeleteThreadTitle')}</DialogTitle>
      <DialogContent dividers>
        <Typography>{t('chatbot.confirmDeleteThreadMessage')}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setThreadToDelete(null)}>{t('cancel')}</Button>
        <Button color="error" variant="contained" onClick={() => threadToDelete && (handleDeleteThread(threadToDelete), setThreadToDelete(null))}>{t('delete')}</Button>
      </DialogActions>
    </Dialog>
    </>
  );
};

export default ChatHistoryModal;
