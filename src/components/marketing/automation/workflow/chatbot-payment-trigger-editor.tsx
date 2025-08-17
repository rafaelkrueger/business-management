import React from 'react';
import {
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

interface ChatbotPaymentTriggerEditorProps {
  editingNode: any;
  setEditingNode: (node: any) => void;
  activeCompany: string;
}

const ChatbotPaymentTriggerEditor: React.FC<ChatbotPaymentTriggerEditorProps> = ({
  editingNode,
  setEditingNode,
  activeCompany,
}) => {
  const { t } = useTranslation();

  const handleSave = () => {
    // Lógica de salvamento será implementada no componente pai
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        {t('block.chatbotPaymentTrigger') || 'Chatbot Payment Trigger'}
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {t('automationFlow.chatbotPaymentTrigger.description') ||
         'Este trigger será ativado quando um pagamento gerado pelo chatbot for confirmado.'}
      </Typography>

      <TextField
        fullWidth
        label={t('automationFlow.chatbotSlug') || 'Chatbot Slug'}
        value={editingNode.data.params.chatbotSlug || ''}
        onChange={(e) =>
          setEditingNode({
            ...editingNode,
            data: {
              ...editingNode.data,
              params: {
                ...editingNode.data.params,
                chatbotSlug: e.target.value,
              },
            },
          })
        }
        sx={{ mb: 2 }}
        helperText={t('automationFlow.chatbotSlug.help') || 'Identificador único do chatbot'}
      />

      <TextField
        fullWidth
        label={t('automationFlow.paymentAmount') || 'Valor do Pagamento'}
        value={editingNode.data.params.paymentAmount || ''}
        onChange={(e) =>
          setEditingNode({
            ...editingNode,
            data: {
              ...editingNode.data,
              params: {
                ...editingNode.data.params,
                paymentAmount: e.target.value,
              },
            },
          })
        }
        sx={{ mb: 2 }}
        helperText={t('automationFlow.paymentAmount.help') || 'Deixe vazio para qualquer valor'}
        placeholder="0.00"
      />

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>{t('automationFlow.productIds') || 'IDs dos Produtos'}</InputLabel>
        <Select
          multiple
          value={editingNode.data.params.productIds || []}
          onChange={(e) =>
            setEditingNode({
              ...editingNode,
              data: {
                ...editingNode.data,
                params: {
                  ...editingNode.data.params,
                  productIds: e.target.value,
                },
              },
            })
          }
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} size="small" />
              ))}
            </Box>
          )}
        >
          <MenuItem value="any">
            {t('automationFlow.productIds.any') || 'Qualquer produto'}
          </MenuItem>
          {/* Aqui você pode adicionar uma lista de produtos da empresa */}
        </Select>
      </FormControl>

      <Box sx={{ mt: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
        <Typography variant="subtitle2" gutterBottom>
          {t('automationFlow.triggerInfo') || 'Informações do Trigger'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t('automationFlow.chatbotPaymentTrigger.info') ||
           'Este trigger será ativado automaticamente quando um pagamento gerado pelo chatbot for confirmado. ' +
           'Você pode usar as variáveis {{payment.amount}}, {{payment.currency}}, {{payment.productIds}}, ' +
           '{{payment.customerPhone}} e {{payment.threadId}} nos blocos subsequentes.'}
        </Typography>
      </Box>
    </Box>
  );
};

export default ChatbotPaymentTriggerEditor;
