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
  FormGroup,
  TextField,
  Checkbox,
  ToggleButtonGroup,
  ToggleButton,
  CircularProgress,
  LinearProgress,

} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { useTranslation } from "react-i18next";
import { Check, PlusCircle } from "lucide-react";
import ProgressService from "../../../services/progress.service.ts";
import EmailService from '../../../services/email.service.ts'
import { AccessTime, Close } from "@mui/icons-material";

const EmailTemplateSelector = ({ templates = [], open, onClose, onSelect, activeCompany }) => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [newPage, setNewPage] = useState();
  const [mode, setMode] = useState<"choose" | "ai">("choose");
  const { t } = useTranslation();
  const [editInIframe, setEditInIframe] = useState(false);
  const iframeRef = useRef(null);
  const [customSectionInput, setCustomSectionInput] = useState("");
  const [generating, setGenerating] = useState(false);
    const [progress, setProgress] = useState();


  useEffect(() => {
    if (!generating) return;

    const interval = setInterval(() => {
      ProgressService.getProgress(activeCompany)
        .then((res) => {
          setProgress(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }, 5000);

    return () => clearInterval(interval);
  }, [generating]);


  const [sections, setSections] = useState<string[]>([
    "Email",
  ]);

  const sectionLabels: Record<string, string> = {
    email: 'Email',
  };


  const handleCardClick = (template) => {
    setSelectedTemplate(template);
  };

  useEffect(() => {
    if (iframeRef.current && selectedTemplate) {
      const iframeDoc = iframeRef.current.contentWindow.document;
      iframeDoc.body.contentEditable = editInIframe;
      if (editInIframe) {
        iframeDoc.body.focus();
      }
    }
  }, [editInIframe, selectedTemplate]);

  useEffect(() => {
    if (iframeRef.current && selectedTemplate?.htmlContent) {
      iframeRef.current.srcDoc = selectedTemplate.htmlContent;
    }
  }, [selectedTemplate?.htmlContent]);


  const handleConfirmSelection = async () => {
    if (selectedTemplate && iframeRef.current) {
      const iframeDoc = iframeRef.current.contentWindow.document;
      const headHtml = iframeDoc.head ? iframeDoc.head.innerHTML : "";
      const bodyHtml = iframeDoc.body ? iframeDoc.body.innerHTML : "";
      const updatedHtml = `<!DOCTYPE html><html><head>${headHtml}</head><body>${bodyHtml}</body></html>`;

      const updatedTemplate = {
        ...selectedTemplate,
        htmlContent: updatedHtml,
      };
      console.log(updatedTemplate);
      onSelect(updatedTemplate);
      setSelectedTemplate(null);
      setEditInIframe(true);
    }
  };

  const handleCreateAiTemplate = async () =>{
      const orderedSections = sections.filter((s) => s.trim() !== "");
      setGenerating(true);

      await EmailService.postAiTemplate({
        aiPrompt: newPage.aiPrompt,
        sections: orderedSections,
        companyId: activeCompany,
      }).then((res) => {
        const data = res.data;
        const updatedTemplate = {
          id: data.id,
          name: data.name || 'AI Generated Template',
          htmlContent: `${data.htmlContent}`,
          screenshot: data.screenshot || '',
          active: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        setGenerating(false);
        handleCardClick(updatedTemplate);
      })
      .catch((err)=>{console.log(err)}).finally(()=>{
        setProgress({});
      });

      setGenerating(false);
      return;
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>{t("emailTemplateSelector.title")}</DialogTitle>
      {generating ? (
        <Box
          mt={4}
          p={4}
          borderRadius="12px"
          bgcolor="rgba(255, 255, 255, 0.9)"
          boxShadow="0 8px 32px rgba(0, 0, 0, 0.05)"
          border="1px solid rgba(0, 0, 0, 0.05)"
          sx={{
            backdropFilter: 'blur(8px)',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.96) 0%, rgba(248,250,252,0.96) 100%)'
          }}
        >
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              fontWeight: 600,
              color: 'text.primary',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <CircularProgress
              size={24}
              thickness={4}
              sx={{
                color: 'primary.main',
                animationDuration: '800ms'
              }}
            />
            Generating your template...
          </Typography>

          <Box
            component="ul"
            sx={{
              pl: 0,
              mt: 2,
              mb: 0,
              display: 'grid',
              gap: 1.5
            }}
          >
            {sections.map((section) => {
              const status = progress?.[section];
              const label = sectionLabels?.[section] || section;

              return (
                <Box
                  key={section}
                  component="li"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    p: 1.5,
                    borderRadius: '8px',
                    transition: 'all 0.3s ease',
                    backgroundColor: status === 'loading' ? 'rgba(0, 100, 255, 0.03)' : 'transparent',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.02)'
                    }
                  }}
                >
                  <Box sx={{ position: 'relative', width: 24, height: 24 }}>
                    {status === 'loading' ? (
                      <CircularProgress
                        size={24}
                        thickness={4}
                        sx={{
                          color: 'primary.main',
                          position: 'absolute',
                          animationDuration: '800ms'
                        }}
                      />
                    ) : status === 'done' ? (
                      <Box
                        sx={{
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          backgroundColor: 'success.light',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Check
                          sx={{
                            color: 'success.contrastText',
                            fontSize: 16
                          }}
                        />
                      </Box>
                    ) : status === 'error' ? (
                      <Box
                        sx={{
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          backgroundColor: 'error.light',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Close
                          sx={{
                            color: 'error.contrastText',
                            fontSize: 16
                          }}
                        />
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          backgroundColor: 'action.disabledBackground',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <AccessTime
                          sx={{
                            color: 'action.disabled',
                            fontSize: 16
                          }}
                        />
                      </Box>
                    )}
                  </Box>

                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 500,
                      color: status === 'error' ? 'error.main' : 'text.primary',
                      flexGrow: 1
                    }}
                  >
                    {label}
                  </Typography>

                  {status === 'loading' && (
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'text.secondary',
                        fontFeatureSettings: '"tnum"'
                      }}
                    >
                      Processing...
                    </Typography>
                  )}
                </Box>
              );
            })}
          </Box>

          <Box
            sx={{
              mt: 3,
              pt: 2,
              borderTop: '1px solid',
              borderColor: 'divider',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {sections.filter(s => progress?.[s] === 'done' || progress?.[s] === 'error').length} of {sections.length} completed
            </Typography>

            <LinearProgress
              variant="determinate"
              value={(sections.filter(s => progress?.[s] === 'done' || progress?.[s] === 'error').length / sections.length) * 100}
              sx={{
                height: 6,
                borderRadius: 3,
                width: '60%',
                backgroundColor: 'action.selected',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 3,
                  backgroundColor: 'primary.main'
                }
              }}
            />
          </Box>
        </Box>
      ) : (
        <>
        <ToggleButtonGroup
          value={mode}
          exclusive
          onChange={(_, newMode) => newMode && setMode(newMode) && setSelectedTemplate(null)}
          sx={{ mb: 2 }}
          fullWidth
        >
          <ToggleButton value="choose">{t("marketing.templateDialog.chooseTemplate")}</ToggleButton>
          <ToggleButton value="ai">{t("marketing.templateDialog.createAiTemplate")}</ToggleButton>
        </ToggleButtonGroup>

      <DialogContent>
        {
          mode !== 'ai' ? (
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
                      <CardMedia sx={{height:'200px', width:'100%'}} component="img" height="140" image={template.screenshot} alt={template.name} />
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
              <Typography>Loading...</Typography>
            )}
          </Box>
          ) :
          (
            <Box mt={3}>
            <Typography variant="body1" color="textPrimary" sx={{marginLeft:'3px', fontSize:'16pt'}}>AI Prompt:</Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              placeholder={t("marketing.templateDialog.aiPromptHint")}
              onChange={(e) => setNewPage({ ...newPage, aiPrompt: e.target.value })}
            />
          </Box>
          )
        }

        {selectedTemplate && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6">{t("emailTemplateSelector.previewTitle")}</Typography>

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
                onClick={() => setEditInIframe(!editInIframe)}
                sx={{
                  position: "absolute",
                  top: 8,
                  left: 25,
                  zIndex: 1,
                  backgroundColor: "rgba(255,255,255,0.7)",
                  cursor: "pointer",
                }}
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
                    cursor: "text",
                  }}
                >
                  <iframe
                    ref={iframeRef}
                    srcDoc={selectedTemplate.htmlContent}
                    style={{
                      width: "100%",
                      height: "100%",
                      border: "none",
                      cursor: "text",
                    }}
                    title="Preview Template"
                  />
                </Box>
              </Box>
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t("form.cancel")}</Button>
        {
          mode === 'ai' && (
          <Button onClick={handleCreateAiTemplate}>
            Create AI Email Template
          </Button>
          )
        }
        <Button onClick={handleConfirmSelection} disabled={!selectedTemplate}>
            {t("emailTemplateSelector.select")}
          </Button>
      </DialogActions>
      </>
      )
      }
    </Dialog>
  );
};

export default EmailTemplateSelector;
