import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Card,
  CardContent,
  Typography,
  Box,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

interface PaymentHistoryModalProps {
  open: boolean;
  onClose: () => void;
  history: any[];
}

const PaymentHistoryModal: React.FC<PaymentHistoryModalProps> = ({ open, onClose, history }) => {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{t('history')}</DialogTitle>
      <DialogContent dividers>
        {history.length === 0 ? (
          <Typography variant="body2" color="text.secondary" align="center">
            {t('noData')}
          </Typography>
        ) : (
          <Box display="flex" flexDirection="column" gap={2}>
            {history.map((item) => (
              <Card key={item.id} variant="outlined">
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary">
                    {new Date(item.paymentDate).toLocaleString()}
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {`${item.currency} ${item.amount}`}
                  </Typography>
                  <Typography
                    variant="body2"
                    color={item.status === 'paid' ? 'green' : 'orange'}
                    sx={{ textTransform: 'capitalize' }}
                  >
                    {item.status}
                  </Typography>
                  {item.stripePaymentIntentId && (
                    <Typography variant="caption" color="text.secondary">
                      {item.stripePaymentIntentId}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          {t('close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentHistoryModal;
