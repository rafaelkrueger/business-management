import React, { useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  IconButton,
  Paper,
} from "@mui/material";
import { ContentCopy, Close } from "@mui/icons-material";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";

const IntegrationModal = ({ open, onClose, apiKey }) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();

  // Código de exemplo para a requisição GET (busca de produtos)
  const apiFetchProducts = `
const handleGetProducts = () => {
  window.Roktune.getProducts()
    .then((data) => {
      console.log(data);
    })
    .catch((error) => console.error(error));
};
`;

  // Função para copiar o código para a área de transferência
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    enqueueSnackbar(t("tracking.productsModal.contentCopied", "Code Copied!"), {
      variant: "success",
    });
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          bgcolor: "background.paper",
          boxShadow: 24,
          borderRadius: 3,
          p: 4,
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight="bold">
            {t(
              "tracking.productsModal.title",
              "Products Integration"
            )}
          </Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>

        <Typography variant="body1" fontWeight="bold" sx={{ mt: 2, mb: 2 }}>
          {t("tracking.productsModal.subtitle", "Find Products:")}
        </Typography>

        <Paper
          variant="outlined"
          sx={{
            p: 2,
            bgcolor: "grey.100",
            borderRadius: "8px",
            mt: 1,
            wordBreak: "break-word",
            position: "relative",
          }}
        >
          <pre style={{ whiteSpace: "pre-wrap", margin: 0 }}>
            {apiFetchProducts}
          </pre>
          <IconButton
            onClick={() => handleCopy(apiFetchProducts)}
            sx={{ position: "absolute", top: 8, right: 8 }}
            size="small"
          >
            <ContentCopy fontSize="small" />
          </IconButton>
        </Paper>

        <Box textAlign="right" mt={3}>
          <Button variant="contained" color="primary" onClick={onClose}>
            {t("tracking.productsModal.close", "Close")}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default IntegrationModal;
