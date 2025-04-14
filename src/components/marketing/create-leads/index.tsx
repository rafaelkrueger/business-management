import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Grid,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  IconButton,
  Box,
  Divider,
  Paper,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  InputAdornment
} from "@mui/material";
import React, { useState } from "react";
import { ArrowLeft, PlusCircle, Trash2, ChevronDown, Link, Mail, Smartphone, TextCursorInput } from "lucide-react";
import LeadsService from "../../../services/leads.service.ts";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import LeadFormPreview from "../form-preview/index.tsx";
import { ArrowBackIos } from "@mui/icons-material";

// ... (interfaces permanecem as mesmas)

const LeadGeneration = ({ activeCompany, setModule }: { activeCompany: string; setModule: (module: string) => void }) => {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const [apiKey, setApiKey] = useState("");

  // Main formData state
  const [formData, setFormData] = useState<IFormData>({
    title: "",
    description: "",
    companyId: activeCompany,
    message: "",
    templateId: "",
    incentives: {
      ebook: false,
      webinar: false,
      desconto: false,
      consultoria: false,
      others: false
    },
    incentiveDetails: {
      ebook: "",
      webinar: "",
      desconto: "",
      consultoria: "",
      others: ""
    },
    extraActions: {
      whatsappButton: false,
      subscribeNewsletter: false,
      followSocials: false,
      requestCallback: false
    },
    salesOptions: {
      sellBefore: false,
      sellAfter: false,
      noOffer: false
    },
    fields: [
      {
        name: "Email",
        type: "email"
      }
    ]
  });

  // Controls the preview modal display
  const [showPreview, setShowPreview] = useState(false);

  // When confirmed, receives the final HTML content from the preview (iframe)
  const handleConfirmCreate = (htmlContent: string) => {
    setShowPreview(false);
    // Include the iframe HTML content (final form HTML) in the POST request
    const dataToPost = { ...formData, html: htmlContent };
    LeadsService.post(dataToPost)
      .then((response) => {
        enqueueSnackbar(
          t("leads.leadCreatedSuccess") || "Lead successfully created!",
          { variant: "success" }
        );
        setApiKey(response.data.apiKey);
      })
      .catch((err) => {
        enqueueSnackbar(
          t("leads.leadCreatedError") || "An error occurred while creating the form",
          { variant: "error" }
        );
      });
  };

  // Handlers for opening/closing preview modal
  const handleOpenPreview = () => {
    setShowPreview(true);
  };

  const handleClosePreview = () => {
    setShowPreview(false);
  };

  // Handler for simple input changes
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name as string]: value }));
  };

  // Handler for checkboxes (incentives, extraActions, salesOptions)
  const handleCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    category: string
  ) => {
    const { name, checked } = event.target;
    if (category === "salesOptions") {
      setFormData((prev) => ({
        ...prev,
        salesOptions: {
          sellBefore: false,
          sellAfter: false,
          noOffer: false,
          [name]: checked ? true : false
        }
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [category]: {
          ...prev[category],
          [name]: checked
        }
      }));
    }
  };

  // Handlers for extra fields
  const addExtraField = () => {
    setFormData((prev) => ({
      ...prev,
      fields: [...prev.fields, { name: "", type: "text" }]
    }));
  };

  const removeExtraField = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      fields: prev.fields.filter((_, i) => i !== index)
    }));
  };

  const handleExtraFieldChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = event.target;
    setFormData((prev) => {
      const updatedFields = [...prev.fields];
      updatedFields[index] = { ...updatedFields[index], [name as string]: value };
      return { ...prev, fields: updatedFields };
    });
  };

  // Handler for incentive details
  const handleIncentiveDetailChange = (incentive: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      incentiveDetails: {
        ...prev.incentiveDetails,
        [incentive]: value
      }
    }));
  };

  return (
    <Box sx={{
      maxWidth: 1200,
      margin: '0 auto',
      padding: { xs: 2, md: 4 },
      backgroundColor: '#f9fafb'
    }}>
      {/* Cabeçalho */}
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        mb: 4
      }}>
        <ArrowBackIos style={{cursor:'pointer'}} onClick={()=>{setModule('')}}/>
        <Typography variant="h4" sx={{
          fontWeight: 200,
          textAlign:'left',
          marginLeft:'10px'
        }}>
          {t("leads.leadGenerationTitle")}
        </Typography>

        <Box sx={{ width: 100 }} /> {/* Espaçador */}
      </Box>

      <Typography variant="body1" sx={{
        mb: 4,
        color: 'text.secondary',
        fontSize: '1.1rem'
      }}>
        {t("leads.leadGenerationDescription")}
      </Typography>

      {/* Card principal */}
      <Paper elevation={3} sx={{
        borderRadius: 3,
        overflow: 'hidden',
        mb: 6
      }}>

        <CardContent sx={{ p: 4 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={t("leads.formTitle")}
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={t("leads.description")}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    variant="outlined"
                  />
                </Grid>
              </Grid>
        <br/>
          {/* Seção: Campos do formulário */}
          <Accordion defaultExpanded elevation={0} sx={{ mb: 3 }}>
            <AccordionSummary expandIcon={<ChevronDown />}>
              <Typography variant="h6" sx={{ fontWeight: 500 }}>
              {t("leads.formFields")}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ mb: 2 }}>

                {formData.fields.map((field, index) => (
                  <Paper key={index} elevation={1} sx={{
                    p: 2,
                    mb: 2,
                    borderRadius: 2,
                    borderLeft: '4px solid',
                    borderColor: 'primary.main'
                  }}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} sm={5}>
                        <TextField
                          fullWidth
                          label={t("leads.fieldName")}
                          name="name"
                          value={field.name}
                          onChange={(e) => handleExtraFieldChange(index, e)}
                          variant="outlined"
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={8} sm={5}>
                        <Select
                          fullWidth
                          name="type"
                          value={field.type}
                          onChange={(e) => handleExtraFieldChange(index, e)}
                          variant="outlined"
                          size="small"
                        >
                          <MenuItem value="text">
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <TextCursorInput size={16} /> Text
                            </Box>
                          </MenuItem>
                          <MenuItem value="email">
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Mail size={16} /> E-mail
                            </Box>
                          </MenuItem>
                          <MenuItem value="phone">
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Smartphone size={16} /> Phone
                            </Box>
                          </MenuItem>
                        </Select>
                      </Grid>
                      <Grid item xs={4} sm={2} sx={{ textAlign: 'right' }}>
                        <IconButton
                          onClick={() => removeExtraField(index)}
                          color="error"
                          sx={{
                            backgroundColor: 'error.light',
                            '&:hover': { backgroundColor: 'error.main', color: 'white' }
                          }}
                        >
                          <Trash2 size={18} />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Paper>
                ))}
              </Box>

              <Button
                variant="outlined"
                startIcon={<PlusCircle size={20} />}
                onClick={addExtraField}
                sx={{
                  borderRadius: 2,
                  borderStyle: 'dashed'
                }}
              >
                {t("leads.addExtraField")}
              </Button>
            </AccordionDetails>
          </Accordion>

          {/* Seção: Mensagem persuasiva */}
          <Accordion elevation={0} sx={{ mb: 3 }}>
            <AccordionSummary expandIcon={<ChevronDown />}>
              <Typography variant="h6" sx={{ fontWeight: 500 }}>
                {t('leads.persuasiveMessage')}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TextField
                fullWidth
                multiline
                rows={4}
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder={t("leads.persuasiveMessagePlaceholder")}
                variant="outlined"
                sx={{ mb: 2 }}
              />
            </AccordionDetails>
          </Accordion>

          {/* Seção: Incentivos */}
          <Accordion elevation={0} sx={{ mb: 3 }}>
            <AccordionSummary expandIcon={<ChevronDown />}>
              <Typography variant="h6" sx={{ fontWeight: 500 }}>
              {t("leads.incentives")}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                {Object.keys(formData.incentives).map((key) => {
                  const checked = formData.incentives[key as keyof IIncentives];
                  return (
                    <Grid item xs={12} sm={6} key={key}>
                      <Paper elevation={checked ? 1 : 0} sx={{
                        p: 2,
                        borderRadius: 2,
                        border: checked ? '1px solid' : '1px dashed',
                        borderColor: checked ? 'primary.main' : 'divider',
                      }}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={checked}
                              onChange={(e) => handleCheckboxChange(e, "incentives")}
                              name={key}
                              color="primary"
                            />
                          }
                          label={
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              {t(`leads.incentive.${key}`)}
                            </Typography>
                          }
                        />
                        {checked && (
                          <Box sx={{ mt: 1, ml: 4 }}>
                            <TextField
                              fullWidth
                              margin="dense"
                              label={`Link para ${t(`leads.incentive.${key}`)}`}
                              value={formData.incentiveDetails[key as keyof IIncentiveDetails] || ""}
                              onChange={(e) => handleIncentiveDetailChange(key, e.target.value)}
                              variant="outlined"
                              size="small"
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <Link size={16} color="#666" />
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </Box>
                        )}
                      </Paper>
                    </Grid>
                  );
                })}
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* Seção: Opções de venda */}
          <Accordion elevation={0} sx={{ mb: 3 }}>
            <AccordionSummary expandIcon={<ChevronDown />}>
              <Typography variant="h6" sx={{ fontWeight: 500 }}>
                {t('leads.salesStrategy')}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                {Object.keys(formData.salesOptions).map((key) => (
                  <Grid item xs={12} sm={4} key={key}>
                    <Paper elevation={formData.salesOptions[key as keyof ISalesOptions] ? 2 : 0} sx={{
                      p: 2,
                      borderRadius: 2,
                      cursor: 'pointer',
                      border: formData.salesOptions[key as keyof ISalesOptions] ? '2px solid' : '1px solid',
                      borderColor: formData.salesOptions[key as keyof ISalesOptions] ? 'primary.main' : 'divider',
                      '&:hover': {
                        borderColor: 'primary.main'
                      }
                    }} onClick={() => {
                      // Simula o clique no checkbox
                      const event = {
                        target: {
                          name: key,
                          checked: !formData.salesOptions[key as keyof ISalesOptions]
                        }
                      } as React.ChangeEvent<HTMLInputElement>;
                      handleCheckboxChange(event, "salesOptions");
                    }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData.salesOptions[key as keyof ISalesOptions]}
                            onChange={(e) => handleCheckboxChange(e, "salesOptions")}
                            name={key}
                            color="primary"
                            sx={{ mr: 1 }}
                          />
                        }
                        label={
                          <Typography>
                            {key === "sellBefore"
                              ? t("leads.salesOptions.sellBefore")
                              : key === "sellAfter"
                              ? t("leads.salesOptions.sellAfter")
                              : t("leads.salesOptions.noOffer")}
                          </Typography>
                        }
                        sx={{ m: 0 }}
                      />
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* Botão de ação */}
          <Box sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            mt: 4,
            pt: 3,
            borderTop: '1px solid',
            borderColor: 'divider'
          }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleOpenPreview}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
                textTransform: 'none',
                fontSize: '1rem'
              }}
            >
              {t("leads.previewForm")}
            </Button>
          </Box>
        </CardContent>
      </Paper>

      {/* Preview modal (mantido igual) */}
      <LeadFormPreview
        formData={formData}
        setFormData={setFormData}
        showPreview={showPreview}
        handleClosePreview={handleClosePreview}
        handleConfirmCreate={handleConfirmCreate}
        apiKey={apiKey}
      />
    </Box>
  );
};

export default LeadGeneration;