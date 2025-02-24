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
import TwitterIcon from "@mui/icons-material/Twitter";
import { useSnackbar } from "notistack";
import TwitterService from "../../../services/twitter.service.ts";
import { useTranslation } from "react-i18next";

const TwitterAuthModal = ({ open, onClose, companyId }) => {
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
      // Limpa o intervalo ao fechar o modal
      if (intervalId) clearInterval(intervalId);
    };
  }, [open]);

  const checkStatus = async () => {
    try {
      const status = await TwitterService.checkTwitterStatus(companyId);
      setIsConnected(status);
    } catch (error) {
      console.error("Erro ao verificar status do Twitter:", error);
      setIsConnected(false);
    }
  };

  const handleAuth = async () => {
    setIsLoading(true);
    try {
      const response = await TwitterService.getAuthLink(companyId);
      if (response.data.url) {
        window.open(response.data.url, "_blank");
      } else {
        enqueueSnackbar(t("twitterAuthModal.errorAuthLink"), { variant: "error" });
      }
    } catch (error) {
      console.error("Erro ao iniciar autenticação do Twitter:", error);
      enqueueSnackbar(t("twitterAuthModal.errorConnecting"), { variant: "error" });
    }
    setIsLoading(false);
  };

  return (
    <Dialog open={open} onClose={!isLoading ? onClose : null} fullWidth maxWidth="sm">
      <DialogTitle>
        <Box display="flex" alignItems="center">
          <TwitterIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6">
            {isConnected === true
              ? t("twitterAuthModal.titleConnected")
              : t("twitterAuthModal.titleConnect")}
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Box textAlign="center" py={2}>
          {isConnected === null && <CircularProgress />}
          {isConnected === true && (
            <>
              <Typography variant="body1" gutterBottom>
                {t("twitterAuthModal.connectedMessage")}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {t("twitterAuthModal.connectedDescription")}
              </Typography>
            </>
          )}
          {isConnected === false && (
            <>
              <Typography variant="body1" gutterBottom>
                {t("twitterAuthModal.notConnectedMessage")}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {t("twitterAuthModal.notConnectedDescription")}
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
            startIcon={!isLoading ? <TwitterIcon /> : null}
            sx={{ minWidth: "180px" }}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : t("twitterAuthModal.connectButton")}
          </Button>
        )}
        <Button onClick={onClose} disabled={isLoading} variant="outlined" color="secondary">
          {t("twitterAuthModal.close")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TwitterAuthModal;
