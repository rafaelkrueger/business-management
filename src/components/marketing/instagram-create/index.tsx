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
import InstagramIcon from "@mui/icons-material/Instagram";
import { useSnackbar } from "notistack";
import InstagramService from "../../../services/instagram.service.ts";
import { useTranslation } from "react-i18next";

const InstagramAuthModal = ({ open, onClose, companyId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(null); // null indicates initial loading
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();

  useEffect(() => {
    let intervalId;

    if (open) {
      checkStatus();

      // Start periodic checking every 3 seconds
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
      const status = await InstagramService.checkInstagramStatus(companyId);
      setIsConnected(status);
    } catch (error) {
      console.error("Error checking Instagram status:", error);
      setIsConnected(false);
    }
  };

  const handleAuth = async () => {
    setIsLoading(true);
    try {
      const response = await InstagramService.getAuthLink(companyId);
      if (response.data) {
        window.open(response.data, "_blank");
      } else {
        enqueueSnackbar(t("instagramAuthModal.errorAuthLink"), { variant: "error" });
      }
    } catch (error) {
      console.error("Error initiating Instagram authentication:", error);
      enqueueSnackbar(t("instagramAuthModal.errorConnecting"), { variant: "error" });
    }
    setIsLoading(false);
  };

  return (
    <Dialog open={open} onClose={!isLoading ? onClose : null} fullWidth maxWidth="sm">
      <DialogTitle>
        <Box display="flex" alignItems="center">
          <InstagramIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6">
            {isConnected === true
              ? t("instagramAuthModal.titleConnected")
              : t("instagramAuthModal.titleConnect")}
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Box textAlign="center" py={2}>
          {isConnected === null && <CircularProgress />}
          {isConnected === true && (
            <>
              <Typography variant="body1" gutterBottom>
                {t("instagramAuthModal.connectedMessage")}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {t("instagramAuthModal.connectedDescription")}
              </Typography>
            </>
          )}
          {isConnected === false && (
            <>
              <Typography variant="body1" gutterBottom>
                {t("instagramAuthModal.notConnectedMessage")}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {t("instagramAuthModal.notConnectedDescription")}
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
            startIcon={!isLoading ? <InstagramIcon /> : null}
            sx={{ minWidth: "180px" }}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : t("instagramAuthModal.connectButton")}
          </Button>
        )}
        <Button onClick={onClose} disabled={isLoading} variant="outlined" color="secondary">
          {t("instagramAuthModal.close")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InstagramAuthModal;