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
import FacebookIcon from "@mui/icons-material/Facebook";
import { useSnackbar } from "notistack";
import FacebookService from "../../../services/facebook.service.ts";
import { useTranslation } from "react-i18next";

const FacebookAuthModal = ({ open, onClose, companyId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(null); // null indica carregamento inicial
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
      const status = await FacebookService.checkFacebookStatus(companyId);
      setIsConnected(status);
    } catch (error) {
      console.error("Erro ao verificar status do Facebook:", error);
      setIsConnected(false);
    }
  };

  const handleAuth = async () => {
    setIsLoading(true);
    try {
      const response = await FacebookService.getAuthLink(companyId);
      if (response.data) {
        window.open(response.data, "_blank");
      } else {
        enqueueSnackbar(t("facebookAuthModal.errorAuthLink"), { variant: "error" });
      }
    } catch (error) {
      console.error("Erro ao iniciar autenticação do Facebook:", error);
      enqueueSnackbar(t("facebookAuthModal.errorConnecting"), { variant: "error" });
    }
    setIsLoading(false);
  };

  return (
    <Dialog open={open} onClose={!isLoading ? onClose : null} fullWidth maxWidth="sm">
      <DialogTitle>
        <Box display="flex" alignItems="center">
          <FacebookIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6">
            {isConnected === true
              ? t("facebookAuthModal.titleConnected")
              : t("facebookAuthModal.titleConnect")}
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Box textAlign="center" py={2}>
          {isConnected === null && <CircularProgress />}
          {isConnected === true && (
            <>
              <Typography variant="body1" gutterBottom>
                {t("facebookAuthModal.connectedMessage")}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {t("facebookAuthModal.connectedDescription")}
              </Typography>
            </>
          )}
          {isConnected === false && (
            <>
              <Typography variant="body1" gutterBottom>
                {t("facebookAuthModal.notConnectedMessage")}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {t("facebookAuthModal.notConnectedDescription")}
              </Typography>
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
            disabled={isLoading}
            startIcon={!isLoading ? <FacebookIcon /> : null}
            sx={{ minWidth: "180px" }}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : t("facebookAuthModal.connectButton")}
          </Button>
        )}
        <Button onClick={onClose} disabled={isLoading} variant="outlined" color="secondary">
          {t("facebookAuthModal.close")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FacebookAuthModal;
