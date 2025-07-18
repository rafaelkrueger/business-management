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
  IconButton,
  Chip,
  Avatar,
  useMediaQuery,
  useTheme,
  alpha
} from "@mui/material";
import { AlertCircle, Check, CheckCircle, Clock, PlusCircle, ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";
import { AccessTime, ArrowBackIos, Close, FormatListBulletedOutlined, InsertDriveFileOutlined } from "@mui/icons-material";
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
import LeadGeneration from "../../create-leads/index.tsx";
import CreateCheckoutForm from "../../create-checkout/index.tsx";
import SalesPageService from "../../../../services/sales-page.service.ts";
import LeadsService from "../../../../services/leads.service.ts";
import PaymentService from "../../../../services/payment.service.ts";
import ProgressService from "../../../../services/progress.service.ts";
import { PlusOutlined } from "@ant-design/icons";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Interfaces (mantidas as mesmas do original)
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
  id: string;
  amount: number;
  description: string;
  paymentDate: string;
  paymentMethod: string;
  currency: string;
  status: string;
  productId?: string;
  companyId?: string;
  customerId?: string;
  stripeSessionId?: string;
  stripePaymentIntentId?: string;
  createdAt?: string;
  updatedAt?: string;
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


const FormSubmissionsChart: React.FC<{ submissions: FormSubmission[] }> = ({ submissions }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }));
    }
    return days;
  };

  const days = getLast7Days();
  const totalCounts = days.map(day =>
    submissions.filter(s =>
      new Date(s.timestamp).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }) === day
    ).length
  );

  const newUserCounts = days.map(day =>
    submissions.filter(s =>
      new Date(s.timestamp).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }) === day && s.isNewUser
    ).length
  );

  const data = {
    labels: days,
    datasets: [
      {
        label: t("charts.views"),
        data: totalCounts,
        backgroundColor: alpha(theme.palette.warning.main, 0.6),
        borderRadius: 4
      },
      {
        label: t("charts.newUsersForForms"),
        data: newUserCounts,
        backgroundColor: alpha(theme.palette.info.main, 0.6),
        borderRadius: 4
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { size: 9 } }
      },
      y: {
        grid: { color: alpha(theme.palette.divider, 0.5) },
        ticks: { font: { size: 9 } }
      }
    }
  };

  return <Bar data={data} options={options} />;
};

const EditDialog: React.FC<{
  open: boolean;
  landingPage: SalesPage | null;
  onClose: () => void;
  onDelete: (id: string) => void;
}> = ({ open, landingPage, onClose, onDelete }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullScreen={isMobile} fullWidth>
      <DialogTitle>{landingPage?.title}</DialogTitle>
      <DialogContent>
        {landingPage ? (
          <iframe
            src={`https://roktune.duckdns.org/sales-pages/edit/${landingPage.id}`}
            width="100%"
            height={isMobile ? '100%' : '500px'}
            style={{ border: 'none' }}
            title={landingPage.title}
          />
        ) : (
          <Typography variant="body2">{t('common.loading')}</Typography>
        )}
      </DialogContent>
      <DialogActions>
        {landingPage && (
          <Button color="error" onClick={() => onDelete(landingPage.id)}>
            {t('marketing.capturePages.deletePage')}
          </Button>
        )}
        <Button onClick={onClose}>{t('common.close')}</Button>
      </DialogActions>
    </Dialog>
  );
};

// Componente Principal
const MobileCapturePages: React.FC<{ activeCompany: any; setModule: any }> = ({ activeCompany, setModule }) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Estado
  const [currentTab, setCurrentTab] = useState(0);
  const [salesPages, setSalesPages] = useState<SalesPage[]>([]);
  const [loadingPages, setLoadingPages] = useState(true);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loadingPayments, setLoadingPayments] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [selectedSalesPage, setSelectedSalesPage] = useState<SalesPage | null>(null);
  const [viewFormDetails, setViewFormDetails] = useState("");
  const [leadGenerationEnabled, setLeadGenerationEnabled] = useState(false);
  const [checkoutFormEnabled, setCheckoutFormEnabled] = useState(false);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [newPage, setNewPage] = useState({ title: "", description: "" });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [creatingSalesPage, setCreatingSalesPage] = useState(false);
  const [editingPage, setEditingPage] = useState<SalesPage | null>(null);
  const [useAI, setUseAI] = useState(false);
  const [generatingAI, setGeneratingAI] = useState(false);
  const [progress, setProgress] = useState<{ [key: string]: 'loading' | 'done' | 'error' }>({});
  const [aiPrompt, setAiPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [customSectionInput, setCustomSectionInput] = useState("");
  const sectionLabels: Record<string, string> = {
  salesPage:'Sales Page'
};
  const [sections, setSections] = useState<string[]>([
    "Sales Page",
  ]);

    useEffect(() => {
    if (openForm) {
      setLoadingTemplates(true);
      SalesPageService.get()
        .then((res) => setTemplates(res.data))
        .catch(() => enqueueSnackbar("Erro ao buscar templates", { variant: "error" }))
        .finally(() => setLoadingTemplates(false));
    }
  }, [openForm]);

  useEffect(() => {
    if (activeCompany) {
      setLoadingPages(true);
      SalesPageService.getSalesPages(activeCompany)
        .then((res) => setSalesPages(res.data))
        .catch((err) => enqueueSnackbar("Erro ao carregar landing pages", { variant: "error" }))
        .finally(() => setLoadingPages(false));

      if (currentTab === 1) {
        setLoadingPayments(true);
        PaymentService.get(activeCompany)
          .then((res) => setPayments(res.data))
          .catch((err) => enqueueSnackbar("Erro ao carregar pagamentos", { variant: "error" }))
          .finally(() => setLoadingPayments(false));
      }
    }
  }, [activeCompany, currentTab]);

  useEffect(() => {

  const interval = setInterval(() => {
    ProgressService.getProgress(activeCompany)
      .then((res) => {
        if (res.data && Object.keys(res.data).length > 0) {
          setProgress(res.data);
          setGeneratingAI(true);
        }
      })
      .catch(console.error);
  }, 5000);

    return () => clearInterval(interval);
  }, [generating]);

  const handleViewWebsite = (page: SalesPage) => {
    window.open(`https://roktune.duckdns.org/sales-pages/page/${page.id}`, "_blank");
  };

  const handleViewFormWebsite = (form: FormLead) => {
    window.open(`https://roktune.duckdns.org/sales-pages//leads/form?apiKey=${form.apiKey}`, "_blank");
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

  if (checkoutFormEnabled) {
    return <CreateCheckoutForm activeCompany={activeCompany} setModule={setModule} />;
  }

  if (leadGenerationEnabled) {
    return <LeadGeneration activeCompany={activeCompany} setModule={setModule} />;
  }

  return (
    <Box sx={{
      p: isMobile ? 1.5 : 3,
      backgroundColor: '#ffffff',
      minHeight: '100vh',
    }}>
      {/* Tabs */}
        <Box sx={{
          borderColor: 'divider',
          mb: 2,
          position: 'sticky',
          background: 'linear-gradient(to bottom, #578acd 10%, #6192d4 40%, #669ee7 100%)',
          zIndex: 9,
          pt: 1,
          color:'white',
        }}>
        <Tabs
          value={currentTab}
          onChange={(e, newValue) => setCurrentTab(newValue)}
          variant="fullWidth"
          sx={{
            '& .MuiTabs-indicator': {
              backgroundColor: '#ffffff',
              height: 3
            }
          }}
        >
          <Tab
            label={t("marketing.capturePages.salesPagesTab")}
            sx={{
              fontSize: '0.8rem',
              fontWeight: 600,
              textTransform: 'none',
              minWidth: 0,
              color:'#fbfbfb',
              mt:-0.8,
              '&.Mui-selected': { color: '#ffffff' }
            }}
          />
          <Tab
            label={t("marketing.capturePages.formsTabSales")}
            sx={{
              fontSize: '0.8rem',
              fontWeight: 600,
              textTransform: 'none',
              minWidth: 0,
              color:'#fbfbfb',
              mt:-0.8,
              '&.Mui-selected': { color: '#ffffff' }
            }}
          />
        </Tabs>
      </Box>
      {/* Header */}
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        backgroundColor: '#578acd0',
        zIndex: 10,
        pt: 4,
        pb: 1,
        pl:1,
        pr:2
      }}>
        <IconButton onClick={() => setModule('')} sx={{ color: '#525252', mr: 1, mt:'-50px' }}>
          <ArrowBackIos />
        </IconButton>
        <Box sx={{ ml: 'auto', display: 'flex', gap: 1, marginTop:'-50px' }}>
          <PlusOutlined
            style={{
              fontSize: '13px',
              color: 'white',
              cursor: 'pointer',
              transition: 'color 0.3s ease',
              marginRight: '5px',
              background:'#578acd',
              padding: '6px',
              borderRadius: '5px',
            }}
            onClick={() => setOpenForm(true)}
          />
          <FormatListBulletedOutlined
            style={{
              fontSize: '13px',
              color: 'white',
              cursor: 'pointer',
              transition: 'color 0.3s ease',
              marginRight: '5px',
              background:'#578acd',
              padding: '6px',
              borderRadius: '5px',
            }}
            onClick={() => setCheckoutFormEnabled(true)}
          />
        </Box>
      </Box>

      {/* Content */}
      {currentTab === 0 ? (
        <Grid container spacing={2}>
          {loadingPages ? (
            Array.from({ length: 4 }).map((_, index) => (
              <Grid item xs={6} key={index}>
                <Card sx={{ borderRadius: '12px' }}>
                  <Skeleton variant="rectangular" width="100%" height={120} />
                  <CardContent>
                    <Skeleton width="80%" height={20} />
                    <Skeleton width="60%" height={16} sx={{ mt: 1 }} />
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : salesPages.length > 0 ? (
            salesPages.map((page) => (
              <Grid item xs={6} key={page.id}>
                <Card
                  sx={{
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  {page.screenshotUrl ? (
                    <img
                      src={page.screenshotUrl}
                      alt={page.title}
                      style={{
                        width: '100%',
                        height: 120,
                        objectFit: 'cover',
                        borderTopLeftRadius: '12px',
                        borderTopRightRadius: '12px'
                      }}
                    />
                  ) : (
                    <Box sx={{
                      height: 120,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: alpha('#578acd', 0.1)
                    }}>
                      <InsertDriveFileOutlined sx={{ color: alpha('#578acd', 0.5) }} />
                    </Box>
                  )}

                  <CardContent sx={{ p: 2 }}>
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      mb: 0.5
                    }}>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: 600,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {page.title}
                      </Typography>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          backgroundColor: page.isActive ? '#4caf50' : '#f44336',
                          ml: 1,
                          flexShrink: 0
                        }}
                      />
                    </Box>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {page.description || t("marketing.capturePages.noDescription")}
                    </Typography>

                    <Box sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      mt: 1
                    }}>
                      <Chip
                        label={`${page?.views === undefined ? 0 : page.views} views`}
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: '0.6rem',
                          backgroundColor: alpha('#578acd', 0.1)
                        }}
                      />
                    </Box>
                  </CardContent>

                  <Box sx={{
                    display: 'flex',
                    p: 1,
                    borderTop: `1px solid ${alpha('#578acd', 0.1)}`
                  }}>
                    <Button
                      size="small"
                      onClick={() => handleEditPage(page)}
                      sx={{
                        fontSize: '0.65rem',
                        color: '#578acd',
                        textTransform: 'none',
                        flex: 1
                      }}
                    >
                      {t('marketing.capturePages.editPage')}
                    </Button>
                    <Button
                      size="small"
                      onClick={() => handleViewWebsite(page)}
                      sx={{
                        fontSize: '0.65rem',
                        color: '#578acd',
                        textTransform: 'none',
                        flex: 1
                      }}
                    >
                      {t("marketing.capturePages.viewSalesPage")}
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))
          ) : (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                p: 4,
                textAlign: 'center'
              }}
            >
              <InsertDriveFileOutlined sx={{
                fontSize: 48,
                color: alpha('#578acd', 0.3),
                mb: 2
              }} />
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                {t("marketing.capturePages.noSalesPageFound")}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {t("marketing.capturePages.tryCreatingOne")}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                size="small"
                startIcon={<PlusCircle size={16} />}
                onClick={() => setOpenForm(true)}
                sx={{
                  backgroundColor: '#578acd',
                  '&:hover': { backgroundColor: alpha('#578acd', 0.9) }
                }}
              >
                {t("marketing.capturePages.createSalesPage")}
              </Button>
            </Box>
          )}
        </Grid>
      ) : (
        <Grid container spacing={2}>
          {loadingPayments ? (
            Array.from({ length: 4 }).map((_, index) => (
              <Grid item xs={6} key={index}>
                <Card sx={{ borderRadius: '12px' }}>
                  <CardContent>
                    <Skeleton width="80%" height={20} />
                    <Skeleton width="60%" height={16} sx={{ mt: 1 }} />
                    <Skeleton variant="rectangular" width="100%" height={80} sx={{ mt: 2 }} />
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : payments.length > 0 ? (
            payments.map((payment) => (
              <Grid item xs={6} key={payment.id}>
                <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {payment.description}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('payments.status')}: {payment.status}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('payments.currency')}: {payment.currency}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {t('payments.paymentDate')}: {new Date(payment.paymentDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mt: 1 }}>
                      {payment.amount}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                p: 4,
                textAlign: 'center'
              }}
            >
              <FormatListBulletedOutlined sx={{
                fontSize: 48,
                color: alpha('#578acd', 0.3),
                mb: 2
              }} />
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                {t("products.noData")}
              </Typography>
            </Box>
          )}
        </Grid>
      )}

<Dialog
  open={openForm}
  onClose={() => setOpenForm(false)}
  fullScreen={isMobile}
>
        {generatingAI ? (
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
  <DialogTitle
    sx={{
      backgroundColor: "#578acd",
      color: "#ffffff",
      display: "flex",
      alignItems: "center",
      py: 1.5,
    }}
  >
    <IconButton
      edge="start"
      color="inherit"
      onClick={() => setOpenForm(false)}
      sx={{ mr: 1 }}
    >
      <ArrowLeft size={20} />
    </IconButton>
    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
      {t("marketing.capturePages.createSalesPage")}
    </Typography>
  </DialogTitle>

  <DialogContent sx={{ p: 2 }}>
    <ToggleButtonGroup
      fullWidth
      exclusive
      value={useAI ? "ai" : "manual"}
      onChange={(_, val) => {
        if (val !== null) setUseAI(val === "ai");
      }}
      size="small"
      sx={{ mb: 2, mt:3 }}
    >
      <ToggleButton style={{fontSize:'7.5pt'}} value="manual">
        {t("marketing.templateDialog.chooseTemplate")}
      </ToggleButton>
      <ToggleButton style={{fontSize:'7.5pt'}} value="ai">
        {t("marketing.templateDialog.createAiTemplate")}
      </ToggleButton>
    </ToggleButtonGroup>

    <TextField
      label={t("marketing.templateDialog.titleLabel")}
      fullWidth
      margin="dense"
      size="small"
      sx={{ mb: 2 }}
      value={newPage.title}
      onChange={(e) =>
        setNewPage((prev) => ({ ...prev, title: e.target.value }))
      }
    />

    {useAI ? (
      <>
      <TextField
        label={t("marketing.templateDialog.aiPromptHint")}
        fullWidth
        multiline
        rows={4}
        size="small"
        value={aiPrompt}
        onChange={(e) => setAiPrompt(e.target.value)}
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
      </>
    ) : (
      <>
        <TextField
          label={t("marketing.templateDialog.descriptionLabel")}
          fullWidth
          margin="dense"
          size="small"
          multiline
          rows={2}
          sx={{ mb: 3 }}
          value={newPage.description}
          onChange={(e) =>
            setNewPage((prev) => ({ ...prev, description: e.target.value }))
          }
        />

        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
          {t("marketing.templateDialog.chooseTemplate")}
        </Typography>

        <Grid container spacing={1.5}>
          {loadingTemplates
            ? Array.from({ length: 6 }).map((_, index) => (
                <Grid item xs={6} key={index}>
                  <Card>
                    <Skeleton variant="rectangular" width="100%" height={100} />
                    <CardContent sx={{ p: 1 }}>
                      <Skeleton width="80%" height={20} />
                    </CardContent>
                  </Card>
                </Grid>
              ))
            : templates.map((template) => (
                <Grid item xs={6} key={template.id}>
                  <Card
                    onClick={() => setSelectedTemplate(template)}
                    sx={{
                      borderRadius: "8px",
                      border:
                        selectedTemplate?.id === template.id
                          ? "2px solid #578acd"
                          : "1px solid rgba(0, 0, 0, 0.1)",
                      cursor: "pointer",
                    }}
                  >
                    <img
                      src={template.screenshotUrl}
                      alt={template.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                    <CardContent sx={{ p: 1 }}>
                      <Typography variant="caption" fontWeight={600}>
                        {template.name}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
        </Grid>
      </>
    )}
  </DialogContent>
  </>
  )}
  <DialogActions sx={{ p: 2 }}>
    <Button
      variant="contained"
      disabled={useAI ? !aiPrompt : !selectedTemplate}
      onClick={async () => {
        if (useAI) {
          setGeneratingAI(true);

          try {
            const res = await SalesPageService.postAiTemplate({
              title: newPage.title,
              description: newPage.description,
              aiPrompt: aiPrompt,
              sections: sections,
              companyId: activeCompany,
            });

            setPreviewUrl(
              `https://roktune.duckdns.org/sales-pages/preview?type=${res.data}&companyId=${activeCompany}&title=${encodeURIComponent(
                newPage.title
              )}`
            );
          } catch (err) {
            enqueueSnackbar("Erro ao gerar template com IA", {
              variant: "error",
            });
          } finally {
            setGeneratingAI(false);
          }

        } else {
          setOpenForm(false);
          setPreviewUrl(
            `https://roktune.duckdns.org/sales-pages/preview?type=${selectedTemplate?.type}&companyId=${activeCompany}&title=${encodeURIComponent(
              newPage.title
            )}`
          );
        }
      }}
      sx={{ backgroundColor: "#578acd" }}
    >
      {useAI
        ? generatingAI
          ? <CircularProgress size={20} />
          : t("marketing.templateDialog.generateAiTemplate")
        : t("marketing.templateDialog.viewAndEdit")}
    </Button>

  </DialogActions>
</Dialog>

{/* Preview Dialog */}
{previewUrl && (
  <Dialog open={true} fullScreen={isMobile} onClose={() => setPreviewUrl(null)}>
    <DialogTitle>{t("marketing.previewDialog.title")}</DialogTitle>
    <DialogContent>
      <iframe
        id="previewIframe"
        src={previewUrl}
        width="100%"
        height={isMobile ? "100%" : "600px"}
        style={{ border: "none" }}
      />
    </DialogContent>
    <DialogActions>
      <Button onClick={() => setPreviewUrl(null)}>
        {t("common.cancel")}
      </Button>
      <Button
        variant="contained"
        disabled={creatingSalesPage}
        onClick={async () => {
          setCreatingSalesPage(true);

          const iframe = document.getElementById("previewIframe") as HTMLIFrameElement;
          const saveButton = iframe?.contentDocument?.getElementById("saveButton") as HTMLButtonElement;

          if (saveButton) saveButton.click();

          await new Promise((res) => setTimeout(res, 10000));

          try {
            await SalesPageService.post({
              companyId: activeCompany,
              title: newPage.title,
              description: newPage.description,
              aiPrompt: aiPrompt,
              sections,
            });

            enqueueSnackbar(t("marketing.capturePages.pageCreated"), {
              variant: "success",
            });

            setPreviewUrl(null);
            setOpenForm(false);
            setNewPage({ title: "", description: "" });
            setSelectedTemplate(null);

            const updated = await SalesPageService.getSalesPages(activeCompany);
            setSalesPages(updated.data);
          } catch (error) {
            enqueueSnackbar("Erro ao criar página", { variant: "error" });
          } finally {
            setCreatingSalesPage(false);
          }
        }}
      >
        {creatingSalesPage ? (
          <CircularProgress size={20} />
        ) : (
          t("marketing.previewDialog.createSalesPage")
        )}
      </Button>

    </DialogActions>
  </Dialog>
    )}

    <EditDialog
      open={Boolean(editingPage)}
      landingPage={editingPage}
      onClose={() => setEditingPage(null)}
      onDelete={handleDeletePage}
    />
    </Box>
  );
};

export default MobileCapturePages;
