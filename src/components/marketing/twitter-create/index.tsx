import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Tooltip,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import { useSnackbar } from "notistack";
import TwitterService from "../../../services/twitter.service.ts";

const TwitterAuthModal = ({ open, onClose, onSave, companyId }) => {
  const [accessToken, setAccessToken] = useState("");
  const [accessSecret, setAccessSecret] = useState("");
  const { enqueueSnackbar } = useSnackbar();

  const handleSave = async () => {
    if (!accessToken || !accessSecret) {
      enqueueSnackbar("Preencha todos os campos!", { variant: "warning" });
      return;
    }

    const credentials = {
      accessToken,
      accessSecret,
      companyId,
    };

    try {
      await TwitterService.create(credentials);
      enqueueSnackbar("Conta do Twitter vinculada com sucesso!", { variant: "success" });
      if (onSave) onSave(credentials);
      onClose();
    } catch (error) {
      console.error("Erro ao salvar credenciais do Twitter:", error);
      enqueueSnackbar("Erro ao conectar a conta do Twitter.", { variant: "error" });
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
        Vincular Conta do Twitter
        <Tooltip title="Você pode obter essas credenciais no painel de desenvolvedor do Twitter.">
          <IconButton>
            <InfoIcon />
          </IconButton>
        </Tooltip>
      </DialogTitle>
      <DialogContent>
        <TextField
          label="Access Token"
          variant="outlined"
          fullWidth
          margin="normal"
          value={accessToken}
          onChange={(e) => setAccessToken(e.target.value)}
        />
        <TextField
          label="Access Secret"
          variant="outlined"
          fullWidth
          margin="normal"
          type="password"
          value={accessSecret}
          onChange={(e) => setAccessSecret(e.target.value)}
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

export default TwitterAuthModal;
