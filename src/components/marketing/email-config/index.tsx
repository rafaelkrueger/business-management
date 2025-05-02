import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  IconButton,
  Tooltip,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import EmailService from "../../../services/email.service.ts";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";

const EmailConfigurationModal = ({ open, onClose, onSave, activeCompany }) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();

  // Estados para os campos de configuração
  const [email, setEmail] = useState("");
  const [smtpServer, setSmtpServer] = useState("");
  const [port, setPort] = useState("");
  const [password, setPassword] = useState("");
  const [useSSL, setUseSSL] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true)
    const config = {
      email,
      smtpServer,
      port: Number(port),
      password,
      useSSL,
      companyId: activeCompany,
    };

    try {
      await EmailService.createAccount(config);
      enqueueSnackbar(t("emailConfiguration.success"), { variant: "success" });
      if (onSave) onSave(config);
      onClose();
    } catch (error) {
      console.error("Erro ao criar conta de e-mail:", error);
      enqueueSnackbar(t("emailConfiguration.error"), { variant: "error" });
    } finally {
      setLoading(false)
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {t("emailConfiguration.title")}
        <Tooltip title={t("emailConfiguration.tooltip")}>
          <IconButton>
            <InfoIcon />
          </IconButton>
        </Tooltip>
      </DialogTitle>
      <DialogContent>
        <TextField
          label={t("emailConfiguration.emailLabel")}
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label={t("emailConfiguration.smtpServerLabel")}
          variant="outlined"
          fullWidth
          margin="normal"
          value={smtpServer}
          onChange={(e) => setSmtpServer(e.target.value)}
        />
        <TextField
          label={t("emailConfiguration.portLabel")}
          variant="outlined"
          fullWidth
          margin="normal"
          type="number"
          value={port}
          onChange={(e) => setPort(e.target.value)}
        />
        <TextField
          label={t("emailConfiguration.passwordLabel")}
          variant="outlined"
          fullWidth
          margin="normal"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={useSSL}
              onChange={(e) => setUseSSL(e.target.checked)}
            />
          }
          label={t("emailConfiguration.useSSLLabel")}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t("form.cancel")}</Button>
        <Button disabled={loading} variant="contained" onClick={handleSave}>
          {t("form.save")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmailConfigurationModal;
