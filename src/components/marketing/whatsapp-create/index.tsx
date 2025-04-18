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
  Skeleton,
} from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { useSnackbar } from "notistack";
import WhatsAppService from "../../../services/whatsapp.service.ts";
import { useTranslation } from "react-i18next";

const WhatsAppAuthModal = ({ open, onClose, companyId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(null);
  const [qrCode, setQrCode] = useState("");
  const [qrTimer, setQrTimer] = useState(60);
  const [showRefreshButton, setShowRefreshButton] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();

  useEffect(() => {
    let interval;
    if (open) {
      const checkStatus = async () => {
        try {
          const status = await WhatsAppService.checkWhatsAppStatus(companyId);
          setIsConnected(status.data.connected);

          if (!status.data.connected) {
            const res = await WhatsAppService.getQrCode(companyId);
            setQrCode(res.data || null);
            setQrTimer(60);
            setShowRefreshButton(false);
          } else {
            onClose();
          }

          interval = setInterval(async () => {
            const status = await WhatsAppService.checkWhatsAppStatus(companyId);
            if (status.data.connected) {
              clearInterval(interval);
              enqueueSnackbar(t("Whatsapp connected"), { variant: "success" });
              onClose();
            }
          }, 3000);
        } catch (err) {
          console.error("Erro ao verificar status do WhatsApp:", err);
        }
      };

      checkStatus();

      return () => {
        clearInterval(interval);
      };
    }
  }, [open]);

  // ⏳ Contador de 60 segundos para o QR
  useEffect(() => {
    if (!qrCode) return;

    setQrTimer(60);
    setShowRefreshButton(false);
    const countdown = setInterval(() => {
      setQrTimer((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          setShowRefreshButton(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, [qrCode]);

  const regenerateQr = async () => {
    try {
      setIsLoading(true);
      const res = await WhatsAppService.getQrCode(companyId);
      setQrCode(res.data || null);
      setQrTimer(60);
      setShowRefreshButton(false);
    } catch (err) {
      enqueueSnackbar("Erro", { variant: "error" });
    } finally {
      setIsLoading(false);
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
        <Box textAlign="center" py={2} sx={{display:'flex', flexDirection:'column', justifySelf:'center'}}>
          {isConnected === null && <CircularProgress style={{marginLeft:'75px'}} />}
          {isConnected ? (
            <Typography variant="body1">{t("whatsappAuthModal.connectedMessage")}</Typography>
          ) : (
            <>
              <Typography variant="body1">{t("whatsappAuthModal.notConnectedMessage")}</Typography>
              <Typography variant="body2" color="textSecondary">
                {t("whatsappAuthModal.scanQrToConnect")}
              </Typography>
              <br/>
              {qrCode ? (
                <>
                  <img src={qrCode} alt="QR Code" width="200" height="200" style={{marginLeft:'62px'}} />
                  {!showRefreshButton ? (
                    <Typography mt={1} variant="body2" color="textSecondary">
                      Expires in {qrTimer}s
                    </Typography>
                  ) : (
                    <Button
                      onClick={regenerateQr}
                      variant="contained"
                      color="primary"
                      sx={{ mt: 2 }}
                      disabled={isLoading}
                    >
                      New QR Code
                    </Button>
                  )}
                </>
              ) : (
                <Skeleton style={{height:'390px'}} />
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
