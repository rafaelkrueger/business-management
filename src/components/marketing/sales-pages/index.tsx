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
  ToggleButtonGroup,
  ToggleButton,
  FormGroup,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  LinearProgress,
  Stack,
  Chip,
  IconButton,
} from "@mui/material";
import { AlertCircle, Check, CheckCircle, Clock, ExternalLink, Eye, HistoryIcon, Pencil, PlusCircle, Trash2 } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import SalesPageService from "../../../services/sales-page.service.ts";
import LeadsService from "../../../services/leads.service.ts";
import PaymentService from "../../../services/payment.service.ts";
import { useSnackbar } from "notistack";
import ProgressService from "../../../services/progress.service.ts";

// Importações para o Chart.js
import { Bar, Line } from "react-chartjs-2";
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
import CreateCheckoutForm from "../create-checkout/index.tsx";
import FormDetailsModal from "../leads-details/index.tsx";
import { AccessTime, ArrowBackIos, Close, FormatListBulletedOutlined, InsertDriveFileOutlined } from "@mui/icons-material";
import AiService from "../../../services/ai.service.ts";
import { CartesianGrid, XAxis, YAxis, LineChart, Line as RechartsLine } from "recharts";
import PaymentHistoryModal from "../../payments/PaymentHistoryModal.tsx";

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

interface SalesPage {
  id: string;
  title: string;
  description: string;
  views: number;
  createdAt: string;
  screenshotUrl?: string;
  pageviews?: PageView[];
  isActive?: boolean;
}

interface Payment {
  paymentDescription: ReactNode;
  paymentName: ReactNode;
  id: string;
  amount: number;
  description: string;
  paymentDate: string;
  paymentMethod: string;
  currency: string;
  status: string;
  link?: string;
  publicCheckout?: boolean;
  productId?: string;
  companyId?: string;
  customerId?: string;
  stripeSessionId?: string;
  stripePaymentIntentId?: string;
  createdAt?: string;
  updatedAt?: string;
  paymentHistory?: any;
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

const SalesPageCard: React.FC<{
  page: SalesPage;
  onViewDetails: (page: SalesPage) => void;
  onViewWebsite: (page: SalesPage) => void;
  onEdit: (page: SalesPage) => void;
}> = ({ page, onViewDetails, onViewWebsite, onEdit }) => {
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
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        margin: "8px"
      }}
    >
      <Button
        size="small"
        onClick={() => onViewDetails(page)}
        startIcon={<Eye size={16} color="#578acd" />}
      >
        {t("marketing.capturePages.viewDetails")}
      </Button>

      <Button
        size="small"
        onClick={() => onEdit(page)}
        startIcon={<Pencil size={16} color="#578acd" />}
        sx={{ marginLeft: '0px' }}
      >
        {t("marketing.capturePages.editPage")} Sales Page
      </Button>

      <Button
        size="small"
        onClick={() => onViewWebsite(page)}
        startIcon={<ExternalLink size={16} color="#578acd" />}
      >
        {t("marketing.capturePages.viewSalesPage")}
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

const PaymentCard: React.FC<{ payment: Payment; onDelete: (p: Payment) => void }> = ({ payment, onDelete }) => {
    const [open, setOpen] = useState(false);

    const historyData = (payment.paymentHistory || []).map((h) => ({
    date: new Date(h.paymentDate).toLocaleDateString(),
    amount: Number(h.amount),
  }));
  return (
    <Grid item xs={12} sm={6} md={4} key={payment.id}>
      <PaymentHistoryModal
        open={open}
        onClose={() => setOpen(false)}
        history={payment.paymentHistory || []}
      />
      <Card sx={{
        borderLeft: '4px solid',
        borderLeftColor: payment.publicCheckout ? '#2c3eb0' : payment.status === 'paid' ? '#4caf50' : '#ff9800',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <LineChart width={350} height={200} data={historyData} style={{ marginTop: 8, width:'100%', height:'100%', marginLeft: -30 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 10 }} />
          <RechartsLine type="monotone" dataKey="amount" stroke="#3b82f6" />
        </LineChart>
        <CardContent sx={{ flexGrow: 1, marginTop:'-30px' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', flexDirection:'column' }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 'bold',
                mb: 1,
                color: 'text.primary'
              }}
            >
              {payment.paymentName}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                mb: 1,
                color: 'text.primary'
              }}
            >
              {payment.paymentDescription}
            </Typography>
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1, mb:1.7 }}>
            {(payment.description || '')
              .split(',')
              .map((tag, index) => (
                <Chip
                  key={index}
                  label={tag.trim()}
                  color="primary"
                  variant="outlined"
                />
              ))}
          </Stack>
          </Box>

          {!payment.publicCheckout && (
            <Typography
              variant="body2"
              sx={{
                color: payment.status === 'paid' ? 'success.main' : 'warning.main',
                mb: 1.5,
                display: 'inline-block',
                px: 1,
                py: 0.5,
                bgcolor: payment.status === 'paid' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(255, 152, 0, 0.1)',
                borderRadius: 1
              }}
            >
              {payment.status === 'paid' ? 'Paid' : 'Pending'}
            </Typography>
          )}

          {payment.publicCheckout && (
            <Typography
              variant="body2"
              sx={{
                color: '#2c3eb0',
                mb: 1.5,
                display: 'inline-block',
                px: 1,
                py: 0.5,
                bgcolor: '#e7eaf9',
                borderRadius: 1
              }}
            >
              Public
            </Typography>
          )}

          <Typography
            variant="h6"
            sx={{
              fontWeight: 'bold',
              mb: 1.5,
              color: 'text.primary'
            }}
          >
           ${payment.amount}
          </Typography>

          <Typography
            variant="caption"
            display="block"
            sx={{
              color: 'text.secondary',
              mt: 'auto'
            }}
          >
            {new Date(payment.paymentDate).toLocaleDateString()}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, marginLeft:'70%', marginTop:'-10%' }}>
            <Trash2 size={18} style={{ cursor: 'pointer' }} onClick={() => onDelete(payment)} />
              {payment.link && (
                <ExternalLink
                  size={18}
                  style={{ cursor: 'pointer' }}
                  onClick={() => window.open(payment.link as string, '_blank')}
                />
              )}
              <HistoryIcon onClick={() => setOpen(true)} size={18} />
            </Box>
        </CardContent>
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
  newPage: { title: string; description: string; aiPrompt?: string };
  setNewPage: React.Dispatch<React.SetStateAction<{ title: string; description: string; aiPrompt?: string }>>;
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
  const [mode, setMode] = useState<"choose" | "ai">("choose");
  const [customSectionInput, setCustomSectionInput] = useState("");
  const [progress, setProgress] = useState();
  const [generating, setGenerating] = useState(false);

  const sectionLabels: Record<string, string> = {
  salesPage:'Sales Page'
};
  const [sections, setSections] = useState<string[]>([
    "Sales Page",
  ]);

  const handleDrag = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.dataTransfer.setData("sectionIndex", index.toString());
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
    const draggedIndex = parseInt(e.dataTransfer.getData("sectionIndex"));
    if (!isNaN(draggedIndex)) {
      const updated = [...sections];
      const [removed] = updated.splice(draggedIndex, 1);
      updated.splice(dropIndex, 0, removed);
      setSections(updated);
    }
  };

  const handleAddCustomSection = () => {
    const trimmed = customSectionInput.trim();
    if (trimmed && !sections.includes(trimmed)) {
      const withoutFooter = sections.filter((s) => s !== "footer");
      setSections([...withoutFooter, trimmed, "footer"]);
      setCustomSectionInput("");
    }
  };

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


  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogContent>
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
              onChange={(_, newMode) => newMode && setMode(newMode)}
              sx={{ mb: 2 }}
              fullWidth
            >
              <ToggleButton value="choose">{t("marketing.templateDialog.chooseTemplate")}</ToggleButton>
              <ToggleButton value="ai">{t("marketing.templateDialog.createAiTemplate")}</ToggleButton>
            </ToggleButtonGroup>

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

            {mode === "choose" && (
              <Grid container spacing={2} sx={{ mt: 2, p: 2, background: 'rgba(223, 223, 223, 0.187)', borderRadius: '20px' }}>
                {loading
                  ? [...Array(6)].map((_, index) => (
                      <Grid item xs={4} key={index}>
                        <Skeleton variant="rectangular" width="100%" height={180} />
                        <Skeleton width="60%" height={25} sx={{ mt: 1 }} />
                        <Skeleton width="80%" height={20} />
                      </Grid>
                    ))
                  : templates.map((template) => (
                      <Grid item xs={4} key={template.id}>
                        <Card
                          onClick={() => setSelectedTemplate(template)}
                          sx={{
                            cursor: "pointer",
                            boxShadow: 3,
                            border: selectedTemplate?.id === template.id ? "2px solid blue" : "none",
                          }}
                        >
                          {template.screenshotUrl ? (
                            <img src={template.screenshotUrl} alt={template.name} width="100%" style={{ borderRadius: 5 }} />
                          ) : (
                            <Skeleton variant="rectangular" width="100%" height={150} />
                          )}
                        </Card>
                      </Grid>
                    ))}
              </Grid>
            )}

            {mode === "ai" && (
              <Box mt={3}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  placeholder={t("marketing.templateDialog.aiPromptHint")}
                  onChange={(e) => setNewPage({ ...newPage, aiPrompt: e.target.value })}
                />

                <FormGroup sx={{ mt: 3 }}>
                  <Typography fontWeight={600} mb={1}>{t("marketing.templateDialog.chooseSections")}</Typography>
                  <Box>
                    {sections.map((section, index) => (
                      <Box
                        key={section + index}
                        draggable
                        onDragStart={(e) => handleDrag(e, index)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => handleDrop(e, index)}
                        sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, p: 1, border: '1px dashed #ccc', borderRadius: 1 }}
                      >
                        <Checkbox
                          checked
                          onChange={() => {
                            const updated = sections.filter((s) => s !== section);
                            setSections(updated);
                          }}
                        />
                        <Typography>{sectionLabels[section] || section}</Typography>
                        <Typography variant="caption" sx={{ ml: 'auto', color: '#888', cursor:'pointer' }}>::  ::</Typography>
                      </Box>
                    ))}
                  </Box>
                </FormGroup>

                {/* <Box mt={3}>
                  <Typography fontWeight={500} mb={1}>{t("marketing.templateDialog.addMoreSections")}</Typography>
                  <Box display="flex" gap={1} alignItems="center">
                    <TextField
                      fullWidth
                      value={customSectionInput}
                      onChange={(e) => setCustomSectionInput(e.target.value)}
                      placeholder="Ex: FAQ, Newsletter..."
                      margin="dense"
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ height: '55px', borderTopLeftRadius:'0px', borderBottomLeftRadius:'0px', whiteSpace: 'nowrap', mt: '4px', marginLeft:'-8px' }}
                      onClick={handleAddCustomSection}
                    >
                      <PlusCircle size={30}/>
                    </Button>
                  </Box>
                </Box> */}
              </Box>
            )}
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t("common.cancel")}</Button>
        <Button
          variant="contained"
          color="primary"
          disabled={newPage.title === "" || (mode === "choose" && !selectedTemplate) || generating}
          onClick={async () => {
            if (mode === "choose") {
              setPreviewUrl(`https://roktune.duckdns.org/sales-pages/preview?type=${selectedTemplate.type}&companyId=${activeCompany}&title=${newPage.title}&salesPage=true`);
            } else {
              const orderedSections = sections.filter((s) => s.trim() !== "");
              setGenerating(true);

              await SalesPageService.postAiTemplate({
                title: newPage.title,
                description: newPage.description,
                aiPrompt: newPage.aiPrompt,
                sections: orderedSections,
                companyId: activeCompany,
              }).then((res)=>{
                setGenerating(false);
                setProgress({});
                setPreviewUrl(`https://roktune.duckdns.org/sales-pages/preview?type=${res.data}&companyId=${activeCompany}&title=${newPage.title}&salesPage=true`);
              })
              .catch((err)=>{console.log(err)});

              setGenerating(false);
            }
          }}
        >
          {mode === "choose"
            ? t("marketing.templateDialog.viewAndEdit")
            : t("marketing.templateDialog.generateAiTemplate")}
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
  saveSalesPageAsActive: () => void;
  creatingSalesPage: boolean;
}> = ({
  open,
  previewUrl,
  onClose,
  showSavingOverlay,
  showComponents,
  loadingComponents,
  components,
  handleShowComponents,
  saveSalesPageAsActive,
  creatingSalesPage
}) => {
  const { t } = useTranslation();
  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogContent>
        {previewUrl ? (
          <Grid style={{ width:'100%'}}>
            <Grid style={{ width:'100%'}} item xs={12} sm={6}>
              <div style={{ width:'100%'}}>
                <iframe
                  id="previewIframe"
                  src={previewUrl}
                  width="100%"
                  height="500px"
                  style={{ border: "none" }}
                  title={t("marketing.previewDialog.title")}
                />
              </div>
            </Grid>
          </Grid>
        ) : (
          <Typography variant="body2">{t("common.loading")}</Typography>
        )}
      </DialogContent>
      <DialogActions>
      <Button
        onClick={saveSalesPageAsActive}
        disabled={creatingSalesPage}
        variant="contained"
        startIcon={creatingSalesPage ? <CircularProgress size={20} /> : null}
      >
        {creatingSalesPage ? '' : t("marketing.previewDialog.createSalesPage")}
      </Button>
    </DialogActions>
    </Dialog>
  );
};

// -----------------------
// Diálogo para Visualizar Detalhes da Sales Page
// -----------------------

const DetailsDialog: React.FC<{
  open: boolean;
  salesPage: SalesPage | null;
  onClose: () => void;
}> = ({ open, salesPage, onClose }) => {
  const { t } = useTranslation();
  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>{t("marketing.detailsDialog.title")}</DialogTitle>
      <DialogContent>
        <Typography variant="h6">{salesPage?.title}</Typography>
        <Typography variant="body2">{salesPage?.description}</Typography>
        {salesPage?.pageviews && salesPage.pageviews.length > 0 ? (
          <PageViewChart pageviews={salesPage.pageviews} />
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

const EditDialog: React.FC<{
  open: boolean;
  salesPage: SalesPage | null;
  onClose: () => void;
  onDelete: (id: string) => void;
}> = ({ open, salesPage, onClose, onDelete }) => {
  const { t } = useTranslation();
  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>{salesPage?.title}</DialogTitle>
      <DialogContent>
        {salesPage ? (
          <iframe
            src={`https://roktune.duckdns.org/sales-pages/edit/${salesPage.id}`}
            width="100%"
            height="500px"
            style={{ border: "none" }}
            title={salesPage.title}
          />
        ) : (
          <Typography variant="body2">{t("common.loading")}</Typography>
        )}
      </DialogContent>
      <DialogActions>
        {salesPage && (
          <Button color="error" onClick={() => onDelete(salesPage.id)}>
            {t("marketing.capturePages.deletePage")}
          </Button>
        )}
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

  // Estado da tab: 0 = Sales Pages, 1 = Formulários
  const [currentTab, setCurrentTab] = useState(0);
  const [salesPages, setSalesPages] = useState<SalesPage[]>([]);
  const [loadingPages, setLoadingPages] = useState(true);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [newPage, setNewPage] = useState({ title: "", description: "" });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showSavingOverlay, setShowSavingOverlay] = useState(false);
  const [leadGenerationEnabled, setLeadGenerationEnabled] = useState(false);
  const [checkoutFormEnabled, setCheckoutFormEnabled] = useState(false);
  const [viewFormDetails, setViewFormDetails] = useState("");
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loadingPayments, setLoadingPayments] = useState(true);
  const [paymentToDelete, setPaymentToDelete] = useState<Payment | null>(null);
  const [creatingSalesPage, setCreatingSalesPage] = useState(false);
  const [saveButton, setSaveButton] = useState(false);
  const [selectedSalesPage, setSelectedSalesPage] = useState<SalesPage | null>(null);
  const [editingPage, setEditingPage] = useState<SalesPage | null>(null);

  const fetchSalesPages = () => {
    if (activeCompany) {
      setLoadingPages(true);
      SalesPageService.getSalesPages(activeCompany)
        .then((response) => {
          setSalesPages(response.data);
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
    SalesPageService.get()
      .then((response) => {
        setTemplates(response.data);
        setLoadingTemplates(false);
      })
      .catch((error) => {
        console.error("Erro ao buscar templates:", error);
        setLoadingTemplates(false);
      });
  };

  const fetchPayments = () => {
    if (activeCompany) {
      setLoadingPayments(true);
      PaymentService.get(activeCompany)
        .then((response) => {
          setPayments(response.data);
          setLoadingPayments(false);
        })
        .catch((error) => {
          console.error("Erro ao buscar pagamentos:", error);
          setLoadingPayments(false);
        });
    }
  };

  useEffect(() => {
    fetchTemplates();
    fetchSalesPages();
  }, [activeCompany]);

  // Novo useEffect para buscar os templates sempre que o modal de criação for aberto
  useEffect(() => {
    if (openForm) {
      fetchTemplates();
    }
  }, [openForm]);

  useEffect(() => {
    if (currentTab === 1) {
      fetchPayments();
    }
  }, [currentTab, activeCompany]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleViewDetails = (page: SalesPage) => {
    setSelectedSalesPage(page);
  };

  const handleViewWebsite = (page: SalesPage) => {
    window.open(`https://roktune.duckdns.org/sales-pages/page/${page.id}`, "_blank");
  };

  const handleEditPage = (page: SalesPage) => {
    setEditingPage(page);
  };

  const handleDeletePage = async (id: string) => {
    try {
      await SalesPageService.delete(id);
      setSalesPages((prev) => prev.filter((p) => p.id !== id));
      enqueueSnackbar(t("marketing.capturePages.pageDeleted"), { variant: "success" });
    } catch (error) {
      console.error("Erro ao deletar landing page:", error);
      enqueueSnackbar(t("marketing.capturePages.deleteError"), { variant: "error" });
    } finally {
      setEditingPage(null);
    }
  };

  const handleViewFormDetails = (form: FormLead) => {
    // Aqui, para o modal de detalhes dos formulários, definimos o formId para que o modal faça o fetch
    setViewFormDetails(form.id);
  };

  const handleViewFormWebsite = (form: FormLead) => {
    window.open(`https://roktune.duckdns.org/leads/form?apiKey=${form.apiKey}`, "_blank");
  };

  const confirmDeletePayment = async () => {
    if (!paymentToDelete) return;
    try {
      await PaymentService.delete(paymentToDelete.id);
      setPayments((prev) => prev.filter((p) => p.id !== paymentToDelete.id));
    } catch (err) {
      console.error(err);
    } finally {
      setPaymentToDelete(null);
    }
  };

  const saveSalesPageAsActive = async () => {
    if(!saveButton){
      enqueueSnackbar('Click on save button before creating a new landing page', {variant:'info'})
      setSaveButton(true)
    }
    const iframe = document.getElementById("previewIframe") as HTMLIFrameElement;
    console.log(iframe.contentDocument)
    if (iframe?.contentWindow && iframe.contentDocument) {
      const saveButton = iframe.contentDocument.getElementById("saveButton") as HTMLButtonElement;
      if (saveButton) {
        saveButton.click();
      } else {
        console.error("Botão saveButton não encontrado dentro do iframe.");
      }
    } else {
      console.error("Iframe não encontrado ou inacessível.");
    }

    await new Promise((resolve) => setTimeout(resolve, 10000));

    SalesPageService.post({ companyId: activeCompany, title: newPage.title })
      .then((res) => {
        enqueueSnackbar(t("marketing.capturePages.pageCreated"), {
          variant: "success",
        });
        setPreviewUrl(null);
        setOpenForm(false);
        fetchSalesPages();
      })
      .catch((error) => {
        console.error("Erro ao criar landing page:", error);
      }).finally(()=>{
        setCreatingSalesPage(false)
      });
  };


  if (checkoutFormEnabled) {
    return <CreateCheckoutForm activeCompany={activeCompany} setModule={setModule} />;
  }

  if (leadGenerationEnabled) {
    return <LeadGeneration activeCompany={activeCompany} setModule={setModule} />;
  }

  return (
    <div style={{ padding: "20px" }}>
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 2,
        marginBottom: 2
      }}>
          <Box sx={{display:'flex'}}>
            <ArrowBackIos style={{cursor:'pointer', marginTop:'10px', marginRight:'20px'}} onClick={()=>{setModule('')}}/>
            <Typography variant="h4">
              {t("marketing.capturePages.titleSales")}
            </Typography>
          </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<PlusCircle />}
            onClick={() => setOpenForm(true)}
            sx={{ whiteSpace: 'nowrap' }}
          >
            {t("marketing.capturePages.createSalesPage")}
          </Button>

          <Button
            variant="contained"
            color="primary"
            startIcon={<PlusCircle />}
            onClick={() => setCheckoutFormEnabled(true)}
            sx={{ whiteSpace: 'nowrap' }}
          >
            {t("marketing.capturePages.createFormSales")}
          </Button>
        </Box>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={currentTab} onChange={handleTabChange}>
          <Tab label={t("marketing.capturePages.salesPagesTab")} />
          <Tab label={t("marketing.capturePages.formsTabSales")} />
        </Tabs>
      </Box>
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
            ) : salesPages.length > 0 ? (
              salesPages.map((page) => (
                <SalesPageCard
                  key={page.id}
                  page={page}
                  onViewDetails={handleViewDetails}
                  onViewWebsite={handleViewWebsite}
                  onEdit={handleEditPage}
                />
              ))
            ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              mt: 8,
              opacity: 0.8,
            }}
          >
            <InsertDriveFileOutlined sx={{ fontSize: 80, color: "grey.400" }} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              {t("marketing.capturePages.noSalesPageFound")}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, color: "text.secondary" }}>
              {t("marketing.capturePages.tryCreatingOne")}
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              sx={{ mt: 3 }}
              onClick={setOpenForm}
            >
              {t("marketing.capturePages.createSalesPage")}
            </Button>
          </Box>
            )}
          </Grid>
        </Box>
      )}

      {currentTab === 1 && (
        <Box sx={{ marginTop: "20px" }}>
          {loadingPayments ? (
            <Grid container spacing={2}>
              {Array.from(new Array(6)).map((_, i) => (
                <Grid item xs={4} key={i}>
                  <Skeleton variant="rectangular" width="100%" height={150} />
                  <Skeleton width="60%" height={25} style={{ marginTop: "10px" }} />
                  <Skeleton width="80%" height={20} />
                </Grid>
              ))}
            </Grid>
          ) : payments.length > 0 ? (
            <Grid container spacing={2}>
              {payments.map((payment) => (
                <PaymentCard key={payment.id} payment={payment} onDelete={setPaymentToDelete} />
              ))}
            </Grid>
          ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            mt: 8,
            opacity: 0.8,
          }}
        >
          <FormatListBulletedOutlined sx={{ fontSize: 80, color: "grey.400" }} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            {t("products.noData")}
          </Typography>
        </Box>
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
        saveSalesPageAsActive={saveSalesPageAsActive}
        creatingSalesPage={creatingSalesPage}
      />

      <DetailsDialog
        open={Boolean(selectedSalesPage)}
        salesPage={selectedSalesPage}
        onClose={() => setSelectedSalesPage(null)}
      />

      <EditDialog
        open={Boolean(editingPage)}
        salesPage={editingPage}
        onClose={() => setEditingPage(null)}
        onDelete={handleDeletePage}
      />

      <FormDetailsModal
        open={viewFormDetails !== ""}
        formId={viewFormDetails}
        onClose={() => setViewFormDetails("")}
      />

      <Dialog open={Boolean(paymentToDelete)} onClose={() => setPaymentToDelete(null)} maxWidth="xs" fullWidth>
        <DialogTitle>{t('checkout.confirmDeletePaymentTitle')}</DialogTitle>
        <DialogContent dividers>
          <Typography>{t('checkout.confirmDeletePaymentMessage')}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPaymentToDelete(null)}>{t('cancel')}</Button>
          <Button color="error" variant="contained" onClick={confirmDeletePayment}>{t('delete')}</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CapturePages;
