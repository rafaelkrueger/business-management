import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { useTranslation } from "react-i18next";

const EmailTemplateSelector = ({ templates = [], open, onClose, onSelect, isConnectedToChatGpt }) => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const { t } = useTranslation();
  const [editInIframe, setEditInIframe] = useState(true);
  const iframeRef = useRef(null);

  const handleCardClick = (template) => {
    setSelectedTemplate(template);
    setEditInIframe(true);
  };

  useEffect(() => {
    if (iframeRef.current && selectedTemplate) {
      const iframeDoc = iframeRef.current.contentWindow.document;
      iframeDoc.body.contentEditable = editInIframe && !isConnectedToChatGpt ? "true" : "false";
      if (editInIframe && !isConnectedToChatGpt) {
        iframeDoc.body.focus();
      }
    }
  }, [editInIframe, selectedTemplate, isConnectedToChatGpt]);

  useEffect(() => {
    if (iframeRef.current && selectedTemplate) {
      iframeRef.current.srcDoc = selectedTemplate.htmlContent;
    }
  }, [selectedTemplate]);

  const handleSaveIframeChanges = () => {
    if (isConnectedToChatGpt) return; // Bloqueia salvamento se for gerado pelo ChatGPT

    if (iframeRef.current && selectedTemplate) {
      const iframeDoc = iframeRef.current.contentWindow.document;
      const updatedHead = iframeDoc.head ? iframeDoc.head.innerHTML : "";
      let bodyHtml = iframeDoc.body ? iframeDoc.body.innerHTML : "";

      const tempContainer = document.createElement("div");
      tempContainer.innerHTML = bodyHtml;
      const styleTags = tempContainer.querySelectorAll("style");
      styleTags.forEach((styleTag) => styleTag.remove());
      bodyHtml = tempContainer.innerHTML;

      const updatedHtml = `<!DOCTYPE html>
  <html>
    <head>${updatedHead}</head>
    <body>${bodyHtml}</body>
  </html>`;

      setSelectedTemplate({
        ...selectedTemplate,
        htmlContent: updatedHtml,
      });

      setEditInIframe(false);
    }
  };

  const handleConfirmSelection = () => {
    if (selectedTemplate && iframeRef.current) {
      const iframeDoc = iframeRef.current.contentWindow.document;
      const headHtml = iframeDoc.head ? iframeDoc.head.innerHTML : "";
      const bodyHtml = iframeDoc.body ? iframeDoc.body.innerHTML : "";
      const updatedHtml = `<!DOCTYPE html><html><head>${headHtml}</head><body>${bodyHtml}</body></html>`;

      const updatedTemplate = {
        ...selectedTemplate,
        htmlContent: updatedHtml,
      };

      onSelect(updatedTemplate);
      setSelectedTemplate(null);
      setEditInIframe(true);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>{t("emailTemplateSelector.title")}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          {Array.isArray(templates) && templates.length > 0 ? (
            templates.map((template) => (
              <Card
                key={template.id}
                sx={{
                  width: 200,
                  border: selectedTemplate && selectedTemplate.id === template.id ? "2px solid blue" : "none",
                  cursor: "pointer",
                  p: 1,
                }}
                onClick={() => handleCardClick(template)}
              >
                {template.screenshot && (
                  <CardActionArea>
                    <CardMedia component="img" height="140" image={template.screenshot} alt={template.name} />
                    <CardContent>
                      <Typography variant="body2" color="textSecondary" align="center">
                        {template.name}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                )}
              </Card>
            ))
          ) : (
            <Typography variant="body2" color="textSecondary">
              {t("emailTemplateSelector.noTemplate")}
            </Typography>
          )}
        </Box>

        {selectedTemplate && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6">{t("emailTemplateSelector.previewTitle")}</Typography>

            {isConnectedToChatGpt && (
              <Typography
                sx={{
                  color: "#FFA500",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontWeight: "bold",
                  mt: 1,
                }}
                variant="body2"
              >
                <WarningAmberIcon sx={{ fontSize: 18 }} />
                {t("emailTemplateSelector.editBlockedMessage")}
              </Typography>
            )}

            <Box
              sx={{
                position: "relative",
                border: "1px solid #ddd",
                borderRadius: 1,
                mt: 1,
                height: 400,
              }}
            >
              <IconButton
                onClick={() => !isConnectedToChatGpt && setEditInIframe(!editInIframe)}
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 25,
                  zIndex: 1,
                  backgroundColor: "rgba(255,255,255,0.7)",
                  cursor: isConnectedToChatGpt ? "not-allowed" : "pointer",
                }}
                disabled={isConnectedToChatGpt}
              >
                {editInIframe ? <LockOpenIcon /> : <LockIcon />}
              </IconButton>

              <Box sx={{ display: "flex", gap: 2, height: 400 }}>
                <Box
                  sx={{
                    flex: 1,
                    border: "1px solid #ddd",
                    borderRadius: 1,
                    overflow: "hidden",
                    cursor: isConnectedToChatGpt ? "not-allowed" : "text",
                  }}
                >
                  <iframe
                    ref={iframeRef}
                    srcDoc={selectedTemplate.htmlContent}
                    style={{
                      width: "100%",
                      height: "100%",
                      border: "none",
                      cursor: isConnectedToChatGpt ? "not-allowed" : "text",
                    }}
                    title="Preview Template"
                  />
                </Box>
              </Box>
            </Box>

            {!isConnectedToChatGpt && editInIframe && (
              <Box sx={{ mt: 2 }}>
                <Button variant="contained" onClick={handleSaveIframeChanges} color="primary">
                  {t("emailTemplateSelector.saveChanges")}
                </Button>
              </Box>
            )}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t("form.cancel")}</Button>
        <Button onClick={handleConfirmSelection} disabled={!selectedTemplate}>
          {t("emailTemplateSelector.select")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmailTemplateSelector;
