import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import { ArrowLeft } from "lucide-react";
import LeadsService from "../../../services/leads.service.ts";
import { useTranslation } from "react-i18next";

interface IField {
  name: string;
  type: string;
}
interface ISalesOptions {
  sellBefore: boolean;
  sellAfter: boolean;
  noOffer: boolean;
}
interface IIncentives {
  ebook: boolean;
  webinar: boolean;
  desconto: boolean;
  consultoria: boolean;
  others: boolean;
}
interface IIncentiveDetails {
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
export interface IFormData {
  title: string;
  description: string;
  message: string;
  templateId: string;
  incentives: IIncentives;
  incentiveDetails: IIncentiveDetails;
  extraActions: IExtraActions;
  salesOptions: ISalesOptions;
  fields: IField[];
}

interface ITemplate {
  id: string;
  name: string;
  htmlContent: string;
  active: boolean;
}

interface LeadFormPreviewProps {
  formData: IFormData;
  setFormData: any;
  showPreview: boolean;
  handleClosePreview: () => void;
  handleConfirmCreate: (htmlContent: string) => void;
  apiKey: string;
}

const LeadFormPreview: React.FC<LeadFormPreviewProps> = ({
  formData,
  setFormData,
  showPreview,
  handleClosePreview,
  handleConfirmCreate,
  apiKey,
}) => {
  const { t } = useTranslation();
  const [templates, setTemplates] = useState<ITemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [finalHTML, setFinalHTML] = useState("");

  // States for integration modal
  const [showIntegrationModal, setShowIntegrationModal] = useState(false);
  const [integrationData, setIntegrationData] = useState({
    embedCode: "",
    directLink: "",
  });

  // Ref for the iframe element
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // When the preview modal opens, fetch templates
  useEffect(() => {
    if (showPreview) {
      LeadsService.getTemplates()
        .then((res) => {
          const data = res.data as ITemplate[];
          setTemplates(data);
          if (data.length > 0) {
            const firstTemplateId = data[0].id;
            setSelectedTemplateId(firstTemplateId);
            // Update formData with the first templateId
            setFormData((prev: IFormData) => ({ ...prev, templateId: firstTemplateId }));
          }
        })
        .catch((err) => console.error(t("leads.templateFetchError"), err));
    }
  }, [showPreview, setFormData, t]);

  // When preview is open, template or formData change, fetch final HTML
  useEffect(() => {
    if (showPreview && selectedTemplateId) {
      const updatedFormData = { ...formData, templateId: selectedTemplateId };
      LeadsService.getFormPreview(updatedFormData)
        .then((res) => {
          setFinalHTML(res.data);
        })
        .catch((err) => {
          console.error(t("leads.previewFetchError"), err);
        });
    }
  }, [showPreview, selectedTemplateId, formData, t]);

  const handleTemplateChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    const newTemplateId = e.target.value as string;
    setSelectedTemplateId(newTemplateId);
    setFormData((prev: IFormData) => ({ ...prev, templateId: newTemplateId }));
  };

  // Add an event listener to the iframe's submit button to transition form stages
  useEffect(() => {
    if (showPreview && iframeRef.current && iframeRef.current.contentDocument) {
      const doc = iframeRef.current.contentDocument;
      const btn = doc.getElementById("btnSubmit");
      if (btn) {
        const handler = (evt: Event) => {
          evt.preventDefault();
          // Hide the form and show the post-submit rewards container
          const formEl = doc.getElementById("leadForm");
          const rewardsEl = doc.getElementById("postSubmitRewardsContainer");
          if (formEl) formEl.style.display = "none";
          if (rewardsEl) rewardsEl.style.display = "block";
        };
        btn.addEventListener("click", handler);
        return () => {
          btn.removeEventListener("click", handler);
        };
      }
    }
  }, [showPreview, finalHTML]);

  // When apiKey is available, set integration modal data
  useEffect(() => {
    const directLink = `https://roktune.duckdns.org/leads/form?apiKey=${apiKey}`;
    const embedCode = `<iframe src="${directLink}" frameborder="0" width="100%" height="600"></iframe>`;
    setIntegrationData({ embedCode, directLink });
    if (apiKey) {
      setShowIntegrationModal(true);
    }
  }, [apiKey]);

  const handleCloseIntegrationModal = () => {
    setShowIntegrationModal(false);
    handleClosePreview();
  };

  // When the user clicks "Confirm and Create", extract the HTML from the iframe and send it
  const handleConfirmAndCreate = () => {
    if (iframeRef.current && iframeRef.current.contentDocument) {
      const htmlContent = iframeRef.current.contentDocument.documentElement.outerHTML;
      handleConfirmCreate(htmlContent);
    } else {
      // Fallback: use finalHTML
      handleConfirmCreate(finalHTML);
    }
  };

  return (
    <>
      <Dialog open={showPreview} onClose={handleClosePreview} maxWidth="md" fullWidth>
        <DialogTitle>{t("leads.formPreviewTitle")}</DialogTitle>
        <DialogContent dividers>
          {templates.length > 0 && (
            <div style={{ marginBottom: 10, textAlign: "left" }}>
              <label>{t("leads.selectTemplate")}</label>
              <Select
                style={{ marginLeft: 10, width: 200 }}
                value={selectedTemplateId}
                onChange={handleTemplateChange}
              >
                {templates.map((tpl) => (
                  <MenuItem key={tpl.id} value={tpl.id}>
                    {tpl.name}
                  </MenuItem>
                ))}
              </Select>
            </div>
          )}
          {/* Render final HTML inside an iframe */}
          <iframe
            ref={iframeRef}
            srcDoc={finalHTML}
            title={t("leads.formPreviewTitle")}
            width="100%"
            height="600px"
            frameBorder="0"
            style={{ border: "none" }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePreview} color="inherit">
            {t("common.cancel")}
          </Button>
          <Button onClick={handleConfirmAndCreate} color="primary" variant="contained">
            {t("leads.confirmAndCreate")}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Integration Modal */}
      <Dialog open={showIntegrationModal} onClose={handleCloseIntegrationModal} maxWidth="sm" fullWidth>
        <DialogTitle>{t("leads.formIntegrationTitle")}</DialogTitle>
        <DialogContent dividers>
          <p>{t("leads.integrationDescription")}</p>
          <h4>{t("leads.embedCode")}</h4>
          <TextField
            fullWidth
            multiline
            minRows={3}
            variant="outlined"
            value={integrationData.embedCode}
            InputProps={{ readOnly: true }}
            margin="normal"
          />
          <p>{t("leads.directLink")}</p>
          <TextField
            fullWidth
            variant="outlined"
            value={integrationData.directLink}
            InputProps={{ readOnly: true }}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseIntegrationModal} color="primary">
            {t("common.close")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default LeadFormPreview;
