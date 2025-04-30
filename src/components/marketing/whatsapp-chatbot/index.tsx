import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

const WhatsappChatbotConfigModal = ({ editingNode, setEditingNode, open, onClose, onSave }) => {
  const { t } = useTranslation();

  if (!editingNode) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>{t("automationFlow.configureWhatsappChatbot")}</DialogTitle>

      <DialogContent>

        {/* Nome do Chatbot */}
        <TextField
          label={t("automationFlow.chatbotName")}
          fullWidth
          sx={{ mt: 2 }}
          value={editingNode.data.params.chatbotName || ""}
          onChange={(e) =>
            setEditingNode(prev => ({
              ...prev,
              data: {
                ...prev.data,
                params: {
                  ...prev.data.params,
                  chatbotName: e.target.value,
                },
              },
            }))
          }
        />

        {/* Mensagem para iniciar o fluxo */}
        <TextField
          label={t("automationFlow.expectedStartMessage")}
          fullWidth
          sx={{ mt: 3 }}
          value={editingNode.data.params.expectedStartMessage || ""}
          onChange={(e) =>
            setEditingNode(prev => ({
              ...prev,
              data: {
                ...prev.data,
                params: {
                  ...prev.data.params,
                  expectedStartMessage: e.target.value,
                },
              },
            }))
          }
        />

      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>
          {t("form.cancel")}
        </Button>
        <Button onClick={onSave} variant="contained">
          {t("form.save")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WhatsappChatbotConfigModal;
