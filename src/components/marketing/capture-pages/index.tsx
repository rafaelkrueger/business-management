import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Skeleton,
  Box,
  Tabs,
  Tab,
} from "@mui/material";
import { PlusCircle } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import LandingPageService from "../../../services/landing-page.service.ts";
import LeadsService from "../../../services/leads.service.ts";
import { useSnackbar } from "notistack";

// Importações para o Chart.js
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import LeadGeneration from "../create-leads/index.tsx";
import FormDetailsModal from "../leads-details/index.tsx";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// -----------------------
// Interfaces
// -----------------------

interface Template {
  componentScreenshotUrl: any;
  id: string;
  type: string;
  name: string;
  description: string;
  screenshotUrl: string;
}

interface PageView {
  timestamp: string;
  isNewUser: boolean;
}

interface LandingPage {
  id: string;
  title: string;
  description: string;
  views: number;
  createdAt: string;
  screenshotUrl?: string;
  pageviews?: PageView[];
  isActive?: boolean;
}

interface FormSubmission {
  id: string;
  apiKey: string;
  pageUrl: string;
  referrer: string;
  timestamp: string;
  location?: {
    latitude: number;
    longitude: number;
    accuracy: number;
  };
  device?: any;
  gender?: any;
  age?: any;
  language?: string;
  createdAt?: string;
  isNewUser?: boolean;
  fingerprint?: string;
}

interface FormDetail {
  id: string;
  formId: string;
  responseData: { [key: string]: any };
  createdAt: string;
  updatedAt: string;
}

interface FormLead {
  id: string;
  title: string;
  description: string;
  message: string;
  templateId: string;
  companyId: string;
  apiKey: string;
  incentives: {
    ebook: boolean;
    webinar: boolean;
    desconto: boolean;
    consultoria: boolean;
  };
  incentiveDetails: {
    ebook?: string;
    webinar?: string;
    desconto?: string;
    consultoria?: string;
    others?: string;
  };
  extraActions: {
    whatsappButton: boolean;
    subscribeNewsletter: boolean;
    followSocials: boolean;
    requestCallback: boolean;
  };
  salesOptions: {
    sellBefore: boolean;
    sellAfter: boolean;
    discountOffer: boolean;
    noOffer?: boolean;
  };
  fields: { name: string; type: string }[];
  created_at?: Date;
  updated_at?: Date;
  html: string;
  formlead: FormSubmission[];
}

interface IFormData {
  title: string;
  description: string;
  companyId: string;
  message: string;
  templateId: string;
  incentives: {
    ebook: boolean;
    webinar: boolean;
    desconto: boolean;
    consultoria: boolean;
    others: boolean;
  };
  incentiveDetails: {
    ebook?: string;
    webinar?: string;
    desconto?: string;
    consultoria?: string;
    others?: string;
  };
  extraActions: {
    whatsappButton: boolean;
    subscribeNewsletter: boolean;
    followSocials: boolean;
    requestCallback: boolean;
  };
  salesOptions: {
    sellBefore: boolean;
    sellAfter: boolean;
    noOffer: boolean;
  };
  fields: { name: string; type: string }[];
}

// -----------------------
// Função Auxiliar
// -----------------------

function ensureAbsolute(url: string): string {
  if (!url || url.trim() === "") return "#";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return "http://" + url;
}

// -----------------------
// Componentes de Gráficos
// -----------------------

const PageViewChart: React.FC<{ pageviews: PageView[] }> = ({ pageviews }) => {
  const { t } = useTranslation();
  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const formattedDate = `${String(date.getDate()).padStart(2, "0")}/${String(
        date.getMonth() + 1
      ).padStart(2, "0")}/${date.getFullYear()}`;
      days.push(formattedDate);
    }
    return days;
  };

  const days = getLast7Days();

  const pageViewCounts = days.map((day) =>
    pageviews.filter(
      (pv) => new Date(pv.timestamp).toLocaleDateString("pt-BR") === day
    ).length
  );

  const newUserCounts = days.map((day) =>
    pageviews.filter(
      (pv) =>
        new Date(pv.timestamp).toLocaleDateString("pt-BR") === day && pv.isNewUser
    ).length
  );

  const data = {
    labels: days,
    datasets: [
      {
        label: t("charts.pageViews"),
        data: pageViewCounts,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
      {
        label: t("charts.newUsers"),
        data: newUserCounts,
        backgroundColor: "rgba(153, 102, 255, 0.6)",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true },
    },
  };

  return (
    <div style={{ height: "300px" }}>
      <Bar data={data} options={options} />
    </div>
  );
};

const FormSubmissionsChart: React.FC<{ submissions: FormSubmission[] }> = ({ submissions }) => {
  const { t } = useTranslation();
  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const formattedDate = `${String(date.getDate()).padStart(2, "0")}/${String(
        date.getMonth() + 1
      ).padStart(2, "0")}/${date.getFullYear()}`;
      days.push(formattedDate);
    }
    return days;
  };

  const days = getLast7Days();

  const totalCounts = days.map((day) =>
    submissions.filter(
      (s) => new Date(s.timestamp).toLocaleDateString("pt-BR") === day
    ).length
  );

  const newUserCounts = days.map((day) =>
    submissions.filter(
      (s) =>
        new Date(s.timestamp).toLocaleDateString("pt-BR") === day && s.isNewUser
    ).length
  );

  const data = {
    labels: days,
    datasets: [
      {
        label: t("charts.views"),
        data: totalCounts,
        backgroundColor: "rgba(255, 159, 64, 0.6)",
      },
      {
        label: t("charts.newUsersForForms"),
        data: newUserCounts,
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" as const },
      title: { display: false },
    },
  };

  return (
    <div style={{ height: "150px", marginTop: "10px" }}>
      <Bar data={data} options={options} />
    </div>
  );
};

// -----------------------
// Componentes de Cards
// -----------------------

const LandingPageCard: React.FC<{
  page: LandingPage;
  onViewDetails: (page: LandingPage) => void;
  onViewWebsite: (page: LandingPage) => void;
}> = ({ page, onViewDetails, onViewWebsite }) => {
  const { t } = useTranslation();
  return (
    <Grid item xs={12} sm={6} md={4} key={page.id}>
      <Card>
        {page.screenshotUrl ? (
          <img
            src={page.screenshotUrl}
            alt={page.title}
            style={{ width: "100%", height: 180, objectFit: "cover" }}
          />
        ) : page.pageviews && page.pageviews.length > 0 ? (
          <div style={{ padding: "10px", marginTop: "-30px" }}>
            <PageViewChart pageviews={page.pageviews} />
          </div>
        ) : (
          <Skeleton variant="rectangular" width="100%" height={290} />
        )}
        <CardContent>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Typography variant="h6" component="span">
              {page.title} -
            </Typography>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: page.isActive
                  ? "rgba(0, 255, 0, 0.7)"
                  : "rgba(255, 0, 0, 0.7)",
                marginLeft: "10px",
                boxShadow: page.isActive
                  ? "0 0 3px rgba(0, 255, 0, 0.9)"
                  : "0 0 3px rgba(255, 0, 0, 0.9)",
                cursor: "pointer",
              }}
            />
          </div>
          <Typography variant="body2" color="textSecondary">
            {page.description}
          </Typography>
          <Typography variant="caption" color="textSecondary" display="block" style={{ marginTop: 8 }}>
            {t("marketing.capturePages.views", { count: page.views })}
          </Typography>
          <Typography variant="caption" color="textSecondary" display="block">
            {t("marketing.capturePages.createdAt")}: {new Date(page.createdAt).toLocaleDateString()}
          </Typography>
        </CardContent>
        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", margin: "8px" }}>
          <Button size="small" onClick={() => onViewDetails(page)}>
            {t("marketing.capturePages.viewDetails")}
          </Button>
          <Button size="small" onClick={() => onViewWebsite(page)}>
            {t("marketing.capturePages.viewLandingPage")}
          </Button>
        </Box>
      </Card>
    </Grid>
  );
};

const FormCard: React.FC<{
  form: FormLead;
  onViewDetails: (form: FormLead) => void;
  onViewWebsite: (form: FormLead) => void;
}> = ({ form, onViewDetails, onViewWebsite }) => {
  const { t } = useTranslation();
  return (
    <Grid item xs={12} sm={6} md={4} key={form.id}>
      <Card>
        <CardContent>
          <Typography variant="h6">{form.title}</Typography>
          <Typography variant="body2" color="textSecondary">
            {form.description || t("marketing.capturePages.noDescription")}
          </Typography>
          <Typography variant="caption" color="textSecondary" display="block">
            {t("marketing.capturePages.createdAt")}: {new Date(form.created_at || form.updated_at || Date.now()).toLocaleDateString()}
          </Typography>
          <FormSubmissionsChart submissions={form.formlead} />
        </CardContent>
        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", margin: "8px" }}>
          <Button size="small" onClick={() => onViewDetails(form)}>
            {t("marketing.capturePages.viewDetails")}
          </Button>
          <Button size="small" onClick={() => onViewWebsite(form)}>
            {t("marketing.capturePages.viewForm")}
          </Button>
        </Box>
      </Card>
    </Grid>
  );
};

// -----------------------
// Diálogo para Seleção de Template
// -----------------------

const TemplateDialog: React.FC<{
  open: boolean;
  onClose: () => void;
  templates: Template[];
  loading: boolean;
  selectedTemplate: Template | null;
  setSelectedTemplate: (template: Template) => void;
  newPage: { title: string; description: string };
  setNewPage: React.Dispatch<React.SetStateAction<{ title: string; description: string }>>;
  activeCompany: any;
  setPreviewUrl: (url: string) => void;
}> = ({
  open,
  onClose,
  templates,
  loading,
  selectedTemplate,
  setSelectedTemplate,
  newPage,
  setNewPage,
  activeCompany,
  setPreviewUrl,
}) => {
  const { t } = useTranslation();
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{t("marketing.templateDialog.title")}</DialogTitle>
      <DialogContent>
        <TextField
          label={t("marketing.templateDialog.titleLabel")}
          fullWidth
          margin="dense"
          onChange={(e) => setNewPage({ ...newPage, title: e.target.value })}
        />
        <TextField
          label={t("marketing.templateDialog.descriptionLabel")}
          fullWidth
          margin="dense"
          onChange={(e) => setNewPage({ ...newPage, description: e.target.value })}
        />
        <Typography variant="h6" style={{ marginTop: "20px" }}>
          {t("marketing.templateDialog.availableTemplates")}
        </Typography>
        <Grid container spacing={2} style={{ marginTop: "10px" }}>
          {loading
            ? [...Array(6)].map((_, index) => (
                <Grid item xs={4} key={index}>
                  <Skeleton variant="rectangular" width="100%" height={180} />
                  <Skeleton width="60%" height={25} style={{ marginTop: "10px" }} />
                  <Skeleton width="80%" height={20} />
                </Grid>
              ))
            : templates.map((template) => (
                <Grid item xs={4} key={template.id}>
                  <Card
                    onClick={() => setSelectedTemplate(template)}
                    sx={{
                      cursor: "pointer",
                      border: selectedTemplate?.id === template.id ? "2px solid blue" : "none",
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6">{template.name}</Typography>
                      {template.screenshotUrl ? (
                        <img
                          src={template.screenshotUrl}
                          alt={template.name}
                          width="100%"
                          style={{ borderRadius: "5px", marginTop: "10px" }}
                        />
                      ) : (
                        <Skeleton variant="rectangular" width="100%" height={150} />
                      )}
                      <Typography variant="body2">{template.description}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t("common.cancel")}</Button>
        <Button
          variant="contained"
          color="primary"
          disabled={!selectedTemplate || newPage.title === ""}
          onClick={() => {
            if (!selectedTemplate) return;
            setPreviewUrl(`https://roktune.duckdns.org/landing-pages/preview?type=${selectedTemplate.type}&companyId=${activeCompany}&title=${newPage.title}`);
          }}
        >
          {t("marketing.templateDialog.viewAndEdit")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// -----------------------
// Diálogo de Pré-visualização e Edição
// -----------------------

const PreviewDialog: React.FC<{
  open: boolean;
  previewUrl: string | null;
  onClose: () => void;
  showSavingOverlay: boolean;
  showComponents: boolean;
  loadingComponents: boolean;
  components: Template[];
  handleShowComponents: () => void;
  saveLandingPageAsActive: () => void;
}> = ({
  open,
  previewUrl,
  onClose,
  showSavingOverlay,
  showComponents,
  loadingComponents,
  components,
  handleShowComponents,
  saveLandingPageAsActive,
}) => {
  const { t } = useTranslation();
  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>{t("marketing.previewDialog.title")}</DialogTitle>
      <DialogContent style={{ position: "relative" }}>
        {previewUrl ? (
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <div style={{ position: "relative" }}>
                <iframe
                  id="previewIframe"
                  src={previewUrl}
                  width="100%"
                  height="500px"
                  style={{ border: "none" }}
                  title={t("marketing.previewDialog.title")}
                />
                {showSavingOverlay && (
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: "rgba(0, 0, 0, 0.5)",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      zIndex: 20000,
                    }}
                  >
                    <span style={{ color: "white", fontSize: "24px" }}>
                      {t("marketing.previewDialog.saving")}
                    </span>
                  </div>
                )}
              </div>
            </Grid>
            <Grid item xs={4}>
              {showComponents ? (
                <div>
                  <Typography variant="h6" gutterBottom>
                    {t("marketing.previewDialog.componentsTitle")}
                  </Typography>
                  {loadingComponents ? (
                    <Typography variant="body2">{t("common.loading")}</Typography>
                  ) : components.length > 0 ? (
                    <Grid container spacing={2} style={{ marginTop: "10px", maxHeight: "450px", overflowY: "auto" }}>
                      {components.map((comp) => (
                        <Grid item xs={12} key={comp.id}>
                          <Card>
                            <CardContent>
                              <Typography variant="h6">{comp.name}</Typography>
                              {comp.componentScreenshotUrl ? (
                                <img
                                  src={comp.componentScreenshotUrl}
                                  alt={comp.name}
                                  width="100%"
                                  style={{ borderRadius: "5px", marginTop: "10px" }}
                                />
                              ) : (
                                <Typography variant="body2">{t("marketing.previewDialog.noImage")}</Typography>
                              )}
                              <Typography variant="body2">{comp.description}</Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  ) : (
                    <Typography variant="body2">{t("marketing.previewDialog.noComponents")}</Typography>
                  )}
                </div>
              ) : (
                <div>
                  <Typography variant="subtitle1" gutterBottom>{t("marketing.previewDialog.instructionsTitle")}</Typography>
                  <Typography variant="body2" gutterBottom>
                    • {t("marketing.previewDialog.instructionText1")}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    • {t("marketing.previewDialog.instructionText2")}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    • {t("marketing.previewDialog.instructionText3")}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    • {t("marketing.previewDialog.instructionText4")}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    • {t("marketing.previewDialog.instructionText5")}
                  </Typography>
                </div>
              )}
            </Grid>
          </Grid>
        ) : (
          <Typography variant="body2">{t("common.loading")}</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={saveLandingPageAsActive}>{t("marketing.previewDialog.createLandingPage")}</Button>
      </DialogActions>
    </Dialog>
  );
};

// -----------------------
// Diálogo para Visualizar Detalhes da Landing Page
// -----------------------

const DetailsDialog: React.FC<{
  open: boolean;
  landingPage: LandingPage | null;
  onClose: () => void;
}> = ({ open, landingPage, onClose }) => {
  const { t } = useTranslation();
  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>{t("marketing.detailsDialog.title")}</DialogTitle>
      <DialogContent>
        <Typography variant="h6">{landingPage?.title}</Typography>
        <Typography variant="body2">{landingPage?.description}</Typography>
        {landingPage?.pageviews && landingPage.pageviews.length > 0 ? (
          <PageViewChart pageviews={landingPage.pageviews} />
        ) : (
          <Typography variant="body2">{t("marketing.detailsDialog.noPageviews")}</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t("common.close")}</Button>
      </DialogActions>
    </Dialog>
  );
};

// -----------------------
// Componente Principal
// -----------------------

const CapturePages: React.FC<{ activeCompany: any; setModule: any }> = ({ activeCompany, setModule }) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();

  // Estado da tab: 0 = Landing Pages, 1 = Formulários
  const [currentTab, setCurrentTab] = useState(0);
  const [landingPages, setLandingPages] = useState<LandingPage[]>([]);
  const [loadingPages, setLoadingPages] = useState(true);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [newPage, setNewPage] = useState({ title: "", description: "" });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showSavingOverlay, setShowSavingOverlay] = useState(false);
  const [leadGenerationEnabled, setLeadGenerationEnabled] = useState(false);
  const [viewFormDetails, setViewFormDetails] = useState("");
  const [forms, setForms] = useState<FormLead[]>([]);
  const [loadingForms, setLoadingForms] = useState(true);
  const [selectedLandingPage, setSelectedLandingPage] = useState<LandingPage | null>(null);

  const fetchLandingPages = () => {
    if (activeCompany) {
      setLoadingPages(true);
      LandingPageService.getlandingPages(activeCompany)
        .then((response) => {
          setLandingPages(response.data);
          setLoadingPages(false);
        })
        .catch((error) => {
          console.error("Erro ao buscar landing pages:", error);
          setLoadingPages(false);
        });
    }
  };

  const fetchTemplates = () => {
    setLoadingTemplates(true);
    LandingPageService.get()
      .then((response) => {
        setTemplates(response.data);
        setLoadingTemplates(false);
      })
      .catch((error) => {
        console.error("Erro ao buscar templates:", error);
        setLoadingTemplates(false);
      });
  };

  const fetchForms = () => {
    if (activeCompany) {
      setLoadingForms(true);
      LeadsService.getForms(activeCompany)
        .then((response) => {
          setForms(response.data);
          setLoadingForms(false);
        })
        .catch((error) => {
          console.error("Erro ao buscar formulários:", error);
          setLoadingForms(false);
        });
    }
  };

  useEffect(() => {
    fetchTemplates();
    fetchLandingPages();
  }, [activeCompany]);

  useEffect(() => {
    if (currentTab === 1) {
      fetchForms();
    }
  }, [currentTab, activeCompany]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleViewDetails = (page: LandingPage) => {
    setSelectedLandingPage(page);
  };

  const handleViewWebsite = (page: LandingPage) => {
    window.open(`https://roktune.duckdns.org/landing-pages/page/${page.id}`, "_blank");
  };

  const handleViewFormDetails = (form: FormLead) => {
    // Aqui, para o modal de detalhes dos formulários, definimos o formId para que o modal faça o fetch
    setViewFormDetails(form.id);
  };

  const handleViewFormWebsite = (form: FormLead) => {
    window.open(`https://roktune.duckdns.org/leads/form?apiKey=${form.apiKey}`, "_blank");
  };

  const saveLandingPageAsActive = () => {
    const iframe = document.getElementById("previewIframe") as HTMLIFrameElement;
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage({ type: "TRIGGER_SAVE" }, "*");
    } else {
      console.error("Iframe não encontrado ou inacessível.");
    }
    LandingPageService.post({ companyId: activeCompany, title: newPage.title })
      .then((res) => {
        enqueueSnackbar(t("marketing.capturePages.pageCreated"), {
          variant: "success",
        });
        setPreviewUrl(null);
        setOpenForm(false);
        fetchLandingPages();
      })
      .catch((error) => {
        console.error("Erro ao criar landing page:", error);
      });
  };

  if (leadGenerationEnabled) {
    return <LeadGeneration activeCompany={activeCompany} setModule={setModule} />;
  }

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        {t("marketing.capturePages.title")}
      </Typography>

      <Button
        variant="contained"
        color="primary"
        startIcon={<PlusCircle />}
        onClick={() => setOpenForm(true)}
      >
        {t("marketing.capturePages.createLandingPage")}
      </Button>

      <Button
        sx={{ marginLeft: "15px" }}
        variant="contained"
        color="primary"
        startIcon={<PlusCircle />}
        onClick={() => setLeadGenerationEnabled(true)}
      >
        {t("marketing.capturePages.createForm")}
      </Button>

      <Box sx={{ borderBottom: 1, borderColor: "divider", marginTop: "20px" }}>
        <Tabs value={currentTab} onChange={handleTabChange}>
          <Tab label={t("marketing.capturePages.landingPagesTab")} />
          <Tab label={t("marketing.capturePages.formsTab")} />
        </Tabs>
      </Box>

      {currentTab === 0 && (
        <Box sx={{ marginTop: "20px" }}>
          <Grid container spacing={2}>
            {loadingPages ? (
              Array.from(new Array(3)).map((_, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Skeleton variant="rectangular" width="100%" height={180} />
                  <Skeleton width="80%" height={20} style={{ marginTop: 10 }} />
                  <Skeleton width="60%" height={20} />
                </Grid>
              ))
            ) : landingPages.length > 0 ? (
              landingPages.map((page) => (
                <LandingPageCard
                  key={page.id}
                  page={page}
                  onViewDetails={handleViewDetails}
                  onViewWebsite={handleViewWebsite}
                />
              ))
            ) : (
              <Typography variant="body2">
                {t("marketing.capturePages.noLandingPageFound")}
              </Typography>
            )}
          </Grid>
        </Box>
      )}

      {currentTab === 1 && (
        <Box sx={{ marginTop: "20px" }}>
          {loadingForms ? (
            <Grid container spacing={2}>
              {Array.from(new Array(6)).map((_, i) => (
                <Grid item xs={4} key={i}>
                  <Skeleton variant="rectangular" width="100%" height={150} />
                  <Skeleton width="60%" height={25} style={{ marginTop: "10px" }} />
                  <Skeleton width="80%" height={20} />
                </Grid>
              ))}
            </Grid>
          ) : forms.length > 0 ? (
            <Grid container spacing={2}>
              {forms.map((form) => (
                <FormCard
                  key={form.id}
                  form={form}
                  onViewDetails={handleViewFormDetails}
                  onViewWebsite={handleViewFormWebsite}
                />
              ))}
            </Grid>
          ) : (
            <Typography variant="body2">
              {t("marketing.capturePages.noFormFound")}
            </Typography>
          )}
        </Box>
      )}

      <TemplateDialog
        open={openForm}
        onClose={() => setOpenForm(false)}
        templates={templates}
        loading={loadingTemplates}
        selectedTemplate={selectedTemplate}
        setSelectedTemplate={setSelectedTemplate}
        newPage={newPage}
        setNewPage={setNewPage}
        activeCompany={activeCompany}
        setPreviewUrl={setPreviewUrl}
      />

      <PreviewDialog
        open={Boolean(previewUrl)}
        previewUrl={previewUrl}
        onClose={() => setPreviewUrl(null)}
        showSavingOverlay={showSavingOverlay}
        showComponents={false}
        loadingComponents={false}
        components={[]}
        handleShowComponents={() => {}}
        saveLandingPageAsActive={saveLandingPageAsActive}
      />

      <DetailsDialog
        open={Boolean(selectedLandingPage)}
        landingPage={selectedLandingPage}
        onClose={() => setSelectedLandingPage(null)}
      />

      {/* Modal para ver os detalhes dos formulários */}
      <FormDetailsModal
        open={viewFormDetails !== ""}
        formId={viewFormDetails}
        onClose={() => setViewFormDetails("")}
      />
    </div>
  );
};

export default CapturePages;
