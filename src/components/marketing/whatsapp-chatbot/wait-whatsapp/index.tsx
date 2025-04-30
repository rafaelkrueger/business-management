import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

const WaitWhatsappModal = ({ editingNode, setEditingNode, open, onClose, onSave }) => {
  const { t } = useTranslation();

  if (!editingNode) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>{t("automationFlow.waitWhatsappTitle")}</DialogTitle>

      <DialogContent>

        {/* Mensagem esperada */}
        <TextField
          label={t("automationFlow.expectedReply")}
          fullWidth
          multiline
          rows={2}
          sx={{ mt: 2 }}
          value={editingNode.data.params.expectedReply || ""}
          onChange={(e) =>
            setEditingNode(prev => ({
              ...prev,
              data: {
                ...prev.data,
                params: {
                  ...prev.data.params,
                  expectedReply: e.target.value,
                },
              },
            }))
          }
        />

        {/* Timeout */}
        <TextField
          label={t("automationFlow.timeoutMinutes")}
          type="number"
          fullWidth
          sx={{ mt: 3 }}
          value={editingNode.data.params.timeoutMinutes || ""}
          onChange={(e) =>
            setEditingNode(prev => ({
              ...prev,
              data: {
                ...prev.data,
                params: {
                  ...prev.data.params,
                  timeoutMinutes: e.target.value,
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

export default WaitWhatsappModal;
