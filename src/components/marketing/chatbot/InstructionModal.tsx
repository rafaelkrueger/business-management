import React from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton, TextField, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface InstructionModalProps {
  open: boolean;
  onClose: () => void;
  instruction: string;
  onChange: (value: string) => void;
}

const InstructionModal: React.FC<InstructionModalProps> = ({ open, onClose, instruction, onChange }) => {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 1 }}>
        <span>{t('chatbot.instructions')}</span>
        <IconButton onClick={onClose} sx={{ color: 'inherit' }}>
          <Box component="span" fontSize="1.5rem">&times;</Box>
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <TextField
          multiline
          fullWidth
          minRows={8}
          name="instruction"
          value={instruction}
          onChange={(e) => onChange(e.target.value)}
          variant="outlined"
        />
      </DialogContent>
    </Dialog>
  );
};

export default InstructionModal;
