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
import YouTubeIcon from "@mui/icons-material/YouTube";
import { useSnackbar } from "notistack";
import YouTubeService from "../../../../services/youtube.service.ts";
import { useTranslation } from "react-i18next";

const YouTubeAuthModal = ({ open, onClose, companyId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(null); // null indica carregamento inicial
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();

  useEffect(() => {
    let intervalId;

    if (open) {
      checkStatus();

      // Verifica o status periodicamente a cada 3 segundos
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
      const status = await YouTubeService.checkYoutubeStatus(companyId);
      setIsConnected(status);
    } catch (error) {
      console.error("Erro ao verificar status do YouTube:", error);
      setIsConnected(false);
    }
  };

  const handleAuth = async () => {
    setIsLoading(true);
    try {
      const response = await YouTubeService.getAuthLink(companyId);
      if (response.data) {
        window.open(response.data, "_blank");
      } else {
        enqueueSnackbar(t("youtubeAuthModal.errorAuthLink"), { variant: "error" });
      }
    } catch (error) {
      console.error("Erro ao iniciar autenticação do YouTube:", error);
      enqueueSnackbar(t("youtubeAuthModal.errorConnecting"), { variant: "error" });
    }
    setIsLoading(false);
  };

  return (
    <Dialog open={open} onClose={!isLoading ? onClose : null} fullWidth maxWidth="sm">
      <DialogTitle>
        <Box display="flex" alignItems="center">
          <YouTubeIcon color="error" sx={{ mr: 1 }} />
          <Typography variant="h6">
            {isConnected === true
              ? t("youtubeAuthModal.titleConnected")
              : t("youtubeAuthModal.titleConnect")}
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Box textAlign="center" py={2}>
          {isConnected === null && <CircularProgress />}
          {isConnected === true && (
            <>
              <Typography variant="body1" gutterBottom>
                {t("youtubeAuthModal.connectedMessage")}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {t("youtubeAuthModal.connectedDescription")}
              </Typography>
            </>
          )}
          {isConnected === false && (
            <>
              <Typography variant="body1" gutterBottom>
                {t("youtubeAuthModal.notConnectedMessage")}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {t("youtubeAuthModal.notConnectedDescription")}
              </Typography>
            </>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
        {isConnected === false && (
          <Button
            variant="contained"
            color="error"
            onClick={handleAuth}
            disabled={isLoading}
            startIcon={!isLoading ? <YouTubeIcon /> : null}
            sx={{ minWidth: "180px" }}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : t("youtubeAuthModal.connectButton")}
          </Button>
        )}
        <Button onClick={onClose} disabled={isLoading} variant="outlined" color="secondary">
          {t("youtubeAuthModal.close")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default YouTubeAuthModal;
