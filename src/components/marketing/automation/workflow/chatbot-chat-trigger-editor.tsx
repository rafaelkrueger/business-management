import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import ChatbotService from '../../../../services/chatbot.service.ts';

interface ChatbotChatTriggerEditorProps {
  editingNode: any;
  setEditingNode: (node: any) => void;
  activeCompany: string;
}

const ChatbotChatTriggerEditor: React.FC<ChatbotChatTriggerEditorProps> = ({
  editingNode,
  setEditingNode,
  activeCompany,
}) => {
  const { t } = useTranslation();
  const [chatbots, setChatbots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChatbots = async () => {
      try {
        setLoading(true);
        const bots = await ChatbotService.getBotByCompanyId(activeCompany);
        setChatbots(bots || []);
      } catch (error) {
        console.error('Erro ao buscar chatbots:', error);
        setChatbots([]);
      } finally {
        setLoading(false);
      }
    };

    if (activeCompany) {
      fetchChatbots();
    }
  }, [activeCompany]);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        {t('block.chatbotChatTrigger') || 'Chatbot Chat Trigger'}
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {t('automationFlow.chatbotChatTrigger.description') ||
         'Este trigger será ativado quando alguém iniciar uma nova conversa com o chatbot selecionado.'}
      </Typography>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>
          {t('automationFlow.selectChatbot') || 'Selecione o Chatbot'}
        </InputLabel>
        <Select
          value={editingNode.data.params.chatbotId || ''}
          onChange={(e) =>
            setEditingNode({
              ...editingNode,
              data: {
                ...editingNode.data,
                params: {
                  ...editingNode.data.params,
                  chatbotId: e.target.value,
                },
              },
            })
          }
          disabled={loading}
        >
          {loading ? (
            <MenuItem value="">{t('automationFlow.loading') || 'Carregando...'}</MenuItem>
          ) : chatbots.length === 0 ? (
            <MenuItem value="" disabled>
              {t('automationFlow.noChatbots') || 'Nenhum chatbot encontrado'}
            </MenuItem>
          ) : (
            chatbots.map((bot) => (
              <MenuItem key={bot.id} value={bot.id}>
                {bot.name}
              </MenuItem>
            ))
          )}
        </Select>
      </FormControl>

      <Box sx={{ mt: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
        <Typography variant="subtitle2" gutterBottom>
          {t('automationFlow.triggerInfo') || 'Informações do Trigger'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t('automationFlow.chatbotChatTrigger.info') ||
           'Este trigger será ativado automaticamente quando uma nova conversa for iniciada com o chatbot selecionado. ' +
           'Você pode usar as variáveis {{chatbot.threadId}}, {{chatbot.chatId}} e {{chatbot.message}} nos blocos subsequentes.'}
        </Typography>
      </Box>
    </Box>
  );
};

export default ChatbotChatTriggerEditor;

