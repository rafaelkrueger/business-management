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
  IconButton
} from "@mui/material";
import React, { useState } from "react";
import { ArrowLeft, PlusCircle, Trash2 } from "lucide-react";
import LeadsService from "../../../services/leads.service.ts";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import LeadFormPreview from "../form-preview/index.tsx";

// ================================== INTERFACES ================================== //
export interface IIncentives {
  ebook: boolean;
  webinar: boolean;
  desconto: boolean;
  consultoria: boolean;
  others: boolean;
}

export interface IIncentiveDetails {
  ebook?: string;
  webinar?: string;
  desconto?: string;
  consultoria?: string;
  others?: string;
}

interface IExtraActions {
  whatsappButton: boolean;
  subscribeNewsletter: boolean;
  followSocials: boolean;
  requestCallback: boolean;
}

interface ISalesOptions {
  sellBefore: boolean;
  sellAfter: boolean;
  noOffer: boolean;
}

interface IField {
  name: string;
  type: string;
}

export interface IFormData {
  title: string;
  description: string;
  companyId: string;
  message: string;
  templateId: string;
  incentives: IIncentives;
  incentiveDetails: IIncentiveDetails;
  extraActions: IExtraActions;
  salesOptions: ISalesOptions;
  fields: IField[];
}

// ============================ MAIN COMPONENT ============================= //
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
    <div style={{ padding: "20px", display: "grid", gap: "20px" }}>
      <div style={{ display: "flex", justifyContent: "flex-start" }}>
        <Button variant="text" onClick={() => setModule("")} startIcon={<ArrowLeft size={20} />}>
          {t("common.back")}
        </Button>
      </div>

      <Typography variant="h4">{t("leads.leadGenerationTitle")}</Typography>
      <Typography variant="body1">
        {t("leads.leadGenerationDescription")}
      </Typography>

      <Card sx={{ marginBottom: "5%" }}>
        <CardContent>
          <Typography variant="h6">{t("leads.createFormTitle")}</Typography>
          {/* Title and Description */}
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label={t("leads.formTitle")}
                name="title"
                value={formData.title}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label={t("leads.description")}
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </Grid>
          </Grid>

          {/* Extra Fields */}
          {formData.fields.map((field, index) => (
            <Grid container spacing={2} key={index} alignItems="center" sx={{ marginTop: "1%", marginLeft: "0.1%" }}>
              <Grid item xs={5}>
                <TextField
                  fullWidth
                  label={t("leads.fieldName")}
                  name="name"
                  value={field.name}
                  onChange={(e) => handleExtraFieldChange(index, e)}
                />
              </Grid>
              <Grid item xs={5}>
                <Select
                  fullWidth
                  name="type"
                  value={field.type}
                  onChange={(e) => handleExtraFieldChange(index, e)}
                >
                  <MenuItem value="text">{t("leads.fieldType.text")}</MenuItem>
                  <MenuItem value="email">{t("leads.fieldType.email")}</MenuItem>
                  <MenuItem value="phone">{t("leads.fieldType.phone")}</MenuItem>
                </Select>
              </Grid>
              <Grid item xs={2}>
                <IconButton onClick={() => removeExtraField(index)}>
                  <Trash2 size={20} />
                </IconButton>
              </Grid>
            </Grid>
          ))}

          <Button
            sx={{ marginLeft: "2%", marginTop: "1%" }}
            variant="text"
            startIcon={<PlusCircle size={20} />}
            onClick={addExtraField}
          >
            {t("leads.addExtraField")}
          </Button>

          {/* Persuasive Message */}
          <Grid container spacing={2} sx={{ marginTop: 2 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label={t("leads.persuasiveMessage")}
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder={t("leads.persuasiveMessagePlaceholder")}
              />
            </Grid>
          </Grid>

          {/* Incentives */}
          <Typography variant="h6" sx={{ marginTop: "20px" }}>
            {t("leads.incentivesQuestion")}
          </Typography>
          <Grid container spacing={1}>
            {Object.keys(formData.incentives).map((key) => {
              const checked = formData.incentives[key as keyof IIncentives];
              return (
                <Grid item xs={6} key={key}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={checked}
                        onChange={(e) => handleCheckboxChange(e, "incentives")}
                        name={key}
                      />
                    }
                    label={t(`leads.incentive.${key}`)}
                  />
                  {checked && (
                    <TextField
                      fullWidth
                      margin="dense"
                      label={t("leads.incentiveLink", { incentive: t(`leads.incentive.${key}`) })}
                      value={formData.incentiveDetails[key as keyof IIncentiveDetails] || ""}
                      onChange={(e) => handleIncentiveDetailChange(key, e.target.value)}
                    />
                  )}
                </Grid>
              );
            })}
          </Grid>

          {/* Sales Options */}
          <Typography variant="h6" sx={{ marginTop: "20px" }}>
            {t("leads.salesOptionsTitle")}
          </Typography>
          <Grid container spacing={1}>
            {Object.keys(formData.salesOptions).map((key) => (
              <Grid item xs={6} key={key}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.salesOptions[key as keyof ISalesOptions]}
                      onChange={(e) => handleCheckboxChange(e, "salesOptions")}
                      name={key}
                    />
                  }
                  label={
                    key === "sellBefore"
                      ? t("leads.salesOptions.sellBefore")
                      : key === "sellAfter"
                      ? t("leads.salesOptions.sellAfter")
                      : t("leads.salesOptions.noOffer")
                  }
                />
              </Grid>
            ))}
          </Grid>

          {/* Preview Button */}
          <Button
            variant="contained"
            color="primary"
            sx={{ marginTop: "10px" }}
            onClick={handleOpenPreview}
          >
            {t("leads.previewForm")}
          </Button>
        </CardContent>
      </Card>

      <LeadFormPreview
        formData={formData}
        setFormData={setFormData}
        showPreview={showPreview}
        handleClosePreview={handleClosePreview}
        handleConfirmCreate={handleConfirmCreate}
        apiKey={apiKey}
      />
    </div>
  );
};

export default LeadGeneration;
