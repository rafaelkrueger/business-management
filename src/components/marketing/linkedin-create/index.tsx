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
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { useSnackbar } from "notistack";
import LinkedInService from "../../../services/linkedin.service.ts";
import { useTranslation } from "react-i18next";

const LinkedInAuthModal = ({ open, onClose, companyId }) => {
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
      const status = await LinkedInService.checkLinkedInStatus(companyId);
      setIsConnected(status);
    } catch (error) {
      console.error("Erro ao verificar status do LinkedIn:", error);
      setIsConnected(false);
    }
  };

  const handleAuth = async () => {
    setIsLoading(true);
    try {
      const response = await LinkedInService.getAuthLink(companyId);
      if (response.data) {
        window.open(response.data, "_blank");
      } else {
        enqueueSnackbar(t("linkedinAuthModal.errorAuthLink"), { variant: "error" });
      }
    } catch (error) {
      console.error("Erro ao iniciar autenticação do LinkedIn:", error);
      enqueueSnackbar(t("linkedinAuthModal.errorConnecting"), { variant: "error" });
    }
    setIsLoading(false);
  };

  return (
    <Dialog open={open} onClose={!isLoading ? onClose : null} fullWidth maxWidth="sm">
      <DialogTitle>
        <Box display="flex" alignItems="center">
          <LinkedInIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6">
            {isConnected === true
              ? t("linkedinAuthModal.titleConnected")
              : t("linkedinAuthModal.titleConnect")}
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Box textAlign="center" py={2}>
          {isConnected === null && <CircularProgress />}
          {isConnected === true && (
            <>
              <Typography variant="body1" gutterBottom>
                {t("linkedinAuthModal.connectedMessage")}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {t("linkedinAuthModal.connectedDescription")}
              </Typography>
            </>
          )}
          {isConnected === false && (
            <>
              <Typography variant="body1" gutterBottom>
                {t("linkedinAuthModal.notConnectedMessage")}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {t("linkedinAuthModal.notConnectedDescription")}
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
            startIcon={!isLoading ? <LinkedInIcon /> : null}
            sx={{ minWidth: "180px" }}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : t("linkedinAuthModal.connectButton")}
          </Button>
        )}
        <Button onClick={onClose} disabled={isLoading} variant="outlined" color="secondary">
          {t("linkedinAuthModal.close")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LinkedInAuthModal;
