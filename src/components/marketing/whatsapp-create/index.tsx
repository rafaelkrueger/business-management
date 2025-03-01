import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Typography,
  Box,
} from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { useSnackbar } from "notistack";
import WhatsAppService from "../../../services/whatsapp.service.ts";
import { useTranslation } from "react-i18next";

const WhatsAppAuthModal = ({ open, onClose, companyId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(null);
  const [qrCode, setQrCode] = useState(""); // Agora armazenamos a imagem Base64
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();

  useEffect(() => {
    if (open) {
      checkStatus();
    }
  }, [open]);

  const checkStatus = async () => {
    try {
      const status = await WhatsAppService.checkWhatsAppStatus(companyId);
      setIsConnected(status.data.connected);

      if (!status.data.connected) {
        const qrResponse = await WhatsAppService.getQrCode(companyId);
        setQrCode(qrResponse.data.qrCode); // Agora já vem como imagem Base64
      }
    } catch (error) {
      console.error("Erro ao verificar status do WhatsApp:", error);
      setIsConnected(false);
    }
  };

  return (
    <Dialog open={open} onClose={!isLoading ? onClose : null} fullWidth maxWidth="sm">
      <DialogTitle>
        <Box display="flex" alignItems="center">
          <WhatsAppIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6">
            {isConnected ? t("whatsappAuthModal.titleConnected") : t("whatsappAuthModal.titleConnect")}
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Box textAlign="center" py={2}>
          {isConnected === null && <CircularProgress />}
          {isConnected ? (
            <Typography variant="body1">{t("whatsappAuthModal.connectedMessage")}</Typography>
          ) : (
            <>
              <Typography variant="body1">{t("whatsappAuthModal.notConnectedMessage")}</Typography>
              <Typography variant="body2" color="textSecondary">
                {t("whatsappAuthModal.scanQrToConnect")}
              </Typography>
              {qrCode ? (
                <img src={qrCode} alt="QR Code" width="200" height="200" />
              ) : (
                <CircularProgress />
              )}
            </>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
        <Button onClick={onClose} disabled={isLoading} variant="outlined" color="secondary">
          {t("whatsappAuthModal.close")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WhatsAppAuthModal;
