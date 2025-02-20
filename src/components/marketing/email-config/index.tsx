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

const EmailConfigurationModal = ({ open, onClose, onSave, activeCompany }) => {
  // Estados para os campos de configuração
  const [email, setEmail] = useState("");
  const [smtpServer, setSmtpServer] = useState("");
  const [port, setPort] = useState("");
  const [password, setPassword] = useState("");
  const [useSSL, setUseSSL] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleSave = async () => {
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
      enqueueSnackbar("Conta de e-mail configurada com sucesso!", { variant: "success" });
      if (onSave) onSave(config);
      onClose();
    } catch (error) {
      console.error("Erro ao criar conta de e-mail:", error);
      enqueueSnackbar("Erro ao configurar a conta de e-mail.", { variant: "error" });
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
        Configurar Conta de E-mail
        <Tooltip title="Você pode encontrar essas informações na documentação do seu provedor de e-mail ou no painel de controle da sua conta.">
          <IconButton>
            <InfoIcon />
          </IconButton>
        </Tooltip>
      </DialogTitle>
      <DialogContent>
        <TextField
          label="Endereço de E-mail"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Servidor SMTP"
          variant="outlined"
          fullWidth
          margin="normal"
          value={smtpServer}
          onChange={(e) => setSmtpServer(e.target.value)}
        />
        <TextField
          label="Porta"
          variant="outlined"
          fullWidth
          margin="normal"
          type="number"
          value={port}
          onChange={(e) => setPort(e.target.value)}
        />
        <TextField
          label="Senha"
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
          label="Usar SSL/TLS"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={handleSave}>
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmailConfigurationModal;
