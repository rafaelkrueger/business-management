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
  TextField,
} from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { useSnackbar } from "notistack";
import WhatsAppService from "../../../services/whatsapp.service.ts";
import { useTranslation } from "react-i18next";

const WhatsAppAuthModal = ({ open, onClose, companyId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(null); // null indica carregamento inicial
  const [accessToken, setAccessToken] = useState(""); // Token inserido pelo usuário
  const [phoneNumberId, setPhoneNumberId] = useState(""); // ID do número do WhatsApp
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();

  useEffect(() => {
    let intervalId;

    if (open) {
      checkStatus();

      // Inicia a verificação periódica a cada 3 segundos
      intervalId = setInterval(() => {
        checkStatus();
      }, 3000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [open]);

  const checkStatus = async () => {
    try {
      const status = await WhatsAppService.checkWhatsAppStatus(companyId);
      setIsConnected(status);
    } catch (error) {
      console.error("Erro ao verificar status do WhatsApp:", error);
      setIsConnected(false);
    }
  };

  const handleAuth = async () => {
    setIsLoading(true);
    try {
      const response = await WhatsAppService.connectWhatsApp({
        companyId,
        accessToken,
        phoneNumberId,
      });

      if (response.data) {
        enqueueSnackbar(t("whatsappAuthModal.successConnect"), { variant: "success" });
        checkStatus();
      } else {
        enqueueSnackbar(t("whatsappAuthModal.errorAuth"), { variant: "error" });
      }
    } catch (error) {
      console.error("Erro ao conectar o WhatsApp:", error);
      enqueueSnackbar(t("whatsappAuthModal.errorConnecting"), { variant: "error" });
    }
    setIsLoading(false);
  };

  return (
    <Dialog open={open} onClose={!isLoading ? onClose : null} fullWidth maxWidth="sm">
      <DialogTitle>
        <Box display="flex" alignItems="center">
          <WhatsAppIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6">
            {isConnected === true
              ? t("whatsappAuthModal.titleConnected")
              : t("whatsappAuthModal.titleConnect")}
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Box textAlign="center" py={2}>
          {isConnected === null && <CircularProgress />}
          {isConnected === true && (
            <>
              <Typography variant="body1" gutterBottom>
                {t("whatsappAuthModal.connectedMessage")}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {t("whatsappAuthModal.connectedDescription")}
              </Typography>
            </>
          )}
          {isConnected === false && (
            <>
              <Typography variant="body1" gutterBottom>
                {t("whatsappAuthModal.notConnectedMessage")}
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                {t("whatsappAuthModal.enterDetails")}
              </Typography>
              <TextField
                label={t("whatsappAuthModal.accessToken")}
                variant="outlined"
                fullWidth
                margin="dense"
                value={accessToken}
                onChange={(e) => setAccessToken(e.target.value)}
              />
              <TextField
                label={t("whatsappAuthModal.phoneNumberId")}
                variant="outlined"
                fullWidth
                margin="dense"
                value={phoneNumberId}
                onChange={(e) => setPhoneNumberId(e.target.value)}
              />
            </>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
        {isConnected === false && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleAuth}
            disabled={isLoading || !accessToken || !phoneNumberId}
            startIcon={!isLoading ? <WhatsAppIcon /> : null}
            sx={{ minWidth: "180px" }}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : t("whatsappAuthModal.connectButton")}
          </Button>
        )}
        <Button onClick={onClose} disabled={isLoading} variant="outlined" color="secondary">
          {t("whatsappAuthModal.close")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WhatsAppAuthModal;
