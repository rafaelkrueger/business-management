import React, { useState, useCallback, useEffect, useMemo, useRef } from "react";
import AllInOneService from "../../../../services/all-in-one.service.ts";
import SocialMediaTemplateService from "../../../../services/social-media-template.service.ts";
import ReactFlow, {
  addEdge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
} from "reactflow";
import "reactflow/dist/style.css";
import {
  Box,
  Typography,
  Button,
  Paper,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Skeleton,
  AccordionSummary,
  Accordion,
  AccordionDetails,
  FormControlLabel,
  FormLabel,
  RadioGroup,
  ToggleButton,
  ToggleButtonGroup,
  Grid,
} from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { ArrowBackIos, Instagram, Money, PaymentOutlined } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AutomationService from "../../../../services/automation.service.ts";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EmailService from "../../../../services/email.service.ts";
import EmailConfigurationModal from "../../email-config/index.tsx";
import EmailTemplateSelector from "../../email-template-selector/index.tsx";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import AiService from "../../../../services/ai.service.ts";
import { Brain, CloudUploadIcon, DollarSign, ImageIcon, Radio, SettingsIcon } from "lucide-react";
import { Drawer } from "@mui/material";
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { FaEnvelope, FaTwitter, FaLinkedin, FaYoutube, FaFacebook, FaWhatsapp, FaBrain, FaClock, FaInstagram, FaTiktok } from 'react-icons/fa';

import TwitterService from '../../../../services/twitter.service.ts';
import LinkedinService from "../../../../services/linkedin.service.ts";
import FacebookService from "../../../../services/facebook.service.ts";
import YoutubeService from "../../../../services/youtube.service.ts";

import LinkedInAuthModal from "../../linkedin-create/index.tsx";
import FacebookAuthModal from "../../facebook-create/index.tsx";
import WhatsAppAuthModal from "../../whatsapp-create/index.tsx";
import YouTubeAuthModal from "../../youtube/youtube-create/index.tsx";
import TwitterAuthModal from "../../twitter/twitter-create/index.tsx";

import TwitterNodeEditor from "../../twitter/twitter-post/index.tsx";
import YouTubeNodeEditor from "../../youtube/youtube-post/index.tsx";
import FacebookNodeEditor from "../../facebook/facebook-post/index.tsx";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import WhatsappService from "../../../../services/whatsapp.service.ts";
import ProgressService from "../../../../services/progress.service.ts";
import PickLeadsForm from "../../create-leads/pick-leads-form/index.tsx";
import { IoIosArrowBack, IoIosClose } from "react-icons/io";
import WhatsappChatbotModal from "../../whatsapp-chatbot/index.tsx";
import WaitWhatsappModal from "../../whatsapp-chatbot/wait-whatsapp/index.tsx";
import InstagramAuthModal from "../../instagram-create/index.tsx";
import InstagramService from "../../../../services/instagram.service.ts";
import InstagramNodeEditor from "../../instagram/index.tsx";
import { AllInOneApi } from "../../../../Api.ts";
import { useTheme } from "@emotion/react";

export const uploadImagesToApi = async (file) => {
  const uploadedImageUrls: string[] = [];
  const base64Data = file.base64.split(',')[1];
  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length).fill(null).map((_, i) => byteCharacters.charCodeAt(i));
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: file.type });
  const convertedFile = new File([blob], file.name, { type: file.type });

  const formDataFile = new FormData();
  formDataFile.append('path', 'temporary');
  formDataFile.append('file', convertedFile);

  const response = await AllInOneApi.post('shared/image', formDataFile, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'accept': '*/*',
    },
  });

  uploadedImageUrls.push(response.data.url);
  return uploadedImageUrls;
};


const CustomNode = ({ data, id, activeCompany }) => {
  const { t } = useTranslation();
  const [status, setStatus] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await ProgressService.getProgress(activeCompany);
        const sectionKey = `${data.blockType}[0]`;
        const currentStatus = res.data?.[sectionKey];
        setStatus(currentStatus);
      } catch (err) {
        console.error("Erro ao buscar progresso", err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [activeCompany, data.blockType, data.index]);

  const getStatusColor = () => {
    switch (status) {
      case "loading": return "#FFA726";
      case "done": return "#66BB6A";
      case "error": return "#EF5350";
      default: return "#B0BEC5";
    }
  };

  const getStatusShadow = () => {
    switch (status) {
      case "loading": return "0 0 8px rgba(255, 167, 38, 0.7)";
      case "done": return "0 0 8px rgba(102, 187, 106, 0.7)";
      case "error": return "0 0 8px rgba(239, 83, 80, 0.7)";
      default: return "none";
    }
  };

  const getBlockIcon = (blockType) => {
    const iconSize = 16;

    switch (blockType) {
      case "email":
        return <FaEnvelope size={iconSize} color="#b4a01b" />;
      case "twitter":
        return <FaTwitter size={iconSize} color="#1DA1F2" />;
      case "linkedin":
        return <FaLinkedin size={iconSize} color="#0A66C2" />;
      case "youtube":
        return <FaYoutube size={iconSize} color="#FF0000" />;
      case "facebook":
        return <FaFacebook size={iconSize} color="#1877F2" />;
      case "whatsapp":
        return <FaWhatsapp size={iconSize} color="#25D366" />;
      case "instagram":
        return <FaInstagram size={iconSize} color="#c20a8e" />;
      case "whatsappTrigger":
        return <FaWhatsapp size={iconSize} color="#25D366" />;
      case "waitWhatsapp":
        return <FaWhatsapp size={iconSize} color="#25D366" />;
      case "chatgpt":
        return <FaBrain size={iconSize} color="purple" />;
      case "chatgptImage":
        return <FaBrain size={iconSize} color="purple" />;
      case "wait":
        return <FaClock size={iconSize} color="#000" />;
      case "formSubmitted":
        return <FaEnvelope size={iconSize} color="#b4a01b" />;
      case "soldTrigger":
        return <DollarSign style={{ color: "#1bb41b", fontSize: 26 }} />;
      default:
        return <FaEnvelope size={iconSize} color="#777" />;
    }
  };

  return (
    <Box
      sx={{
        position: "relative",
        minWidth: 220,
        maxWidth: 280,
        borderRadius: "12px",
        background: "#FFFFFF",
        boxShadow: isHovered
          ? "0 10px 20px rgba(0, 0, 0, 0.1), 0 6px 6px rgba(0, 0, 0, 0.05)"
          : "0 4px 12px rgba(0, 0, 0, 0.08)",
        border: "1px solid rgba(0, 0, 0, 0.05)",
        transition: "all 0.3s ease",
        overflow: "visible",
        "&:hover": {
          transform: "translateY(-2px)",
        },
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Box
        sx={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: "6px",
          backgroundColor: getStatusColor(),
          backgroundImage: status === "loading"
            ? "linear-gradient(180deg, #FFA726 0%, #FF7043 100%)"
            : "none",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          width: 14,
          height: 14,
          borderRadius: "50%",
          backgroundColor: getStatusColor(),
          boxShadow: getStatusShadow(),
          transition: "all 0.3s ease",
          animation: status === "loading" ? "pulse 1.5s infinite" : "none",
        }}
      />

      <Box
        sx={{
          padding: "12px 16px 12px 24px",
          background: "linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)",
          borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: "8px",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          {getBlockIcon(data.blockType)}
        </Box>

        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 600,
            color: "#2D3748",
          }}
        >
          {data.label}
        </Typography>
      </Box>

      <Box sx={{ padding: "14px 16px 14px 24px" }}>
        {data.blockType === "twitter" && (
          <Typography
            variant="body2"
            sx={{
              color: "#4A5568",
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 1,
            }}
          >
            {data.params.tweetTitle || t("automationFlow.tweetTitle")}
          </Typography>
        )}

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 1,
            mt: 1.5,
          }}
        >
          <IconButton
            size="small"
            onClick={() => data.onEdit(id)}
            sx={{
              bgcolor: "rgba(30, 136, 229, 0.1)",
              color: "#1E88E5",
              borderRadius: "8px",
              transition: "all 0.2s ease",
              "&:hover": {
                bgcolor: "rgba(30, 136, 229, 0.2)",
                transform: "scale(1.1)",
              },
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => data.onDelete(id)}
            sx={{
              bgcolor: "rgba(229, 57, 53, 0.1)",
              color: "#E53935",
              borderRadius: "8px",
              transition: "all 0.2s ease",
              "&:hover": {
                bgcolor: "rgba(229, 57, 53, 0.2)",
                transform: "scale(1.1)",
              },
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      <Handle
        type="target"
        position={Position.Top}
        style={{
          top: -8.5,
          background: "#4FD1C5",
          width: "14px",
          height: "14px",
          border: "2px solid white",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
        }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          bottom: -8.5,
          background: "#4FD1C5",
          width: "14px",
          height: "14px",
          border: "2px solid white",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
        }}
      />
    </Box>
  );
};

const getSortedNodes = (nodes, edges) => {
  const nodeMap = {};
  nodes.forEach((node) => {
    nodeMap[node.id] = { ...node, indegree: 0, children: [] };
  });

  edges.forEach((edge) => {
    if (nodeMap[edge.target]) {
      nodeMap[edge.target].indegree++;
    }
    if (nodeMap[edge.source]) {
      nodeMap[edge.source].children.push(edge.target);
    }
  });

  const queue = [];
  for (const id in nodeMap) {
    if (nodeMap[id].indegree === 0) {
      queue.push(nodeMap[id]);
    }
  }

  const sortedNodes = [];
  while (queue.length > 0) {
    const current = queue.shift();
    sortedNodes.push(current);
    current.children.forEach((childId:any) => {
      nodeMap[childId].indegree--;
      if (nodeMap[childId].indegree === 0) {
        queue.push(nodeMap[childId]);
      }
    });
  }

  if (sortedNodes.length !== nodes.length) {
    console.warn("Graph has a cycle. Returning unsorted nodes.");
    return nodes;
  }

  return sortedNodes.map(({ children, indegree, ...node }) => node);
};

const AutomationFlow = ({ activeCompany, setIsCreating, editingAutomation, setEditingAutomation }) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();

  const [flowName, setFlowName] = useState("");
  const [nextExecutionTime, setNextExecutionTime] = useState<string>(
    new Date().toISOString().slice(0, 16)
  );
  const [repeatInterval, setRepeatInterval] = useState("");
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [editingNode, setEditingNode] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState("");
  const [openTwitterAuthModal, setOpenTwitterAuthModal] = useState(false);
  const [openLinkedinAuthModal, setOpenLinkedinAuthModal] = useState(false);
  const [openYoutubeAuthModal, setOpenYoutubeAuthModal] = useState(false);
  const [openWhatsappAuthModal, setOpenWhatsappAuthModal] = useState(false);
  const [openFacebookAuthModal, setOpenFacebookAuthModal] = useState(false);
  const [openInstagramAuthModal, setOpenInstagramAuthModal] = useState(false);
  const [socialMediaTemplates, setSocialMediaTemplates] = useState([]);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [isTwitterConnected, setIsTwitterConnected] = useState(false);
  const [hasTwitterCredentials, setHasTwitterCredentials] = useState(false);
  const [loadingTwitterCheck, setLoadingTwitterCheck] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [facebookPages, setFacebookPages] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [mode, setMode] = useState<"choose" | "ai">("choose");
  const theme = useTheme();
  const [startType, setStartType] = useState<'scheduled' | 'event'>(editingAutomation?.type ?? 'scheduled');
  const [selectedEvent, setSelectedEvent] = useState<string>("lead.captured");
  const [blockProgress, setBlockProgress] = useState<Record<string, 'loading' | 'done' | 'error'>>({});
  const nodeTypes = useMemo(() => ({
    custom: (props) => <CustomNode {...props} activeCompany={activeCompany} />,
  }), [activeCompany]);


  const [openEmailConfigModal, setOpenEmailConfigModal] = useState(false);
  const [openTemplateSelector, setOpenTemplateSelector] = useState(false);
  const [emailTemplates, setEmailTemplates] = useState([]);

  const BLOCK_TYPES = {
    TRIGGERS: {
      type: "formSubmitted",
      name: t("block.formTrigger"),
      icon: <FaEnvelope style={{ color: "#b4a01b", fontSize: 26 }} />,
      params: { recipients: "", subject: "", template: {} },
      purpose:t('automationFlow.purposes.triggers'),
    },
    PAYMENT_TRIGGER: {
      type: "soldTrigger",
      name: t("block.soldTrigger"),
      icon: <DollarSign style={{ color: "#1bb41b", fontSize: 26 }} />,
      params: { paymentId: "" },
      purpose:t('automationFlow.purposes.triggers'),
    },
    // WHATSAPP_TRIGGER: {
    //   type: "whatsappTrigger",
    //   name: t("block.whatsappTrigger"),
    //   icon: <FaWhatsapp style={{ color: "#25D366", fontSize: 26 }} />,
    //   params: { expectedWhatsappContent: "" },
    //   purpose:t('automationFlow.purposes.triggers'),
    // },
    CHATGPT: {
      type: "chatgpt",
      name: t("block.chatgpt"),
      icon: <Brain style={{ color: "purple", fontSize: 26 }} />,
      params: {
        action: "generateContent",
        platform: "chat_gpt",
        tone: "neutral",
        keywords: "",
      },
      purpose:t('automationFlow.purposes.createContent'),
    },
    CHATGPT_IMAGE: {
      type: "chatgptImage",
      name: t("block.chatgptImage"),
      icon: <Brain style={{ color: "purple", fontSize: 26 }} />,
      params: {
        prompt: "",
        file: "",
        platform: "chat_gpt_image",
      },
      purpose:t('automationFlow.purposes.createContent'),
    },
    WAIT: {
      type: "wait",
      name: t("block.wait"),
      icon: <FaClock style={{ color: "#000", fontSize: 26 }} />,
      params: { waitTime: 1, waitHours: 0 },
      purpose:t('automationFlow.purposes.action'),
    },
    // WAIT_WHATSAPP: {
    //   type: "waitWhatsapp",
    //   name: t("block.waitWhatsapp"),
    //   icon: <FaClock style={{ color: "#000", fontSize: 26 }} />,
    //   params: { waitTime: 1, waitHours: 0 },
    //   purpose:t('automationFlow.purposes.action'),
    // },
    EMAIL: {
      type: "email",
      name: t("block.email"),
      icon: <FaEnvelope style={{ color: "#b4a01b", fontSize: 26 }} />,
      params: { recipients: "", subject: "", template: {} },
      purpose:t('automationFlow.purposes.socialMedia'),
    },
    TWITTER: {
      type: "twitter",
      name: t("block.twitter"),
      icon: <FaTwitter style={{ color: "#1DA1F2", fontSize: 26 }} />,
      params: { tweetContent: "" },
      purpose:t('automationFlow.purposes.socialMedia'),
    },
    FACEBOOK: {
      type: "facebook",
      name: t("block.facebook"),
      icon: <FaFacebook style={{ color: "#1877F2", fontSize: 26 }} />,
      params: { facebookContent: "" },
      purpose:t('automationFlow.purposes.socialMedia'),
    },
    WHATSAPP: {
      type: "whatsapp",
      name: t("block.whatsapp"),
      icon: <FaWhatsapp style={{ color: "#25D366", fontSize: 26 }} />,
      params: { whatsappContent: "" },
      purpose:t('automationFlow.purposes.socialMedia'),
    },
    LINKEDIN: {
      type: "linkedin",
      name: t("block.linkedin"),
      icon: <FaLinkedin style={{ color: "#0A66C2", fontSize: 26 }} />,
      params: { linkedinContent: "" },
      purpose:t('automationFlow.purposes.socialMedia'),
    },
    YOUTUBE: {
      type: "youtube",
      name: t("block.youtube"),
      icon: <FaYoutube style={{ color: "#FF0000", fontSize: 26 }} />,
      params: { youtubeContent: "" },
      purpose:t('automationFlow.purposes.socialMedia'),
    },
    INSTAGRAM: {
      type: "instagram",
      name: t("block.instagram"),
      icon: <FaInstagram style={{ color: "#c20a8e", fontSize: 26 }} />,
      params: { instagramContent: "" },
      purpose:t('automationFlow.purposes.socialMedia'),
    },
    // TIKTOK: {
    //   type: "tiktok",
    //   name: t("block.tiktok"),
    //   icon: <FaTiktok style={{ color: "#000000", fontSize: 26 }} />,
    //   params: { tiktokContent: "" },
    //   purpose:t('automationFlow.purposes.socialMedia'),
    // },
  };

  useEffect(() => {
    const checkTwitterCredentials = async () => {
      setLoadingTwitterCheck(true);
      try {
        const response = await TwitterService.get(activeCompany);
        console.log("Twitter Credentials Response:", response.data);
        if (response.data && response.data.accessToken) {
          setHasTwitterCredentials(true);
        } else {
          setHasTwitterCredentials(false);
        }
      } catch (error) {
        console.error("Erro ao verificar credenciais do Twitter:", error);
        setHasTwitterCredentials(false);
      }
      setLoadingTwitterCheck(false);
    };

    if (activeCompany) {
      checkTwitterCredentials();
    }
  }, [activeCompany]);

  useEffect(() => {
    if (editingNode && editingNode.data.blockType === "facebook") {
      FacebookService.checkFacebookPages(activeCompany)
        .then((response) => {
          setFacebookPages(response.data);
        })
        .catch((error) => {
          console.error("Erro ao buscar páginas do Facebook:", error);
        });
    }
  }, [editingNode, activeCompany]);

  const handleAddTwitterBlock = async () => {
    try {
      const response = await TwitterService.checkTwitterStatus(activeCompany);
      if (response) {
        addNode(BLOCK_TYPES.TWITTER);
      } else {
        enqueueSnackbar(t("automationFlow.twitterConnectNeeded"), {
          variant: "warning",
        });
        setOpenTwitterAuthModal(true);
      }
    } catch (error) {
      console.error("Erro ao verificar credenciais do Twitter:", error);
      enqueueSnackbar(t("automationFlow.twitterConnectionError"), {
        variant: "error",
      });
      setOpenTwitterAuthModal(true);
    }
  };

  const variableInstructions = (editingNode) => {
    if (!editingNode) return null;

    const incomingEdge = edges.find(edge => edge.target === editingNode.id);
    if (!incomingEdge) return null;

    const previousNode = nodes.find(node => node.id === incomingEdge.source);
    if (!previousNode?.data?.params?.useFormData || !previousNode.data.params.selectedFields?.length) {
      return null;
    }

    if (previousNode.data.blockType !== 'formSubmitted') {
      return null;
    }

    const selectedVars = previousNode.data.params.selectedFields.map(field => `{{form.${field}}}`);
    const exampleText = `${t('marketing.formSubmitted.examplePrefix')} ${selectedVars[0]}`

    const handleInsertVariable = (variable) => {
      const newMessage = editingNode.data.params.message
        ? `${editingNode.data.params.message} ${variable}`
        : variable;

      setEditingNode(prev => ({
        ...prev,
        data: {
          ...prev.data,
          params: {
            ...prev.data.params,
            message: newMessage,
          },
        },
      }));
    };

    return (
      <Box sx={{
        mt: 3,
        p: 2,
        backgroundColor: 'rgba(245, 245, 245, 0.5)',
        borderLeft: '3px solid',
        borderRight: '3px solid',
        borderLeftColor: 'primary.main',
        borderRightColor: 'primary.main'
      }}>
        <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>
          {t('marketing.formSubmitted.availableVariables')}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {t('marketing.formSubmitted.clickToInsert')}
        </Typography>

        <Box sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 1,
          mb: 2.5,
          '& .MuiButton-root': {
            fontSize: '0.75rem',
            textTransform: 'none',
            borderRadius: 2,
            py: 0.5,
            px: 1.5
          }
        }}>
          {selectedVars.map((field) => (
            <Button
              key={field}
              size="small"
              variant="outlined"
              color="primary"
              onClick={() => handleInsertVariable(field)}
              sx={{
                '&:hover': {
                  backgroundColor: 'primary.light',
                }
              }}
            >
              {field}
            </Button>
          ))}
        </Box>

        <Box sx={{
          p: 1.5,
          backgroundColor: 'background.paper',
          borderRadius: 1,
          border: '1px solid',
          borderColor: 'divider'
        }}>
          <Typography variant="caption" component="div" sx={{ fontWeight: 500 }}>
            {t('marketing.formSubmitted.usageExample')}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {exampleText}
          </Typography>
        </Box>
      </Box>
    );
  };

  const handleAddLinkedinBlock = async () => {
    try {
      const response = await LinkedinService.checkLinkedinStatus(activeCompany);
      if (response) {
        addNode(BLOCK_TYPES.LINKEDIN);
      } else {
        enqueueSnackbar(t("automationFlow.linkedinConnectNeeded"), {
          variant: "warning",
        });
        setOpenLinkedinAuthModal(true);
      }
    } catch (error) {
      console.error("Erro ao verificar credenciais do Twitter:", error);
      enqueueSnackbar(t("automationFlow.twitterConnectionError"), {
        variant: "error",
      });
      setOpenLinkedinAuthModal(true);
    }
  };

  const handleAddFacebookBlock = async () => {
    try {
      const response = await FacebookService.checkFacebookStatus(activeCompany);
      if (response) {
        addNode(BLOCK_TYPES.FACEBOOK);
      } else {
        enqueueSnackbar(t("automationFlow.facebookConnectNeeded"), {
          variant: "warning",
        });
        setOpenFacebookAuthModal(true);
      }
    } catch (error) {
      enqueueSnackbar('Connection issue', {
        variant: "error",
      });
      setOpenFacebookAuthModal(true);
    }
  };

    const handleAddInstagramBlock = async () => {
    try {
      const response = await InstagramService.checkInstagramStatus(activeCompany);
      if (response) {
        addNode(BLOCK_TYPES.INSTAGRAM);
      } else {
        enqueueSnackbar(t("automationFlow.instagramConnectNeeded"), {
          variant: "warning",
        });
        setOpenInstagramAuthModal(true);
      }
    } catch (error) {
      enqueueSnackbar('Connection issue', {
        variant: "error",
      });
      setOpenInstagramAuthModal(true);
    }
  };

  const handleAddYoutubeBlock = async () => {
    try {
      const response = await YoutubeService.checkYoutubeStatus(activeCompany);
      if (response) {
        addNode(BLOCK_TYPES.YOUTUBE);
      } else {
        enqueueSnackbar(t("automationFlow.youtubeConnectNeeded"), {
          variant: "warning",
        });
        setOpenYoutubeAuthModal(true);
      }
    } catch (error) {
      console.error("Erro ao verificar credenciais do Twitter:", error);
      enqueueSnackbar('Connection issue', {
        variant: "error",
      });
      setOpenYoutubeAuthModal(true);
    }
  };

  const handleAddWhatsappBlock = async () => {
    try {
      const response = await WhatsappService.checkWhatsAppStatus(activeCompany);
      if (response.data.connected) {
        addNode(BLOCK_TYPES.WHATSAPP);
      } else {
      enqueueSnackbar('Connection issue', {
        variant: "error",
      });
        setOpenWhatsappAuthModal(true);
      }
    } catch (error) {
      console.error("Erro ao verificar credenciais do Twitter:", error);
      setOpenWhatsappAuthModal(true);
    }
  };

  const handleSaveTwitterCredentials = async (config) => {
    // Lógica para salvar credenciais do Twitter
  };

  useEffect(()=>{
    SocialMediaTemplateService.get().then((response) => {
      setSocialMediaTemplates(response.data);
    }).catch((error) => {});
  },[mode])

  useEffect(() => {
    if (editingAutomation) {
      setFlowName(editingAutomation.name);
      setNextExecutionTime(editingAutomation.nextExecutionTime?.slice(0, 16));
      setRepeatInterval(editingAutomation.repeatInterval);

      const mappedNodes = editingAutomation.nodes.map((node, index) => ({
        ...node,
        data: {
          ...node.data,
          onEdit: handleEdit,
          onDelete: handleDelete,
          index,
        },
      }));
      setNodes(mappedNodes);
      setEdges(editingAutomation.edges || []);
    }
  }, [editingAutomation]);

  useEffect(() => {
    if (openEditDialog) {
      const node = nodes.find((node) => node.id === openEditDialog);
      if (node) {
        setEditingNode(node);
      }
    }
  }, [openEditDialog, nodes]);

  // Quando o nó em edição for do tipo "email", buscamos os templates
  useEffect(() => {
    if (editingNode && editingNode.data.blockType === "email") {
      AutomationService.getEmailTemplates()
        .then((res) => {
          // Supondo que a resposta esteja em res.data
          setEmailTemplates(res.data);
        })
        .catch((error) => {
          console.error("Erro ao buscar email templates:", error);
        });
    }
  }, [editingNode]);

  const addNode = (block) => {
    const isTrigger = block.type === "formSubmitted" || block.type === "whatsappTrigger";

    if (isTrigger) {
      const alreadyHasTrigger = nodes.some((node) =>
        ["formSubmitted", "whatsappTrigger"].includes(node.data.blockType)
      );

      if (alreadyHasTrigger) {
        enqueueSnackbar(t("automationFlow.onlyOneTriggerAllowed"), { variant: "warning" });
        return;
      }
    }

    const newNode = {
      id: uuidv4(),
      type: "custom",
      position: { x: Math.random() * 500, y: Math.random() * 500 },
      data: {
        label: block.name,
        blockType: block.type,
        params: block.params,
        onEdit: handleEdit,
        onDelete: handleDelete,
      },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const handleDelete = (nodeId) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) =>
      eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
    );
  };

  const handleEdit = (nodeId) => {
    setOpenEditDialog(nodeId);
  };

  const handleSaveEdit = () => {
    let htmlContent = "";

    try {
      const iframe = document.getElementById(`template-preview-${mode !== 'choose' ? '1' : '2' }`);

      if (iframe && iframe.contentDocument) {
        htmlContent = iframe.contentDocument.documentElement.outerHTML;
      } else {
        console.warn("Iframe não encontrado ou inacessível.");
      }
    } catch (error) {
      console.error("Erro ao acessar conteúdo do iframe:", error);
    }

    setNodes((nds) =>
      nds.map((node) =>
        node.id === editingNode.id
          ? {
              ...node,
              data: {
                ...editingNode.data,
                params: {
                  ...editingNode.data.params,
                  htmlContent: htmlContent,
                  mode: mode,
                },
              },
            }
          : node
      )
    );

    setOpenEditDialog("");
  };

  const onConnect = useCallback(
    (params) =>
      setEdges((eds) =>
        addEdge({ ...params, animated: true, style: { strokeWidth: 3 } }, eds)
      ),
    []
  );

  const handleSaveAutomation = async () => {
    const automationData = {
      name: flowName,
      nodes: getSortedNodes(nodes, edges),
      edges,
      nextExecutionTime: new Date(nextExecutionTime).toISOString(),
      repeatInterval,
      activeCompany: activeCompany,
      startType: startType,
    };

    try {
      if (editingAutomation) {
        await AutomationService.editAutomation({
          ...automationData,
          id: editingAutomation.id,
          status: "PENDING",
        });
        enqueueSnackbar(t("marketing.automation.updated"), {
          variant: "success",
        });
      } else {
        await AutomationService.createAutomation(automationData);
        enqueueSnackbar(t("marketing.automation.created"), {
          variant: "success",
        });
      }
      setIsCreating(false);
    } catch (error) {
      console.error("Erro ao salvar automação:", error);
    }
  };

  const handleTestAutomation = async () => {
    const automationData = {
      name: flowName,
      nodes: getSortedNodes(nodes, edges),
      edges,
      nextExecutionTime,
      repeatInterval,
      activeCompany: activeCompany,
      testing: true,
    };

    try {
      await AutomationService.createAutomation(automationData);
      enqueueSnackbar(t("marketing.automation.testing"), {
        variant: "success",
      });
    } catch (error) {
      console.error("Erro ao salvar automação:", error);
    }
  };

  const handleAddEmailBlock = async () => {
    try {
      const response = await EmailService.getAccount(activeCompany);
      if (response.data) {
        addNode(BLOCK_TYPES.EMAIL);
      } else {
        setOpenEmailConfigModal(true);
      }
    } catch (error) {
      setOpenEmailConfigModal(true);
    }
  };

  const handleSaveEmailConfig = async (config) => {
    try {
      const response = await EmailService.createAccount(config);
      console.log("Conta de e-mail criada com sucesso:", response.data);
      setOpenEmailConfigModal(false);
      addNode(BLOCK_TYPES.EMAIL);
    } catch (error) {
      console.error("Erro ao criar conta de e-mail:", error);
    }
  };

  const handleTemplateSelect = (template) => {
    setEditingNode((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        params: {
          ...prev.data.params,
          template: { id: template.id, htmlContent: template.htmlContent },
        },
      },
    }));
    setOpenTemplateSelector(false);
  };

  const isConnectedToChatGPT = (currentNodeId) => {
    const incomingEdge = edges.find((edge) => edge.target === currentNodeId);
    if (!incomingEdge) return false;

    const previousNode = nodes.find((node) => node.id === incomingEdge.source);
    if (!previousNode) return false;

    if (previousNode.data.blockType === 'wait') {
      const edgeToWait = edges.find((edge) => edge.target === previousNode.id);
      if (!edgeToWait) return false;

      const nodeBeforeWait = nodes.find((node) => node.id === edgeToWait.source);
      return nodeBeforeWait?.data?.blockType === 'chatgpt';
    }

    if (previousNode.data.blockType === 'chatgptImage') {
      const edgeToWait = edges.find((edge) => edge.target === previousNode.id);
      if (!edgeToWait) return false;

      const nodeBeforeWait = nodes.find((node) => node.id === edgeToWait.source);
      return nodeBeforeWait?.data?.blockType === 'chatgpt';
    }

    return previousNode.data.blockType === 'chatgpt';
  };


  const isConnectedToChatGPTImage = (currentNodeId) => {
    const incomingEdge = edges.find((edge) => edge.target === currentNodeId);
    if (!incomingEdge) return false;

    const previousNode = nodes.find((node) => node.id === incomingEdge.source);
    if (!previousNode) return false;

    if (previousNode.data.blockType === 'wait') {
      const edgeToWait = edges.find((edge) => edge.target === previousNode.id);
      if (!edgeToWait) return false;

      const nodeBeforeWait = nodes.find((node) => node.id === edgeToWait.source);
      return nodeBeforeWait?.data?.blockType === 'chatgptImage';
    }

    if (previousNode.data.blockType === 'chatgpt') {
      const edgeToWait = edges.find((edge) => edge.target === previousNode.id);
      if (!edgeToWait) return false;

      const nodeBeforeWait = nodes.find((node) => node.id === edgeToWait.source);
      return nodeBeforeWait?.data?.blockType === 'chatgptImage';
    }

    return previousNode.data.blockType === 'chatgptImage';
  };

  const isConnectedToSubmittedForms = (currentNodeId) => {
    const incomingEdge = edges.find((edge) => edge.target === currentNodeId);
    if (!incomingEdge) return false;

    const previousNode = nodes.find((node) => node.id === incomingEdge.source);
    if (!previousNode) return false;

    if (previousNode.data.blockType === 'wait') {
      const edgeToWait = edges.find((edge) => edge.target === previousNode.id);
      if (!edgeToWait) return false;

      const nodeBeforeWait = nodes.find((node) => node.id === edgeToWait.source);
      return nodeBeforeWait?.data?.blockType === 'formSubmitted';
    }

    return previousNode.data.blockType === 'formSubmitted';
  };



  const filteredBlockTypes = Object.values(BLOCK_TYPES).filter(block => {
    const isTriggerPurpose = block.purpose === t('automationFlow.purposes.triggers');

    if (isTriggerPurpose && startType !== "event") {
      return false;
    }

    return true;
  });

  const blocksByPurpose = filteredBlockTypes.reduce((acc, block) => {
    const key = block.purpose;
    if (!acc[key]) acc[key] = [];
    acc[key].push(block);
    return acc;
  }, {});
  return (
    <Box sx={{ height: "100vh", width: "100%" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 1
          }}
        >
          <ArrowBackIos
            style={{ cursor: "pointer" }}
            onClick={() => {
              setIsCreating(false);
              setEditingAutomation(false);
            }}
          />
          <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center" }}>
            {flowName || t("automationFlow.title")}
          </Typography>
          <IconButton onClick={() => setIsDrawerOpen(true)}>
            <SettingsIcon />
          </IconButton>
        </Box>
    <Drawer
      anchor={window.outerWidth > 600 ? "right" : "bottom"}
      open={isDrawerOpen}
      onClose={() => setIsDrawerOpen(false)}
      PaperProps={{ sx: { width: window.outerWidth > 600 ? '35%' : '90%', height: window.outerWidth > 600 ? '100%' : '75%', padding: 3, borderTopLeftRadius: window.outerWidth > 600 ? '0px' : '30px', borderTopRightRadius: window.outerWidth > 600 ? '0px' : '30px', } }}
    >
      <Box sx={{display:'flex', justifyContent:'space-between'}}>
      <Typography variant="h5" fontWeight="bold" color="primary" mb={2}>
        {t("automationFlow.title")}
      </Typography>
      {window.outerWidth < 600 ? <IoIosClose size={35} onClick={() => setIsDrawerOpen(false)} /> : ''}
      </Box>

      <TextField
        label={t("automationFlow.flowName")}
        variant="outlined"
        value={flowName}
        onChange={(e) => setFlowName(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />
      <Box sx={{ mb: 3 }}>
        <FormLabel component="legend" sx={{
          mb: 1.5,
          fontWeight: 500,
          fontSize: '0.875rem',
          color: 'text.primary',
          display: 'block'
        }}>
          {t('automationFlow.triggers.title')}
        </FormLabel>

        <RadioGroup
          value={startType}
          onChange={(e) => setStartType(e.target.value as 'scheduled' | 'event')}
          sx={{ gap: 1 }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              cursor: editingAutomation ? 'not-allowed' : 'pointer',
              opacity: editingAutomation ? 0.7 : 1,
            }}
            onClick={() => !editingAutomation && setStartType('scheduled')}
          >
            <Box sx={{
              width: 18,
              height: 18,
              borderRadius: '50%',
              border: startType === 'scheduled' ? '5px solid' : '2px solid',
              borderColor: startType === 'scheduled' ? 'primary.main' : 'action.disabled',
              mr: 1.5,
              transition: 'all 0.2s ease',
            }} />
            <Typography variant="body2">
              {t('automationFlow.triggers.dateTrigger')}
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              cursor: editingAutomation ? 'not-allowed' : 'pointer',
              opacity: editingAutomation ? 0.7 : 1,
            }}
            onClick={() => !editingAutomation && setStartType('event')}
          >
            <Box sx={{
              width: 18,
              height: 18,
              borderRadius: '50%',
              border: startType === 'event' ? '5px solid' : '2px solid',
              borderColor: startType === 'event' ? 'primary.main' : 'action.disabled',
              mr: 1.5,
              transition: 'all 0.2s ease',
            }} />
            <Typography variant="body2">
              {t('automationFlow.triggers.eventTrigger')}
            </Typography>
          </Box>
        </RadioGroup>
      </Box>
<br/>

      {startType === "scheduled" && (
        <>
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
            <DateTimePicker
              value={nextExecutionTime ? new Date(nextExecutionTime) : null}
              onChange={(newValue: Date | null) => {
                if (newValue) {
                  const formattedDate = format(newValue, "yyyy-MM-dd'T'HH:mm");
                  setNextExecutionTime(formattedDate);
                } else {
                  setNextExecutionTime("");
                }
              }}
              renderInput={(params) => (
                <TextField {...params} fullWidth sx={{ mb: 2 }} />
              )}
              ampm={false}
              inputFormat="dd/MM/yyyy HH:mm"
              views={["year", "month", "day", "hours", "minutes"]}
            />
          </LocalizationProvider>
          <br/>
          <TextField
            label={t("automationFlow.repeatInterval")}
            variant="outlined"
            type="number"
            value={repeatInterval}
            onChange={(e) => setRepeatInterval(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
        </>
      )}

      <Typography sx={{ fontWeight: 200, fontSize: '15pt' }}>Blocks</Typography>
      <br />

      {Object.entries(blocksByPurpose).map(([purpose, blocks]) => (
        <Accordion key={purpose} sx={{ mb: 1, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: 'primary.main' }} />}
            sx={{
              backgroundColor: 'background.paper',
              borderRadius: 1,
              '&:hover': { backgroundColor: 'action.hover' }
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 500,
                color: 'text.primary',
                textTransform: 'capitalize'
              }}
            >
              {purpose}
            </Typography>
          </AccordionSummary>

          <AccordionDetails sx={{ pt: 2, px: 2, pb: 3 }}>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 2,
                '& > *': { flexShrink: 0 }
              }}
            >
              {blocks?.map((block) => (
                <Button
                  key={block.type}
                  variant="outlined"
                  size="medium"
                  startIcon={
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      color: 'primary.main',
                      '& svg': { fontSize: '1.2rem' }
                    }}>
                      {block.icon}
                    </Box>
                  }
                  sx={{
                    minWidth: 140,
                    px: 2,
                    py: 1.5,
                    borderRadius: 2,
                    '&:hover': {
                      boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                    }
                  }}
                  onClick={() => {
                    const handlers = {
                      email: handleAddEmailBlock,
                      twitter: handleAddTwitterBlock,
                      linkedin: handleAddLinkedinBlock,
                      facebook: handleAddFacebookBlock,
                      whatsapp: handleAddWhatsappBlock,
                      youtube: handleAddYoutubeBlock,
                      instagram: handleAddInstagramBlock,
                    };

                    handlers[block.type] ? handlers[block.type]() : addNode(block);
                  }}
                >
                  <Typography variant="body2" component="span">
                    {block.name}
                  </Typography>
                </Button>
              ))}
            </Box>
          </AccordionDetails>
        </Accordion>
      ))}

      <Box mt={4} display="flex" justifyContent="space-between" gap={2} style={{marginBottom:'50px'}}>
        {
          startType === 'scheduled' && (
            <Button
              variant="outlined"
              color="success"
              onClick={handleTestAutomation}
            >
              {t("automationFlow.testAutomation")}
            </Button>
          )
        }
        <Button
          variant="contained"
          color="success"
          onClick={handleSaveAutomation}
        >
          {t("automationFlow.saveAutomation")}
        </Button>
      </Box>
    </Drawer>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
      {editingNode && (
        <Dialog open={!!openEditDialog} onClose={() => setOpenEditDialog("")}>
          {variableInstructions(editingNode)}
      {editingNode.data.blockType === "twitter" && (
        <>
        <TwitterNodeEditor
          editingNode={editingNode}
          setEditingNode={setEditingNode}
          isConnectedToChatGPT={isConnectedToChatGPT}
          />
          </>
      )}
      {editingNode.data.blockType === "youtube" && (
        <YouTubeNodeEditor
          editingNode={editingNode}
          setEditingNode={setEditingNode}
          isConnectedToChatGPT={isConnectedToChatGPT}
        />
      )}
      {editingNode.data.blockType === "facebook" && (
        <FacebookNodeEditor
        editingNode={editingNode}
        setEditingNode={setEditingNode}
        facebookPages={facebookPages}
        isConnectedToChatGPT={isConnectedToChatGPT}
        />
      )}
        {editingNode.data.blockType === "instagram" && (
        <InstagramNodeEditor
        editingNode={editingNode}
        setEditingNode={setEditingNode}
        isConnectedToChatGPT={isConnectedToChatGPT}
        />
      )}
      {editingNode.data.blockType === "formSubmitted" && (
      <PickLeadsForm
        editingNode={editingNode}
        setEditingNode={setEditingNode}
        activeCompany={activeCompany}
        />
      )}
          {editingNode.data.blockType === "whatsappTrigger" && (
            <WhatsappChatbotModal
              editingNode={editingNode}
              setEditingNode={setEditingNode}
              open={!!openEditDialog}
              onClose={() => setOpenEditDialog("")}
              onSave={handleSaveEdit}
            />
          )}
          {editingNode.data.blockType === "linkedin" && (
            <Box>
              <TextField
                sx={{
                  padding: "10px",
                  width: "550px",
                  marginTop: "15px",
                  marginRight: "15px",
                  marginLeft: "15px",
                  cursor: isConnectedToChatGPT(editingNode.id) ? "not-allowed" : "text",
                }}
                label={t("automationFlow.linkedinPostContent")}
                fullWidth
                multiline
                rows={4}
                inputProps={{ maxLength: 1300 }}
                value={editingNode.data.params.linkedinContent || ""}
                disabled={isConnectedToChatGPT()}
                onChange={(e) => {
                  setEditingNode({
                    ...editingNode,
                    data: {
                      ...editingNode.data,
                      params: {
                        ...editingNode.data.params,
                        linkedinContent: e.target.value,
                      },
                    },
                  });
                }}
              />
            </Box>
          )}
          {editingNode && editingNode.data.blockType === "chatgpt" && (
            <Dialog
              open={!!openEditDialog}
              onClose={() => setOpenEditDialog("")}
              fullWidth
            >
              <DialogTitle>{t("automationFlow.configureAI")}</DialogTitle>
              <DialogContent>
                <TextField
                  select
                  label={t("automationFlow.aiActionLabel")}
                  fullWidth
                  sx={{ marginTop: "10px" }}
                  value={editingNode.data.params.action || ""}
                  onChange={(e) =>
                    setEditingNode({
                      ...editingNode,
                      data: {
                        ...editingNode.data,
                        params: {
                          ...editingNode.data.params,
                          action: e.target.value,
                        },
                      },
                    })
                  }
                >
                  <MenuItem value="generateContent">
                    {t("automationFlow.aiActionGenerateContent")}
                  </MenuItem>
                </TextField>

                {/* Escolher a Plataforma */}
                <TextField
                  select
                  label={t("automationFlow.platform")}
                  fullWidth
                  sx={{ marginTop: "10px" }}
                  value={editingNode.data.params.platform || ""}
                  onChange={(e) =>
                    setEditingNode({
                      ...editingNode,
                      data: {
                        ...editingNode.data,
                        params: {
                          ...editingNode.data.params,
                          platform: e.target.value,
                        },
                      },
                    })
                  }
                >
                  <MenuItem value="whatsapp">
                    {t("platform.whatsapp")}
                  </MenuItem>
                  <MenuItem value="twitter">
                    {t("platform.twitter")}
                  </MenuItem>
                  <MenuItem value="instagram">
                    {t("platform.instagram")}
                  </MenuItem>
                  <MenuItem value="email">{t("platform.email")}</MenuItem>
                  <MenuItem value="facebook">Facebook</MenuItem>
                </TextField>

                {/* Escolher o Tom de Voz */}
                <TextField
                  select
                  label={t("automationFlow.tone")}
                  fullWidth
                  sx={{ marginTop: "10px" }}
                  value={editingNode.data.params.tone || ""}
                  onChange={(e) =>
                    setEditingNode({
                      ...editingNode,
                      data: {
                        ...editingNode.data,
                        params: {
                          ...editingNode.data.params,
                          tone: e.target.value,
                        },
                      },
                    })
                  }
                >
                  <MenuItem value="formal">{t("tone.formal")}</MenuItem>
                  <MenuItem value="casual">{t("tone.casual")}</MenuItem>
                  <MenuItem value="divertido">{t("tone.fun")}</MenuItem>
                </TextField>

                {/* Instruções */}
                <TextField
                  label={t("automationFlow.instructions")}
                  fullWidth
                  sx={{ marginTop: "10px" }}
                  value={editingNode.data.params.instructions || ""}
                  onChange={(e) =>
                    setEditingNode({
                      ...editingNode,
                      data: {
                        ...editingNode.data,
                        params: {
                          ...editingNode.data.params,
                          instructions: e.target.value,
                        },
                      },
                    })
                  }
                />

                {/* Testar IA */}
                <Button
                  sx={{ marginTop: "15px" }}
                  variant="outlined"
                  onClick={async () => {
                    setIsLoadingAi(true);
                    try {
                      const prompt = `
                        Create content for this platform: ${
                          editingNode.data.params.platform || "undefined"
                        }.
                        Action: ${
                          editingNode.data.params.action ||
                          t("automationFlow.aiActionGenerateContent")
                        }.
                        Voice: ${editingNode.data.params.tone || "Normal"}.
                        User instructions and language: ${
                          editingNode.data.params.instructions ||
                          "Not specified"
                        }.
                      `;

                      const response = await AiService.askQuickQuestion(
                        activeCompany,
                        prompt
                      );

                      if (response.data && response.data.answer) {
                        setEditingNode({
                          ...editingNode,
                          data: {
                            ...editingNode.data,
                            params: {
                              ...editingNode.data.params,
                              aiResponse: response.data.answer,
                            },
                          },
                        });
                      }
                    } catch (error) {
                      console.error("Erro ao obter resposta da IA:", error);
                    } finally {
                      setIsLoadingAi(false);
                    }
                  }}
                  disabled={isLoadingAi}
                >
                  {isLoadingAi
                    ? t("automationFlow.generating")
                    : t("automationFlow.testAI")}
                </Button>

                {/* Skeleton enquanto a resposta carrega */}
                {isLoadingAi && (
                  <Box sx={{ marginTop: "15px" }}>
                    <Skeleton variant="text" width="100%" height={20} />
                    <Skeleton variant="text" width="90%" height={20} />
                    <Skeleton variant="text" width="95%" height={20} />
                    <Skeleton variant="text" width="80%" height={20} />
                  </Box>
                )}

                {/* Exibir Resposta da IA */}
                {!isLoadingAi && editingNode.data.params.aiResponse && (
                  <Box
                    sx={{
                      marginTop: "15px",
                      padding: "10px",
                      border: "1px solid #ddd",
                      borderRadius: "5px",
                    }}
                  >
                    <Typography variant="subtitle1">
                      {t("automationFlow.aiResponse")}
                    </Typography>
                    <Typography variant="body2">
                      {editingNode.data.params.aiResponse}
                    </Typography>
                  </Box>
                )}
              </DialogContent>

              <DialogActions>
                <Button onClick={() => setOpenEditDialog("")}>
                  {t("form.cancel")}
                </Button>
                <Button
                  onClick={handleSaveEdit}
                  variant="contained"
                  disabled={!editingNode.data.params.aiResponse}
                >
                  {t("form.save")}
                </Button>
              </DialogActions>
            </Dialog>
          )}
{editingNode && editingNode.data.blockType === "chatgptImage" && (
  <Dialog
    open={!!openEditDialog}
    onClose={() => setOpenEditDialog("")}
    fullWidth
    maxWidth="sm"
  >
    <ToggleButtonGroup
      value={mode}
      exclusive
      onChange={(_, newMode) => {
        setSelectedTemplate(null);
        setMode(newMode);
      }}
      sx={{ mb: 2 }}
      fullWidth
    >
      <ToggleButton value="ai">{t("marketing.templateDialog.createAiTemplate")}</ToggleButton>
      <ToggleButton value="choose">{t("marketing.templateDialog.chooseTemplate")}</ToggleButton>
    </ToggleButtonGroup>

    {mode !== "choose" ? (
      <>
        {!selectedTemplate && (
          <>
            <DialogTitle>{t("automationFlow.configureAI")}</DialogTitle>
            <DialogContent>
              <TextField
                label={t("automationFlow.instructions")}
                fullWidth
                sx={{ marginTop: "10px" }}
                value={editingNode.data.params.instructions || ""}
                onChange={(e) =>
                  setEditingNode({
                    ...editingNode,
                    data: {
                      ...editingNode.data,
                      params: {
                        ...editingNode.data.params,
                        instructions: e.target.value,
                      },
                    },
                  })
                }
              />

              <Box
                sx={{
                  position: "relative",
                  marginTop: "20px",
                  border: "1px dashed #ccc",
                  borderRadius: "4px",
                  padding: "16px",
                  textAlign: "center",
                  transition: "all 0.3s ease",
                  minHeight: "150px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  "&:hover": {
                    borderColor: "#1976d2",
                    backgroundColor:
                      editingNode.data.params.files?.length > 0
                        ? "transparent"
                        : "rgba(25, 118, 210, 0.04)",
                  },
                }}
              >
                {!(editingNode.data.params.files?.length > 0) ? (
                  <>
                    <input
                      type="file"
                      multiple
                      accept=".jpg,.png,.jpeg,.pdf"
                      onChange={async (e) => {
                        const files = Array.from(e.target.files || []);
                        const validFiles = [];

                        for (const file of files) {
                          if (file.size > 20 * 1024 * 1024) {
                            alert(t("automationFlow.fileSizeError"));
                            continue;
                          }

                          const toBase64 = (file) =>
                            new Promise<string>((resolve, reject) => {
                              const reader = new FileReader();
                              reader.readAsDataURL(file);
                              reader.onload = () => resolve(reader.result as string);
                              reader.onerror = (error) => reject(error);
                            });

                          const base64 = await toBase64(file);

                          validFiles.push({
                            name: file.name,
                            type: file.type,
                            size: file.size,
                            base64,
                          });
                        }

                        setEditingNode({
                          ...editingNode,
                          data: {
                            ...editingNode.data,
                            params: {
                              ...editingNode.data.params,
                              files: validFiles,
                            },
                          },
                        });
                      }}
                      style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        top: 0,
                        left: 0,
                        opacity: 0,
                        cursor: "pointer",
                      }}
                      id="file-upload"
                    />

                    <label htmlFor="file-upload">
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        <CloudUploadIcon sx={{ color: "#1976d2", fontSize: "40px" }} />
                        <Typography variant="body1" sx={{ mt: 1 }}>
                          <strong>{t("automationFlow.clickToUpload")}</strong>
                        </Typography>
                        <Typography variant="body2" sx={{ color: "text.secondary" }}>
                          {t("automationFlow.acceptedFormats")}: .jpg, .png, .jpeg, .pdf
                        </Typography>
                        <Typography variant="body2" sx={{ color: "text.secondary", mt: 1 }}>
                          {t("automationFlow.maxSize")}: 20MB
                        </Typography>
                        <Typography variant="caption" sx={{ color: "text.disabled", mt: 1 }}>
                          {t("automationFlow.optional")}
                        </Typography>
                      </Box>
                    </label>
                  </>
                ) : (
                  <Box sx={{ width: "100%" }}>
                    {editingNode.data.params.files.map((file, index) => (
                      <Box key={index} sx={{ marginTop: index === 0 ? 0 : 2 }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            {file.type.includes("image/") ? (
                              <ImageIcon color="primary" />
                            ) : (
                              <PictureAsPdfIcon color="primary" />
                            )}
                            <Box>
                              <Typography variant="body1" noWrap sx={{ maxWidth: "300px" }}>
                                {file.name}
                              </Typography>
                              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                                {Math.round(file.size / 1024)} KB
                              </Typography>
                            </Box>
                          </Box>
                          <IconButton
                            onClick={() => {
                              const newFiles = [...editingNode.data.params.files];
                              newFiles.splice(index, 1);
                              setEditingNode({
                                ...editingNode,
                                data: {
                                  ...editingNode.data,
                                  params: {
                                    ...editingNode.data.params,
                                    files: newFiles,
                                  },
                                },
                              });
                            }}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>

                        {file.type.includes("image/") && (
                          <Box
                            sx={{
                              mt: 2,
                              maxHeight: "200px",
                              overflow: "hidden",
                              borderRadius: "4px",
                            }}
                          >
                            <img
                              src={file.base64}
                              alt="Preview"
                              style={{
                                width: "100%",
                                height: "auto",
                                objectFit: "contain",
                              }}
                            />
                          </Box>
                        )}
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>

              <Button
                sx={{ marginTop: "15px" }}
                variant="outlined"
                onClick={async () => {
                  setIsLoadingAi(true);
                  try {
                    const formData = new FormData();
                    formData.append("companyId", activeCompany);
                    formData.append("instructions", editingNode.data.params.instructions);

                    let imagesUrls = [];
                    if (editingNode.data.params.files?.length) {
                      for (const file of editingNode.data.params.files) {
                        const urls = await uploadImagesToApi(file);
                        imagesUrls.push(...urls);
                      }
                    }
                    formData.append("images", JSON.stringify(imagesUrls));

                    const response = await AiService.askQuickImage(formData);
                    if (response.data) {
                      setSelectedTemplate(response.data)
                      setEditingNode({
                        ...editingNode,
                        data: {
                          ...editingNode.data,
                          params: {
                            ...editingNode.data.params,
                            aiResponse: response.data,
                            template: false,
                          },
                        },
                      });
                    }
                  } catch (error) {
                    console.error("Erro ao obter resposta da IA:", error);
                  } finally {
                    setIsLoadingAi(false);
                  }
                }}
                disabled={isLoadingAi || !editingNode.data.params.instructions}
              >
                {isLoadingAi
                  ? t("automationFlow.generating")
                  : t("automationFlow.testAI")}
              </Button>

              {isLoadingAi && (
                <Box sx={{ marginTop: "15px" }}>
                  <Skeleton variant="text" width="100%" height={20} />
                  <Skeleton variant="text" width="90%" height={20} />
                  <Skeleton variant="text" width="95%" height={20} />
                  <Skeleton variant="text" width="80%" height={20} />
                </Box>
              )}
            </DialogContent>
        </>
        )}
            {!isLoadingAi && editingNode.data.params.aiResponse && selectedTemplate && (
              <Box
                sx={{
                  marginTop: "15px",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                  textAlign: "center",
                }}
              >
                <Box sx={{mt:-5, ml:'-90%'}}>
                  <IoIosArrowBack color="#6f6f6f" size={30} style={{cursor:'pointer'}}  onClick={()=>{setSelectedTemplate(null)}}/>
                </Box>
                <iframe
                  id="template-preview-1"
                  style={{
                    width: "100%",
                    height: "400px",
                    border: "none",
                  }}
                  srcDoc={editingNode.data.params.aiResponse}
                  frameBorder="0"
                />
              </Box>
            )}
          </>
    ) : (
        <>
          <DialogContent>
            {socialMediaTemplates.length > 0 ? (
              <>
              {!selectedTemplate && (
                <Grid container spacing={2}>
                  {socialMediaTemplates.map((template) => (
                    <Grid item xs={12} sm={6} key={template.id}>
                      <Box
                        sx={{
                          borderRadius: 2,
                          overflow: 'hidden',
                          transition: 'transform 0.3s, box-shadow 0.3s',
                          cursor: 'pointer',
                          border: selectedTemplate === template.id
                            ? '2px solid #1976d2'
                            : '1px solid #e0e0e0',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: 2
                          }
                        }}
                        onClick={() => {
                          setSelectedTemplate(template.htmlContent);
                          setEditingNode({
                            ...editingNode,
                            data: {
                              ...editingNode.data,
                              params: {
                                ...editingNode.data.params,
                                aiResponse: template.htmlContent,
                                template: true,
                              }
                            }
                          });
                        }}
                      >
                        <Box sx={{
                          position: 'relative',
                          overflow: 'hidden',
                          height: '300px',
                        }}>
                          <img
                            src={template.screenshot}
                            alt={template.name}
                            style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }}
                          />
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>

              )}

                {selectedTemplate && (
                  <Box sx={{ mt: 3 }}>
                    <Box sx={{mt:-5}}>
                      <IoIosArrowBack color="#6f6f6f" size={30} style={{cursor:'pointer'}}  onClick={()=>{setSelectedTemplate('')}}/>
                    </Box>
                    <Box
                      sx={{
                        border: "1px solid #ddd",
                        borderRadius: "5px",
                        textAlign: "center",
                      }}
                    >
                      <iframe
                        id="template-preview-2"
                        ref={iframeRef}
                        style={{
                          width: "100%",
                          height: "400px",
                          border: "none",
                        }}
                        onLoad={() => setIframeLoaded(true)}
                        srcDoc={selectedTemplate}
                        frameBorder="0"
                      />
                    </Box>
                  </Box>
                )}
              </>
            ) : (
              <Typography sx={{ p: 2, textAlign: 'center' }}>
                {t("marketing.templateDialog.noTemplatesAvailable")}
              </Typography>
            )}
          </DialogContent>
        </>
      )}

      <DialogActions>
        <Button onClick={() => setOpenEditDialog("")}>
          {t("form.cancel")}
        </Button>
        <Button
          onClick={handleSaveEdit}
          variant="contained"
          disabled={mode === "choose" ? !selectedTemplate : !editingNode.data.params.aiResponse}
        >
          {t("form.save")}
        </Button>
      </DialogActions>
    </Dialog>
)}

          <DialogContent>
            {editingNode.data.blockType === "email" && (
              <>
                <TextField
                  sx={{ marginTop: "10px" }}
                  label={t("automationFlow.emailName")}
                  fullWidth
                  value={editingNode.data.params.name}
                  onChange={(e) =>
                    setEditingNode({
                      ...editingNode,
                      data: {
                        ...editingNode.data,
                        params: {
                          ...editingNode.data.params,
                          name: e.target.value,
                        },
                      },
                    })
                  }
                />
                <TextField
                  sx={{ marginTop: "10px" }}
                  label={t("automationFlow.recipients")}
                  fullWidth
                  value={editingNode.data.params.recipients}
                  onChange={(e) =>
                    setEditingNode({
                      ...editingNode,
                      data: {
                        ...editingNode.data,
                        params: {
                          ...editingNode.data.params,
                          recipients: e.target.value,
                        },
                      },
                    })
                  }
                />
                <TextField
                  sx={{
                    marginTop: "10px",
                    cursor: isConnectedToChatGPT(editingNode.id)
                      ? "not-allowed"
                      : "text",
                  }}
                  label={t("automationFlow.subject")}
                  fullWidth
                  value={editingNode.data.params.subject || ""}
                  onChange={(e) =>
                    setEditingNode({
                      ...editingNode,
                      data: {
                        ...editingNode.data,
                        params: {
                          ...editingNode.data.params,
                          subject: e.target.value,
                        },
                      },
                    })
                  }
                  disabled={isConnectedToChatGPT(editingNode.id)}
                />
                {isConnectedToChatGPT(editingNode.id) && (
                  <Typography
                    sx={{
                      color: "#FFA500",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginTop: "5px",
                      textAlign: "center",
                    }}
                    variant="body2"
                  >
                    <WarningAmberIcon sx={{ fontSize: 18 }} />
                    {t("automationFlow.subjectBlockedByAI")}
                  </Typography>
                )}
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body1" mb={1}>
                    {t("automationFlow.selectedTemplate")}
                  </Typography>
                  {editingNode.data.params.template &&
                  editingNode.data.params.template.id ? (
                    <Box sx={{ border: "1px solid #ddd", p: 1, borderRadius: 1 }}>
                      <Typography variant="body2">
                        ID: {editingNode.data.params.template.id}
                      </Typography>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      {t("automationFlow.noTemplateSelected")}
                    </Typography>
                  )}
                  <Button
                    sx={{ mt: 1 }}
                    variant="outlined"
                    onClick={() => setOpenTemplateSelector(true)}
                  >
                    {t("automationFlow.chooseTemplate")}
                  </Button>
                </Box>
              </>
            )}
            {editingNode.data.blockType === "wait" && (
              <TextField
                sx={{ marginTop: "10px" }}
                label={t("automationFlow.repeatInterval")}
                type="number"
                fullWidth
                value={editingNode.data.params.waitHours}
                onChange={(e) =>
                  setEditingNode({
                    ...editingNode,
                    data: {
                      ...editingNode.data,
                      params: {
                        ...editingNode.data.params,
                        waitHours: e.target.value,
                      },
                    },
                  })
                }
              />
            )}
            {editingNode.data.blockType === "waitWhatsapp" && (
              <WaitWhatsappModal
                editingNode={editingNode}
                setEditingNode={setEditingNode}
                open={!!openEditDialog}
                onClose={() => setOpenEditDialog("")}
                onSave={handleSaveEdit}
              />
            )}
            {editingNode.data.blockType === "whatsapp" && (
              <>
              <TextField
                sx={{ marginTop: "10px" }}
                label={t('marketing.whatsappMessage')}
                type="text"
                fullWidth
                disabled={isConnectedToChatGPT(editingNode.id)}
                value={editingNode.data.params.message}
                onChange={(e) =>
                  setEditingNode({
                    ...editingNode,
                    data: {
                      ...editingNode.data,
                      params: {
                        ...editingNode.data.params,
                        message: e.target.value,
                      },
                    },
                  })
                }
              />
              {isConnectedToChatGPT(editingNode.id) && (
                <>
                  <Typography
                    sx={{
                      color: "#FFA500",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginTop: "5px",
                      textAlign: "center",
                    }}
                    variant="body2"
                  >
                    <WarningAmberIcon sx={{ fontSize: 18 }} />
                    {t("automationFlow.subjectBlockedByAI")}
                  </Typography>
                  <br/>
                  </>
                )}
              <Box
                sx={{
                  position: 'relative',
                  marginTop: '20px',
                  border: '1px dashed #ccc',
                  borderRadius: '4px',
                  padding: '16px',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  minHeight: '150px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  '&:hover': {
                    borderColor: '#1976d2',
                    backgroundColor: editingNode.data.params.file ? 'transparent' : 'rgba(25, 118, 210, 0.04)'
                  }
                }}
              >
              {!editingNode.data.params.file ? (
                <>
                  <input
                    disabled={isConnectedToChatGPTImage(editingNode.id)}
                    type="file"
                    accept=".jpg,.png,.jpeg"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        if (file.size > 60 * 1024 * 1024) {
                          alert(t("automationFlow.fileSizeError"));
                          return;
                        }

                        const toBase64 = (file) =>
                          new Promise<string>((resolve, reject) => {
                            const reader = new FileReader();
                            reader.readAsDataURL(file);
                            reader.onload = () => resolve(reader.result as string);
                            reader.onerror = (error) => reject(error);
                          });

                        const base64 = await toBase64(file);

                        setEditingNode({
                          ...editingNode,
                          data: {
                            ...editingNode.data,
                            params: {
                              ...editingNode.data.params,
                              file: {
                                name: file.name,
                                type: file.type,
                                size: file.size,
                                base64,
                              },
                            },
                          },
                        });
                      }
                    }}
                    style={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      top: 0,
                      left: 0,
                      opacity: 0,
                      cursor: 'pointer',
                    }}
                    id="file-upload"
                  />
                  <label htmlFor="file-upload">
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <CloudUploadIcon sx={{ color: '#1976d2', fontSize: '40px' }} />
                      <Typography variant="body1" sx={{ mt: 1 }}>
                        <strong>{t("automationFlow.clickToUpload")}</strong>
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {t("automationFlow.acceptedFormats")}: .jpg, .png, .jpeg
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                        {t("automationFlow.maxSize")}: 60MB
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.disabled', mt: 1 }}>
                        {t("automationFlow.optional")}
                      </Typography>
                    </Box>
                  </label>
                </>
              ) : (
                <Box sx={{ width: '100%' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      {editingNode.data.params.file.type.includes('image/') ? (
                        <ImageIcon color="primary" />
                      ) : (
                        <PictureAsPdfIcon color="primary" />
                      )}
                      <Box>
                        <Typography variant="body1" noWrap sx={{ maxWidth: '300px' }}>
                          {editingNode.data.params.file.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          {Math.round(editingNode.data.params.file.size / 1024)} KB
                        </Typography>
                      </Box>
                    </Box>
                    <IconButton
                      onClick={() =>
                        setEditingNode({
                          ...editingNode,
                          data: {
                            ...editingNode.data,
                            params: {
                              ...editingNode.data.params,
                              file: null,
                            },
                          },
                        })
                      }
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>

                  {editingNode.data.params.file.type.includes('image/') && (
                    <Box sx={{ mt: 2, maxHeight: '200px', overflow: 'hidden', borderRadius: '4px' }}>
                      <img
                        src={editingNode.data.params.file.base64}
                        alt="Preview"
                        style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
                      />
                    </Box>
                  )}
                </Box>
              )}
              {isConnectedToChatGPTImage(editingNode.id) && (
                <>
                  <Typography
                    sx={{
                      color: "#FFA500",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginTop: "5px",
                      textAlign: "center",
                    }}
                    variant="body2"
                  >
                    <WarningAmberIcon sx={{ fontSize: 18 }} />
                    {t("automationFlow.imageBlockedByAI")}
                  </Typography>
                  <br/>
                  </>
                )}
              </Box>
              <br/>
              <Typography>{t('marketing.whatsappCommaMessage')}</Typography>
              <TextField
              sx={{ marginTop: "10px" }}
              type="text"
              fullWidth
              value={editingNode.data.params.numbers}
              onChange={(e) =>
                setEditingNode({
                  ...editingNode,
                  data: {
                    ...editingNode.data,
                    params: {
                      ...editingNode.data.params,
                      numbers: e.target.value,
                    },
                  },
                })
              }
            />
            </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenEditDialog("")}>
              {t("form.cancel")}
            </Button>
            <Button onClick={handleSaveEdit}>{t("form.save")}</Button>
          </DialogActions>
        </Dialog>
      )}

      <TwitterAuthModal
        open={openTwitterAuthModal}
        onClose={() => setOpenTwitterAuthModal(false)}
        onSave={handleSaveTwitterCredentials}
        companyId={activeCompany}
      />

      <LinkedInAuthModal
        open={openLinkedinAuthModal}
        onClose={() => setOpenLinkedinAuthModal(false)}
        onSave={handleSaveTwitterCredentials}
        companyId={activeCompany}
      />

      <FacebookAuthModal
        open={openFacebookAuthModal}
        onClose={() => setOpenFacebookAuthModal(false)}
        onSave={handleSaveTwitterCredentials}
        companyId={activeCompany}
      />

      <InstagramAuthModal
        open={openInstagramAuthModal}
        onClose={() => setOpenInstagramAuthModal(false)}
        onSave={handleSaveTwitterCredentials}
        companyId={activeCompany}
      />

      <YouTubeAuthModal
        open={openYoutubeAuthModal}
        onClose={() => setOpenYoutubeAuthModal(false)}
        onSave={handleSaveTwitterCredentials}
        companyId={activeCompany}
      />

      <WhatsAppAuthModal
        open={openWhatsappAuthModal}
        onClose={() => setOpenWhatsappAuthModal(false)}
        onSave={handleSaveTwitterCredentials}
        companyId={activeCompany}
      />

      <EmailConfigurationModal
        open={openEmailConfigModal}
        onClose={() => setOpenEmailConfigModal(false)}
        onSave={handleSaveEmailConfig}
        activeCompany={activeCompany}
      />

      <EmailTemplateSelector
        templates={emailTemplates}
        open={openTemplateSelector}
        onClose={() => setOpenTemplateSelector(false)}
        onSelect={handleTemplateSelect}
        activeCompany={activeCompany}
      />
    </Box>
  );
};

export default AutomationFlow;
