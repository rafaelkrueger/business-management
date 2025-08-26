import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  useTheme,
  TextField,
  Button,
  Fade,
  Avatar,
  IconButton,
  Tooltip,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  Zoom,
  alpha,
  styled,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import {
  SmartToy,
  Send,
  ArrowBackIos,
  AutoAwesome,
  Person,
  AttachFile,
  InsertDriveFile,
  Close,
  ZoomIn,
  ZoomOut,
  Download,
  PsychologyRounded,
  Lightbulb,
  Mic,
  MoreVert,
  AdsClickOutlined,
  RocketLaunch,
  ThumbUp,
  ThumbDown,
  ContentCopy,
  Settings,
  Description,
  Image,
  Upload
} from '@mui/icons-material';
import {
  Brain,
  Layout,
  Zap,
  Users,
  MessageSquare,
  FileText,
  Coins
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ChatAiService from '../../../services/chat-ai.service.ts';
import { AllInOneApi } from '../../../Api.ts';

const ChatContainer = styled(Box)(({ theme }) => ({
  height: '100vh',
  width: '100%',
  background: '#fafbfc',
  display: 'flex',
  flexDirection: 'column',
  position: 'fixed',
  top: 0,
  left: 0,
  overflow: 'hidden',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(1),
  [theme.breakpoints.up('lg')]: {
    padding: theme.spacing(2),
    '& > *': {
      maxWidth: '900px',
      width: '100%',
      margin: '0 auto'
    }
  },
  [theme.breakpoints.between('md', 'lg')]: {
    padding: theme.spacing(1.5),
    '& > *': {
      maxWidth: '800px',
      width: '100%',
      margin: '0 auto'
    }
  },
  [theme.breakpoints.between('sm', 'md')]: {
    padding: theme.spacing(1),
    '& > *': {
      maxWidth: '700px',
      width: '100%',
      margin: '0 auto'
    }
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(0.5),
    '& > *': {
      width: '100%',
      margin: '0 auto'
    }
  },
}));

const ChatArea = styled(Box)(({ theme }) => ({
  flex: 1,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(1),
  gap: theme.spacing(1),
  minHeight: 0,
  [theme.breakpoints.up('lg')]: {
    padding: theme.spacing(2),
    gap: theme.spacing(2)
  },
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(0.5),
    gap: theme.spacing(0.5)
  }
}));

const MessagesContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  overflowY: 'auto',
  overflowX: 'hidden',
  padding: theme.spacing(1),
  borderRadius: theme.spacing(1),
  background: '#ffffff',
  border: '1px solid #e8eaed',
  minHeight: 0,
  '&::-webkit-scrollbar': {
    width: '4px',
    [theme.breakpoints.down('md')]: {
      width: '2px'
    }
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: '#4674af',
    borderRadius: '3px'
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: '#f1f3f4',
    borderRadius: '3px'
  },
  [theme.breakpoints.up('lg')]: {
    // Ajustar padding para telas grandes
    padding: theme.spacing(2),
    borderRadius: theme.spacing(2)
  },
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(0.5)
  }
}));

const MessageBubble = styled(Box)<{ isUser: boolean }>(({ theme, isUser }) => ({
  maxWidth: '85%',
  padding: theme.spacing(1.5, 2),
  borderRadius: '12px',
  background: isUser ? '#e8eaed' : '#4674af',
  color: isUser ? '#2c3e50' : '#fff',
  boxShadow: isUser
    ? '0 1px 3px rgba(0, 0, 0, 0.1)'
    : '0 2px 8px rgba(70, 116, 175, 0.2)',
  position: 'relative',
  marginBottom: theme.spacing(1),
  wordWrap: 'break-word',
  overflowWrap: 'break-word',
  [theme.breakpoints.up('lg')]: {
    // Ajustar para telas grandes
    maxWidth: '80%',
    padding: theme.spacing(2, 2.5),
    marginBottom: theme.spacing(1.5)
  },
  [theme.breakpoints.down('md')]: {
    maxWidth: '90%',
    padding: theme.spacing(1, 1.5),
    marginBottom: theme.spacing(0.5)
  }
}));

const InputContainer = styled(Box)(({ theme }) => ({
  background: '#ffffff',
  border: '1px solid #e8eaed',
  borderRadius: theme.spacing(1.5),
  padding: theme.spacing(1.5),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginBottom: '100px',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  flexShrink: 0,
  [theme.breakpoints.up('lg')]: {
    // Ajustar padding para telas grandes
    padding: theme.spacing(2),
    gap: theme.spacing(1.5),
    borderRadius: theme.spacing(2)
  },
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(1),
    gap: theme.spacing(0.5),
    borderRadius: theme.spacing(1)
  }
}));

const SendButton = styled(Button)(({ theme }) => ({
  minWidth: '36px',
  width: '36px',
  height: '36px',
  borderRadius: '50%',
  background: '#4674af',
  color: '#fff',
  transition: 'all 0.2s ease',
  '&:hover': {
    background: '#3a5f9a',
    transform: 'scale(1.05)'
  },
  '&.Mui-disabled': {
    background: '#e8eaed',
    color: '#9aa0a6'
  },
  [theme.breakpoints.up('lg')]: {
    // Ajustar para telas grandes
    minWidth: '40px',
    width: '40px',
    height: '40px'
  },
  [theme.breakpoints.down('md')]: {
    minWidth: '32px',
    width: '32px',
    height: '32px'
  }
}));

const ImageContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  margin: theme.spacing(1, 0),
  borderRadius: '12px',
  overflow: 'hidden',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.2s ease',
  border: '1px solid #e8eaed',
  cursor: 'pointer',
  '&:hover': {
    transform: 'scale(1.01)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    '& .image-actions': {
      opacity: 1
    }
  },
  '& img': {
    width: '100%',
    height: 'auto',
    maxHeight: '400px',
    objectFit: 'contain',
    display: 'block'
  },
  position: 'relative',
  '& .image-actions': {
    position: 'absolute',
    top: 8,
    right: 8,
    display: 'flex',
    gap: '4px',
    opacity: 0,
    transition: 'opacity 0.2s ease',
    '& .action-button': {
      backgroundColor: 'rgba(70, 116, 175, 0.8)',
      color: '#fff',
      borderRadius: '50%',
      padding: '6px',
              '&:hover': {
          backgroundColor: 'rgba(70, 116, 175, 1)'
      }
    }
  }
}));

export default function PremiumMarketingAssistant({ activeCompany, setModule }) {
  console.log('PremiumMarketingAssistant renderizando...', { activeCompany, setModule });
    const theme = useTheme();
  const { i18n, t } = useTranslation();
  const [inputValue, setInputValue] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [chat, setChat] = useState<{
    conversationId: string | null;
    messages: any[];
  }>({
    conversationId: null,
    messages: []
  });
  const [isWaiting, setIsWaiting] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [fileName, setFileName] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [imageModal, setImageModal] = useState({
    open: false,
    src: '',
    zoom: 1
  });

  const [messageFeedback, setMessageFeedback] = useState<{[key: string]: {thumbsUp: boolean, thumbsDown: boolean}}>({});
  const [showCopyAlert, setShowCopyAlert] = useState(false);
  const [thinkingIndex, setThinkingIndex] = useState(0);

  // Estados para o modal de configurações
  const [settingsModal, setSettingsModal] = useState({
    open: false
  });
  const [aiInstructions, setAiInstructions] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [assistantId, setAssistantId] = useState<string>('');
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [showSettingsAlert, setShowSettingsAlert] = useState(false);

  const welcomeMessage = {
    id: 'welcome',
    sender: 'assistant',
    content: `${t('ai.welcome.title') || 'Bem-vindo ao Assistente de IA'}

Posso ajudá-lo com:

• Criação de conteúdo para redes sociais
• Templates de email marketing
• Estratégias de marketing
• Análise de campanhas
• Design de materiais promocionais
• Ideias criativas para seu negócio

${t('ai.welcome.subtitle') || 'Como posso ajudá-lo hoje?'}`,
    timestamp: new Date()
  };



  const QuickQuestionsContainer = styled(Box)(({ theme }) => ({
    width: '100%',
    marginTop: theme.spacing(2),
    maxWidth: '800px',
    marginLeft: 'auto',
    marginRight: 'auto',
    [theme.breakpoints.up('lg')]: {
      maxWidth: '900px',
      marginTop: theme.spacing(3)
    },
    [theme.breakpoints.between('md', 'lg')]: {
      maxWidth: '800px',
      marginTop: theme.spacing(2.5)
    },
    [theme.breakpoints.between('sm', 'md')]: {
      maxWidth: '700px',
      marginTop: theme.spacing(2)
    },
    [theme.breakpoints.down('sm')]: {
      maxWidth: '100%',
      marginTop: theme.spacing(1.5),
      padding: theme.spacing(0, 3)
    }
  }));

  const TopicChip = styled(Chip)(({ theme }) => ({
    backgroundColor: '#4674af',
    color: '#ffffff',
    border: '2px solid #4674af',
    margin: theme.spacing(0.5),
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontSize: '0.9rem',
    fontWeight: 600,
    padding: theme.spacing(1, 2),
    borderRadius: '12px',
    '&:hover': {
      backgroundColor: '#1E3A8A',
      borderColor: '#1E3A8A',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(30, 58, 138, 0.3)'
    },
    '& .MuiChip-label': {
      fontSize: '0.9rem',
      fontWeight: 600,
      padding: theme.spacing(0.5, 1)
    },
    '& .MuiChip-icon': {
      color: '#ffffff',
      marginLeft: '-4px',
      marginRight: '4px'
    },
    [theme.breakpoints.up('lg')]: {
      fontSize: '1rem',
      padding: theme.spacing(1.25, 2.5),
      '& .MuiChip-label': {
        fontSize: '1rem',
        padding: theme.spacing(0.75, 1.25)
      }
    },
    [theme.breakpoints.between('md', 'lg')]: {
      fontSize: '0.95rem',
      padding: theme.spacing(1, 2.25),
      margin: theme.spacing(0.25),
      width: 'auto',
      maxWidth: '250px',
      minWidth: '200px',
      '& .MuiChip-label': {
        fontSize: '0.95rem',
        padding: theme.spacing(0.5, 1)
      }
    },
    [theme.breakpoints.between('sm', 'md')]: {
      fontSize: '0.8rem',
      padding: theme.spacing(0.75, 1.5),
      margin: theme.spacing(0.25),
      width: 'auto',
      maxWidth: '220px',
      minWidth: '180px',
      '& .MuiChip-label': {
        fontSize: '0.8rem',
        padding: theme.spacing(0.25, 0.5),
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.75rem',
      padding: theme.spacing(0.5, 1.25),
      margin: theme.spacing(0.25),
      width: 'auto',
      maxWidth: '200px',
      minWidth: '160px',
      '& .MuiChip-label': {
        fontSize: '0.75rem',
        padding: theme.spacing(0.25, 0.5),
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }
    }
  }));

  const DropdownContainer = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderRadius: theme.spacing(2),
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
    border: '1px solid #e8eaed',
    zIndex: 1000,
    maxHeight: '300px',
    overflowY: 'auto',
    marginTop: theme.spacing(1),
    minWidth: '280px'
  }));

  const DropdownItem = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2, 3),
    cursor: 'pointer',
    borderBottom: '1px solid #f1f3f4',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: '#f8f9fa',
      paddingLeft: theme.spacing(3.5)
    },
    '&:last-child': {
      borderBottom: 'none'
    }
  }));

  const QuickQuestionChip = styled(Chip)(({ theme }) => ({
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#ffffff',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    margin: theme.spacing(0.5),
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      transform: 'translateY(-1px)'
    },
    '& .MuiChip-label': {
      fontSize: '0.875rem',
      fontWeight: 500
    },
    [theme.breakpoints.up('lg')]: {
      // Ajustar para telas grandes
      margin: theme.spacing(0.75),
      '& .MuiChip-label': {
        fontSize: '0.95rem'
      }
    },
    [theme.breakpoints.down('md')]: {
      margin: theme.spacing(0.25),
      '& .MuiChip-label': {
        fontSize: '0.8rem'
      }
    }
  }));

  const PremiumChip = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    backgroundColor: '#f8f9fa',
    borderRadius: '20px',
    padding: theme.spacing(1, 2),
    border: '1px solid #e8eaed',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: '#f1f3f4',
      transform: 'translateY(-1px)',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
    },
    [theme.breakpoints.up('lg')]: {
      // Ajustar para telas grandes
      padding: theme.spacing(1.25, 2.5),
      gap: theme.spacing(1.25)
    }
  }));

  const Separator = styled(Box)(({ theme }) => ({
    width: '3px',
    height: '3px',
    borderRadius: '50%',
    backgroundColor: '#9aa0a6'
  }));

  const StartHereChip = styled(Chip)(({ theme }) => ({
    backgroundColor: '#4674af',
    color: '#ffffff',
    border: '2px solid #4674af',
    margin: theme.spacing(0.5),
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontSize: '0.9rem',
    fontWeight: 600,
    padding: theme.spacing(0.75, 1.25),
    borderRadius: '12px',
    '&:hover': {
      backgroundColor: '#1E3A8A',
      borderColor: '#1E3A8A',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(30, 58, 138, 0.3)'
    },
    '& .MuiChip-label': {
      fontSize: '0.9rem',
      fontWeight: 600,
      padding: theme.spacing(0.5, 1)
    },
    '& .MuiChip-icon': {
      color: '#ffffff',
      marginLeft: '-4px',
      marginRight: '4px'
    },
    [theme.breakpoints.up('lg')]: {
      fontSize: '1rem',
      padding: theme.spacing(1.25, 2.5),
      '& .MuiChip-label': {
        fontSize: '1rem',
        padding: theme.spacing(0.75, 1.25)
      }
    }
  }));

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    if (chat.messages.length > 0) {
      scrollToBottom();
    }
  }, [chat.messages, isWaiting]);

  useEffect(() => {
    const sidebar = document.getElementById('mobile-sidebar');
    if (sidebar) {
      sidebar.style.display = 'none';
    }
    return () => {
      if (sidebar) {
        sidebar.style.display = 'block';
      }
    };
  }, []);

  useEffect(() => {
    const initChat = async () => {
      if (!activeCompany) return;

      setIsLoadingHistory(true);
      try {
        console.log('Iniciando chat para empresa:', activeCompany);
        const pastMessages = await ChatAiService.getConversationByCompany(activeCompany);
        console.log('Mensagens carregadas:', pastMessages);

        const formattedMessages = pastMessages.map((msg) => ({
          id: msg.id,
          sender: msg.sender,
          content: msg.message,
          timestamp: msg.createdAt,
        }));

        setChat({
          conversationId: crypto.randomUUID(),
          messages: formattedMessages.length > 0 ? formattedMessages : []
        });
      } catch (error) {
        console.error('Erro ao carregar conversa:', error);
        setChat({
          conversationId: crypto.randomUUID(),
          messages: []
        });
      } finally {
        setIsLoadingHistory(false);
      }
    };

    initChat();
  }, [activeCompany]);

  // Scroll automático quando o histórico é carregado
  useEffect(() => {
    if (!isLoadingHistory && chat.messages.length > 0 && chatContainerRef.current) {
      setTimeout(() => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
      }, 100);
    }
  }, [isLoadingHistory, chat.messages.length]);

  const openImageModal = (src) => {
    setImageModal({
      open: true,
      src,
      zoom: 1
    });
  };

  const closeImageModal = () => {
    setImageModal({
      ...imageModal,
      open: false
    });
  };

  const zoomIn = () => {
    setImageModal(prev => ({
      ...prev,
      zoom: Math.min(prev.zoom + 0.25, 3)
    }));
  };

  const zoomOut = () => {
    setImageModal(prev => ({
      ...prev,
      zoom: Math.max(prev.zoom - 0.25, 0.5)
    }));
  };

  const handleDownloadImage = (src) => {
    const link = document.createElement('a');
    link.href = src;
    link.download = `ai-assistant-${new Date().toISOString().slice(0, 10)}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setSelectedFile(file);
      setFileName(file.name);
    }
  };

  const handleRemoveSelectedFile = () => {
    setSelectedFile(null);
    setFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Funções para o modal de configurações
  const handleOpenSettings = async () => {
    try {
      // Buscar o assistente da empresa
      const assistant = await ChatAiService.getThreadInfo(activeCompany);
      if (assistant) {
        setAssistantId(assistant.assistantId || '');
      }
      setSettingsModal({ open: true });
    } catch (error) {
      console.error('Erro ao buscar assistente:', error);
      setSettingsModal({ open: true });
    }
  };

  const handleCloseSettings = () => {
    setSettingsModal({ open: false });
    setAiInstructions('');
    setUploadedFiles([]);
    setUploadedImages([]);
  };

    const handleSaveSettings = async () => {
    if (!assistantId) {
      console.error('Assistant ID não encontrado');
      return;
    }

    setIsSavingSettings(true);
    try {
      const formData = new FormData();
      formData.append('assistantId', assistantId);
      formData.append('instructions', aiInstructions);

      // Adicionar todos os arquivos (documentos e imagens)
      const allFiles = [...uploadedFiles, ...uploadedImages];
      allFiles.forEach((file, index) => {
        formData.append('files', file);
      });

      const response = await fetch(`http://localhost:3005/ai/update-assistant-settings`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao salvar configurações');
      }

      const result = await response.json();
      console.log('Configurações salvas com sucesso:', result);

      // Mostrar notificação de sucesso
      setShowSettingsAlert(true);
      setTimeout(() => setShowSettingsAlert(false), 3000);

      // Fechar o modal após salvar
      handleCloseSettings();
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      // Aqui você pode adicionar uma notificação de erro para o usuário
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'document' | 'image') => {
    if (event.target.files && event.target.files.length > 0) {
      const files = Array.from(event.target.files);
      if (type === 'document') {
        setUploadedFiles(prev => [...prev, ...files]);
      } else {
        setUploadedImages(prev => [...prev, ...files]);
      }
    }
  };

  const handleRemoveUploadedFile = (index: number, type: 'document' | 'image') => {
    if (type === 'document') {
      setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    } else {
      setUploadedImages(prev => prev.filter((_, i) => i !== index));
    }
  };



  const handleSend = useCallback(async () => {
    if (!chat.conversationId || (!inputValue.trim() && !selectedFile) || isWaiting) return;

    const content = inputValue.trim();
    setInputValue('');

    const userMessage = {
      id: crypto.randomUUID(),
      sender: 'user',
      content: content || fileName,
      isFile: !!selectedFile,
      fileName: selectedFile?.name,
      fileType: selectedFile?.type,
      timestamp: new Date()
    };

    const updatedMessages = [...chat.messages, userMessage];

    setChat(prev => ({
      ...prev,
      messages: updatedMessages
    }));

    setIsWaiting(true);

    try {
      const language = i18n.language.startsWith('en') ? 'en' : 'pt';

      let responseMessages;
      if (selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);

        const response = await AllInOneApi.post('shared/image', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'accept': '*/*',
          },
        });

        responseMessages = await ChatAiService.sendMessage(
          chat.conversationId,
          content || `Arquivo: ${fileName}`,
          activeCompany,
          language,
          response?.data.url
        );
      } else {
        responseMessages = await ChatAiService.sendMessage(
          chat.conversationId,
          content,
          activeCompany,
          language
        );
      }

      setChat(prev => ({
        ...prev,
        messages: responseMessages
      }));

      handleRemoveSelectedFile();
    } catch (error) {
      console.error('Error sending message:', error);
      setChat(prev => ({
        ...prev,
        messages: [
          ...updatedMessages.filter((m) => m.id !== 'typing'),
          {
            id: crypto.randomUUID(),
            sender: 'assistant',
            content: 'Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.',
            timestamp: new Date()
          }
        ]
      }));
    } finally {
      setIsWaiting(false);
    }
  }, [chat.conversationId, inputValue, selectedFile, isWaiting, chat.messages, i18n.language, activeCompany, fileName]);

  const renderMessageContent = (msg) => {
    if (msg.content.includes('data:image/png;base64')) {
      return (
        <ImageContainer>
          <img
            src={msg.content}
            alt="Imagem do chat"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Imagem+não+disponível';
            }}
            onClick={() => openImageModal(msg.content)}
          />
          <Box className="image-actions">
            <Tooltip title="Zoom" arrow>
              <IconButton
                className="action-button"
                onClick={(e) => {
                  e.stopPropagation();
                  openImageModal(msg.content);
                }}
                size="small"
              >
                <ZoomIn fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Download" arrow>
              <IconButton
                className="action-button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownloadImage(msg.content);
                }}
                size="small"
              >
                <Download fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </ImageContainer>
      );
    }

    if (msg.id === 'welcome') {
      return (
        <Box>
          <Typography variant="h6" sx={{
            fontWeight: 600,
            mb: 2,
            color: '#4674af',
            fontSize: '1.1rem'
          }}>
            Assistente de IA
          </Typography>
          <Typography variant="body2" sx={{
            whiteSpace: 'pre-line',
            lineHeight: 1.6,
            fontSize: '0.95rem',
            color: '#2c3e50',
            wordWrap: 'break-word',
            overflowWrap: 'break-word',
            maxWidth: '100%'
          }}>
            {msg.content}
          </Typography>
        </Box>
      );
    }

    if (msg.isFile) {
      return (
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          p: 1.5,
          borderRadius: 2,
          backgroundColor: 'rgba(70, 116, 175, 0.1)',
          border: '1px solid rgba(70, 116, 175, 0.2)',
          maxWidth: '100%',
          wordBreak: 'break-word'
        }}>
                      <InsertDriveFile sx={{
              color: '#4674af',
              fontSize: '1.5rem'
            }} />
          <Typography variant="body2" sx={{
            color: '#2c3e50',
            fontWeight: 500
          }}>
            {msg.fileName}
          </Typography>
        </Box>
      );
    }

    return (
      <Typography variant="body2" sx={{
        whiteSpace: 'pre-line',
        lineHeight: 1.6,
        fontSize: '0.95rem',
        wordWrap: 'break-word',
        overflowWrap: 'break-word',
        maxWidth: '100%'
      }}>
        {msg.content}
      </Typography>
    );
  };

  const handleThumbsUp = (messageId: string) => {
    setMessageFeedback(prev => ({
      ...prev,
      [messageId]: {
        thumbsUp: !prev[messageId]?.thumbsUp,
        thumbsDown: false
      }
    }));
  };

  const handleThumbsDown = (messageId: string) => {
    setMessageFeedback(prev => ({
      ...prev,
      [messageId]: {
        thumbsUp: false,
        thumbsDown: !prev[messageId]?.thumbsDown
      }
    }));
  };

  const handleCopyContent = (content: string) => {
    navigator.clipboard.writeText(content).then(() => {
      setShowCopyAlert(true);
      setTimeout(() => {
        setShowCopyAlert(false);
      }, 2000);
    });
  };

  const thinkingPhrases = [
    t('ai.thinking.analyzing') || 'Analisando...',
    t('ai.thinking.processing') || 'Processando...',
    t('ai.thinking.generating') || 'Gerando...',
    t('ai.thinking.thinking') || 'Pensando...',
    t('ai.thinking.creating') || 'Criando...',
    t('ai.thinking.optimizing') || 'Otimizando...',
    t('ai.thinking.analyzing') || 'Analisando...'
  ];

  useEffect(() => {
    if (isWaiting) {
      const interval = setInterval(() => {
        setThinkingIndex((prev) => (prev + 1) % thinkingPhrases.length);
      }, 2000);
      return () => clearInterval(interval);
    } else {
      setThinkingIndex(0);
    }
  }, [isWaiting]);


  const quickQuestionsTopics = {
    [t('ai.topics.landingPages')]: [
      t('ai.quickQuestions.landingPages.convert'),
      t('ai.quickQuestions.landingPages.leads'),
      t('ai.quickQuestions.landingPages.forms'),
      t('ai.quickQuestions.landingPages.testing')
    ],
    [t('ai.topics.automation')]: [
      t('ai.quickQuestions.automation.social'),
      t('ai.quickQuestions.automation.email'),
      t('ai.quickQuestions.automation.flows'),
      t('ai.quickQuestions.automation.integration')
    ],
    [t('ai.topics.crm')]: [
      t('ai.quickQuestions.crm.organize'),
      t('ai.quickQuestions.crm.segments'),
      t('ai.quickQuestions.crm.qualification'),
      t('ai.quickQuestions.crm.contacts')
    ],
    [t('ai.topics.chatbot')]: [
      t('ai.quickQuestions.chatbot.train'),
      t('ai.quickQuestions.chatbot.integration'),
      t('ai.quickQuestions.chatbot.conversion'),
      t('ai.quickQuestions.chatbot.personalization')
    ],
    [t('ai.topics.funnel')]: [
      t('ai.quickQuestions.funnel.journey'),
      t('ai.quickQuestions.funnel.optimization'),
      t('ai.quickQuestions.funnel.analysis'),
      t('ai.quickQuestions.funnel.retention')
    ],
    [t('ai.topics.salesPages')]: [
      t('ai.quickQuestions.salesPages.persuasive'),
      t('ai.quickQuestions.salesPages.checkout'),
      t('ai.quickQuestions.salesPages.conversion'),
      t('ai.quickQuestions.salesPages.testing')
    ],
    [t('ai.topics.ads')]: [
      t('ai.quickQuestions.ads.manage'),
      t('ai.quickQuestions.ads.roi'),
      t('ai.quickQuestions.ads.audience'),
      t('ai.quickQuestions.ads.performance')
    ]
  };

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const handleTopicClick = (topic: string) => {
    setOpenDropdown(topic);
  };

  const handleQuestionClick = (question: string) => {
    setInputValue(question);
    setOpenDropdown(null);

  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.quick-questions-container')) {
        setOpenDropdown(null);
      }
    };

    if (openDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdown]);

    // Verificar se os props necessários estão presentes
  if (!activeCompany) {
    console.log('activeCompany não encontrado');
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#fafbfc'
      }}>
        <Typography>Carregando... activeCompany: {JSON.stringify(activeCompany)}</Typography>
      </Box>
    );
  }

  console.log('Renderizando componente com activeCompany:', activeCompany);

    return (
    <>
      <style>
        {`
          .ai-chat-active .sidebar,
          .ai-chat-active [data-testid="sidebar"],
          .ai-chat-active .bottom-bar,
          .ai-chat-active [data-testid="bottom-bar"],
        `}
      </style>
      <ChatContainer sx={{ margin: 0, padding: 0 }}>
      {/* Header Minimalista */}
      <Box sx={{
        padding: theme.spacing(1.5, 2),
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        borderBottom: '1px solid #e8eaed',
        backgroundColor: '#ffffff',
        width: '100%',
        [theme.breakpoints.up('lg')]: {
          padding: theme.spacing(2, 3),
          gap: 2
        },
        [theme.breakpoints.between('md', 'lg')]: {
          padding: theme.spacing(1.5, 2.5),
          gap: 1.5
        },
        [theme.breakpoints.between('sm', 'md')]: {
          padding: theme.spacing(1.25, 2),
          gap: 1.25
        },
        [theme.breakpoints.down('sm')]: {
          padding: theme.spacing(1, 1.5),
          gap: 1
        }
      }}>
        <IconButton
          onClick={() => setModule('')}
          sx={{
            color: '#6c757d',
            '&:hover': {
              backgroundColor: 'rgba(108, 117, 125, 0.1)'
            }
          }}
        >
          <ArrowBackIos />
        </IconButton>
        <Typography variant="h5" sx={{
          color: '#2c3e50',
          fontWeight: 300,
          fontSize: '1rem',
          [theme.breakpoints.down('md')]: {
            fontSize: '0.9rem'
          }
        }}>
          {t('ai.brand')}
        </Typography>

        <Box sx={{ marginLeft: 'auto' }}>
          <Tooltip title={t('ai.settings.title')}>
            <IconButton
              onClick={() => setSettingsModal({ open: true })}
              sx={{
                color: '#6c757d',
                marginLeft:'-80px',
                '&:hover': {
                  backgroundColor: 'rgba(108, 117, 125, 0.1)'
                }
              }}
            >
              <Settings />
            </IconButton>
          </Tooltip>
        </Box>

      </Box>

      {/* Loading Screen */}
      {isLoadingHistory ? (
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          width: '100%',
          background: '#fafbfc'
        }}>
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
            maxWidth: '400px',
            textAlign: 'center'
          }}>
            <Box sx={{
              position: 'relative',
              width: '80px',
              height: '80px'
            }}>
              <CircularProgress
                size={80}
                thickness={4}
                sx={{
                  color: '#4674af',
                  '& .MuiCircularProgress-circle': {
                    strokeLinecap: 'round',
                  }
                }}
              />
              <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #4674af, #1E3A8A)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(70, 116, 175, 0.3)'
              }}>
                <RocketLaunch sx={{ color: '#fff', fontSize: '1.5rem' }} />
              </Box>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="h5" sx={{
                fontWeight: 600,
                color: '#2c3e50',
                fontSize: { xs: '1.2rem', sm: '1.4rem' }
              }}>
                {t('ai.loading.title')}
              </Typography>
              <Typography variant="body2" sx={{
                color: '#6c757d',
                fontSize: { xs: '0.9rem', sm: '1rem' }
              }}>
                {t('ai.loading.subtitle')}
              </Typography>
            </Box>

            <Box sx={{
              display: 'flex',
              gap: 1,
              alignItems: 'center'
            }}>
              <Box sx={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#4674af',
                animation: 'pulse 1.5s ease-in-out infinite'
              }} />
              <Box sx={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#4674af',
                animation: 'pulse 1.5s ease-in-out infinite 0.2s'
              }} />
              <Box sx={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#4674af',
                animation: 'pulse 1.5s ease-in-out infinite 0.4s'
              }} />
            </Box>
          </Box>

          <style>
            {`
              @keyframes pulse {
                0%, 100% { opacity: 0.4; transform: scale(1); }
                50% { opacity: 1; transform: scale(1.2); }
              }
            `}
          </style>
        </Box>
      ) : chat.messages.length === 0 ? (
        <>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          width: '100%',
          maxWidth: '100%',
          padding: theme.spacing(1),
          [theme.breakpoints.up('lg')]: {
            padding: theme.spacing(2),
          },
          [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(0.5, 1),
            width:'85%'
          }
        }}>
          <Box sx={{ mb: 3 }}>
            <PremiumChip>
              <Typography variant="body2" sx={{
                color: '#5f6368',
                fontWeight: 500,
                fontSize: '0.875rem'
              }}>
                {t('ai.premium.freePlan')}
              </Typography>
              <Separator />
              <Typography variant="body2" sx={{
                color: '#4674af',
                fontWeight: 600,
                fontSize: '0.875rem',
                cursor: 'pointer',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}>
                {t('ai.premium.upgrade')}
              </Typography>
            </PremiumChip>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
            <RocketLaunch sx={{
              fontSize: { xs: '1.3rem', sm: '1.8rem', md: '2.2rem', lg: '2.5rem' },
              color: '#4674af',
              mr: { xs: 1, sm: 1.5, md: 2 }
            }} />
                      <Typography variant="h4" sx={{
            fontWeight: 700,
            color: '#2c3e50',
            fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.6rem', lg: '2rem' },
            textAlign: 'center'
          }}>
            {t('ai.title')}
          </Typography>
          </Box>

          <Typography variant="body1" sx={{
            color: '#6c757d',
            mb: 4,
            maxWidth: '500px',
            lineHeight: 1.6,
            textAlign: 'center',
            fontSize: { xs: '0.85rem', sm: '0.9rem', md: '1rem' },
            px: { xs: 2, sm: 1, md: 0 },
            [theme.breakpoints.up('lg')]: {
              maxWidth: '600px'
            },
            [theme.breakpoints.down('sm')]: {
              maxWidth: '100%',
              px: 3
            }
          }}>
            {t('ai.description')}
          </Typography>
          <Box sx={{
            background: '#ffffff',
            borderRadius: theme.spacing(1.5),
            padding: theme.spacing(2),
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            width: '100%',
            maxWidth: '600px',
            marginTop: theme.spacing(2),
            [theme.breakpoints.up('lg')]: {
              maxWidth: '700px',
              padding: theme.spacing(2.5)
            },
            [theme.breakpoints.between('md', 'lg')]: {
              maxWidth: '650px',
              padding: theme.spacing(2)
            },
            [theme.breakpoints.between('sm', 'md')]: {
              maxWidth: '600px',
              padding: theme.spacing(1.5),
              borderRadius: theme.spacing(1),
              marginTop: theme.spacing(1.5),
            },
            [theme.breakpoints.down('sm')]: {
              maxWidth: '100%',
              padding: theme.spacing(1.5),
              borderRadius: theme.spacing(1),
              marginTop: theme.spacing(1),
              marginLeft: theme.spacing(3),
              marginRight: theme.spacing(3)
            }
          }}>
            {selectedFile && (
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 2,
                p: 1.5,
                borderRadius: 2,
                backgroundColor: 'rgba(70, 116, 175, 0.1)',
                border: '1px solid rgba(70, 116, 175, 0.2)'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <InsertDriveFile sx={{ color: '#4674af' }} />
                  <Typography variant="body2" sx={{ fontWeight: 500, color: '#2c3e50' }}>
                    {fileName}
                  </Typography>
                </Box>
                <IconButton size="small" onClick={handleRemoveSelectedFile}>
                  <Close sx={{ fontSize: '1rem', color: '#4674af' }} />
                </IconButton>
              </Box>
            )}
            <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder={t('ai.input.placeholder')}
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  outline: 'none',
                  fontSize: '1rem',
                  fontFamily: 'inherit',
                  resize: 'none',
                  padding: '16px 60px 16px 50px',
                  marginTop: theme.spacing(-2),
                  backgroundColor: 'transparent',
                  [theme.breakpoints.up('lg')]: {
                    fontSize: '1.1rem',
                    padding: '18px 65px 18px 55px'
                  },
                  [theme.breakpoints.between('md', 'lg')]: {
                    fontSize: '1rem',
                    padding: '16px 60px 16px 50px'
                  },
                  [theme.breakpoints.between('sm', 'md')]: {
                    fontSize: '0.95rem',
                    padding: '14px 55px 14px 45px'
                  },
                  [theme.breakpoints.down('sm')]: {
                    fontSize: '0.9rem',
                    padding: '12px 50px 12px 40px'
                  }
                }}
              />
              <Box sx={{ position: 'absolute', left: -8, top: '50%', transform: 'translateY(-50%)' }}>
                <label htmlFor="file-upload">
                  <Tooltip title={t('ai.input.attachFile')} arrow>
                    <IconButton component="span" sx={{
                      color: '#4674af',
                      '&:hover': {
                        backgroundColor: 'rgba(70, 116, 175, 0.1)'
                      }
                    }}>
                      <AttachFile />
                    </IconButton>
                  </Tooltip>
                </label>
              </Box>

              {/* Botão Enviar */}
              <Box sx={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)' }}>
                <IconButton
                  onClick={handleSend}
                  disabled={!inputValue.trim() && !selectedFile}
                  sx={{
                    backgroundColor: '#4674af',
                    color: '#fff',
                    width: 40,
                    height: 40,
                    '&:hover': {
                      backgroundColor: '#3a5f9a'
                    },
                    '&.Mui-disabled': {
                      backgroundColor: '#e8eaed',
                      color: '#9aa0a6'
                    }
                  }}
                >
                  <Send sx={{ fontSize: '1.2rem' }} />
                </IconButton>
              </Box>
            </Box>
          </Box>
          <QuickQuestionsContainer className="quick-questions-container">
            <Box sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: theme.spacing(1),
              position: 'relative',
              padding: theme.spacing(2),
              justifyContent: 'center',
              [theme.breakpoints.up('lg')]: {
                gap: theme.spacing(1.5),
                padding: theme.spacing(2.5)
              },
              [theme.breakpoints.between('md', 'lg')]: {
                gap: theme.spacing(1.25),
                padding: theme.spacing(2)
              },
              [theme.breakpoints.between('sm', 'md')]: {
                gap: theme.spacing(1),
                padding: theme.spacing(1.5),
                flexDirection: 'row',
              },
              [theme.breakpoints.down('sm')]: {
                gap: theme.spacing(0.75),
                padding: theme.spacing(1.5),
                flexDirection: 'row',
                justifyContent: 'center',
                marginLeft:'-50px',
              }
            }}>
              <Box sx={{ position: 'relative' }}>
                <StartHereChip
                  icon={<Brain size={16} color="#ffffff" />}
                  label="Comece Aqui"
                  onClick={() => handleTopicClick("Comece Aqui")}
                  variant="outlined"
                />
                {openDropdown === "Comece Aqui" && (
                  <DropdownContainer>
                    {[
                      "Como usar o assistente de IA?",
                      "Primeiros passos no marketing digital",
                      "Configuração inicial do sistema",
                      "Dicas para começar hoje"
                    ].map((question, index) => (
                      <DropdownItem
                        key={index}
                        onClick={() => handleQuestionClick(question)}
                      >
                        <Typography variant="body1" sx={{
                          color: '#2c3e50',
                          fontSize: '0.95rem',
                          lineHeight: 1.5,
                          fontWeight: 500
                        }}>
                          {question}
                        </Typography>
                      </DropdownItem>
                    ))}
                  </DropdownContainer>
                )}
              </Box>
              {Object.keys(quickQuestionsTopics).map((topic) => (
                <Box key={topic} sx={{ position: 'relative' }}>
                  <TopicChip
                    icon={
                      topic === "Landing Pages" ? <Layout size={16} color="#ffffff" /> :
                      topic === "Automação" ? <Zap size={16} color="#ffffff" /> :
                      topic === "CRM" ? <Users size={16} color="#ffffff" /> :
                      topic === "Chatbot" ? <MessageSquare size={16} color="#ffffff" /> :
                      topic === "Funil" ? <FileText size={16} color="#ffffff" /> :
                      topic === "Sales Pages" ? <Coins size={16} color="#ffffff" /> :
                      topic === "Anúncios" ? <AdsClickOutlined sx={{ fontSize: '1rem', color: '#ffffff' }} /> :
                      <Brain size={16} color="#ffffff" />
                    }
                    label={topic}
                    onClick={() => handleTopicClick(topic)}
                    variant="outlined"
                  />
                  {openDropdown === topic && (
                    <DropdownContainer>
                      {quickQuestionsTopics[topic].map((question, index) => (
                        <DropdownItem
                          key={index}
                          onClick={() => handleQuestionClick(question)}
                        >
                          <Typography variant="body1" sx={{
                            color: '#2c3e50',
                            fontSize: '0.95rem',
                            lineHeight: 1.5,
                            fontWeight: 500
                          }}>
                            {question}
                          </Typography>
                        </DropdownItem>
                      ))}
                    </DropdownContainer>
                  )}
                </Box>
              ))}
            </Box>
          </QuickQuestionsContainer>
        </Box>
        </>
      ) : (
        <>
          <ChatArea>
            <MessagesContainer ref={chatContainerRef}>
              {chat.messages.map((msg) => (
                <Fade in key={msg.id}>
                  <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    gap: 2,
                    mb: 3,
                    justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                    width: '100%',
                    overflow: 'hidden'
                  }}>
                    {msg.sender === 'assistant' && (
                      <Avatar
                        sx={{
                          width: 36,
                          height: 36,
                          bgcolor: '#4674af',
                          color: '#fff',
                          fontSize: '0.9rem',
                          [theme.breakpoints.down('sm')]: {
                            display: 'none'
                          }
                        }}
                      >
                        <RocketLaunch sx={{ fontSize: '1rem' }} />
                      </Avatar>
                    )}
                    <Box sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                      maxWidth: '100%',
                      overflow: 'hidden'
                    }}>
                      <MessageBubble isUser={msg.sender === 'user'}>
                        {renderMessageContent(msg)}
                      </MessageBubble>
                      {msg.sender === 'assistant' && (
                        <Box sx={{
                          display: 'flex',
                          gap: 1,
                          mt: 1,
                          ml: 1,
                          opacity: 0.7,
                          transition: 'opacity 0.2s ease',
                          '&:hover': {
                            opacity: 1
                          }
                        }}>
                          <Tooltip title={t('ai.feedback.thumbsUp')} arrow>
                            <IconButton
                              size="small"
                              onClick={() => handleThumbsUp(msg.id)}
                              sx={{
                                color: messageFeedback[msg.id]?.thumbsUp ? '#003f92' : '#6c757d',
                                '&:hover': {
                                  color: '#4674af'
                                }
                              }}
                            >
                              <ThumbUp sx={{ fontSize: '1rem' }} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={t('ai.feedback.thumbsDown')} arrow>
                            <IconButton
                              size="small"
                              onClick={() => handleThumbsDown(msg.id)}
                              sx={{
                                color: messageFeedback[msg.id]?.thumbsDown ? '#003f92' : '#6c757d',
                                '&:hover': {
                                  color: '#4674af'
                                }
                              }}
                            >
                              <ThumbDown sx={{ fontSize: '1rem' }} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={t('ai.feedback.copy')} arrow>
                            <IconButton
                              size="small"
                              onClick={() => handleCopyContent(msg.content)}
                              sx={{
                                color: '#6c757d',
                                '&:hover': {
                                  color: '#4674af'
                                }
                              }}
                            >
                              <ContentCopy sx={{ fontSize: '1rem' }} />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      )}
                    </Box>
                    {msg.sender === 'user' && (
                      <Avatar
                        sx={{
                          width: 36,
                          height: 36,
                          bgcolor: '#e8eaed',
                          color: '#4674af',
                          fontSize: '0.9rem',
                          [theme.breakpoints.down('sm')]: {
                            display: 'none'
                          }
                        }}
                      >
                        <Person sx={{ fontSize: '1rem' }} />
                      </Avatar>
                    )}
                  </Box>
                </Fade>
              ))}

              {isWaiting && (
                <Fade in>
                  <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    gap: 2,
                    mb: 3
                  }}>
                    <Avatar
                      sx={{
                        width: 36,
                        height: 36,
                        bgcolor: '#4674af',
                        color: '#fff',
                        [theme.breakpoints.down('sm')]: {
                          display: 'none'
                        }
                      }}
                    >
                      <RocketLaunch sx={{ fontSize: '1rem' }} />
                    </Avatar>
                    <MessageBubble isUser={false}>
                      <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        minHeight: '24px'
                      }}>
                        <Typography
                          variant="body2"
                          sx={{
                            color: '#ffffff',
                            fontWeight: 500,
                            position: 'relative',
                            overflow: 'hidden',
                            '&::before': {
                              content: '""',
                              position: 'absolute',
                              top: 0,
                              left: '-100%',
                              width: '100%',
                              height: '100%',
                              background: 'linear-gradient(90deg, transparent, rgba(0, 168, 255, 0.3), transparent)',
                              animation: 'sidebarReflective 2s ease-in-out infinite',
                              '@keyframes sidebarReflective': {
                                '0%': { left: '-100%' },
                                '100%': { left: '100%' }
                              }
                            }
                          }}
                        >
                          {thinkingPhrases[thinkingIndex]}
                        </Typography>
                      </Box>
                    </MessageBubble>
                  </Box>
                </Fade>
              )}
            </MessagesContainer>
          </ChatArea>

          {/* Input Area */}
          <InputContainer>
            {selectedFile && (
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 2,
                p: 1.5,
                borderRadius: 2,
                backgroundColor: 'rgba(70, 116, 175, 0.1)',
                border: '1px solid rgba(70, 116, 175, 0.2)'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <InsertDriveFile sx={{ color: '#4674af' }} />
                  <Typography variant="body2" sx={{ fontWeight: 500, color: '#2c3e50' }}>
                    {fileName}
                  </Typography>
                </Box>
                <IconButton size="small" onClick={handleRemoveSelectedFile}>
                  <Close sx={{ fontSize: '1rem', color: '#4674af' }} />
                </IconButton>
              </Box>
            )}

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: '100%' }}>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: 'none' }}
                id="file-upload"
              />
              <label htmlFor="file-upload">
                <Tooltip title="Anexar arquivo" arrow>
                  <IconButton component="span" sx={{
                    color: '#4674af',
                    '&:hover': {
                      backgroundColor: 'rgba(70, 116, 175, 0.1)'
                    }
                  }}>
                    <AttachFile />
                  </IconButton>
                </Tooltip>
              </label>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Digite sua mensagem..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') handleSend();
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: '#ffffff',
                    '& fieldset': {
                      borderColor: '#e8eaed'
                    },
                    '&:hover fieldset': {
                      borderColor: '#4674af'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#4674af'
                    },
                    '& input': {
                      color: '#2c3e50',
                      '&::placeholder': {
                        color: '#9aa0a6',
                        opacity: 1
                      }
                    }
                  }
                }}
              />

              <Tooltip title="Enviar mensagem" arrow>
                <SendButton
                  disabled={(!inputValue && !selectedFile) || isWaiting}
                  onClick={handleSend}
                >
                  <Send sx={{ fontSize: '1.1rem' }} />
                </SendButton>
              </Tooltip>
            </Box>
          </InputContainer>
        </>
      )}

      {/* Modal para visualização ampliada da imagem */}
      <Dialog
        open={imageModal.open}
        onClose={closeImageModal}
        maxWidth="lg"
        fullWidth
        TransitionComponent={Zoom}
        PaperProps={{
          sx: {
            overflow: 'hidden',
            backgroundColor: 'transparent',
            boxShadow: 'none',
            [theme.breakpoints.down('md')]: {
              margin: theme.spacing(1)
            }
          }
        }}
      >
        <DialogContent sx={{
          p: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.8)'
        }}>
          <Box
            component="img"
            src={imageModal.src}
            alt="Imagem ampliada"
            sx={{
              maxWidth: '100%',
              maxHeight: '80vh',
              transform: `scale(${imageModal.zoom})`,
              transition: 'transform 0.3s ease',
              cursor: 'zoom-in'
            }}
            onClick={zoomIn}
          />
        </DialogContent>
        <DialogActions sx={{
          position: 'absolute',
          bottom: 16,
          right: 16,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          borderRadius: '24px'
        }}>
          <Tooltip title="Zoom Out" arrow>
            <IconButton onClick={zoomOut} color="inherit" sx={{ color: '#fff' }}>
              <ZoomOut />
            </IconButton>
          </Tooltip>
          <Tooltip title="Zoom In" arrow>
            <IconButton onClick={zoomIn} color="inherit" sx={{ color: '#fff' }}>
              <ZoomIn />
            </IconButton>
          </Tooltip>
          <Tooltip title="Download" arrow>
            <IconButton
              onClick={() => handleDownloadImage(imageModal.src)}
              color="inherit"
              sx={{ color: '#fff' }}
            >
              <Download />
            </IconButton>
          </Tooltip>
          <Tooltip title="Fechar" arrow>
            <IconButton onClick={closeImageModal} color="inherit" sx={{ color: '#fff' }}>
              <Close />
            </IconButton>
          </Tooltip>
        </DialogActions>
      </Dialog>

      {/* Alert para copy */}
      {showCopyAlert && (
        <Box
          sx={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            backgroundColor: '#4674af',
            color: '#fff',
            padding: '12px 20px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            animation: 'slideIn 0.3s ease-out',
            '@keyframes slideIn': {
              '0%': {
                transform: 'translateX(100%)',
                opacity: 0
              },
              '100%': {
                transform: 'translateX(0)',
                opacity: 1
              }
            }
          }}
        >
          <ContentCopy sx={{ fontSize: '1rem' }} />
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {t('ai.feedback.copied')}
          </Typography>
        </Box>
      )}

      {/* Alert para configurações salvas */}
      {showSettingsAlert && (
        <Box
          sx={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            backgroundColor: '#28a745',
            color: '#fff',
            padding: '12px 20px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            animation: 'slideIn 0.3s ease-out',
            '@keyframes slideIn': {
              '0%': {
                transform: 'translateX(100%)',
                opacity: 0
              },
              '100%': {
                transform: 'translateX(0)',
                opacity: 1
              }
            }
          }}
        >
          <Settings sx={{ fontSize: '1rem' }} />
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {t('ai.settings.success')}
          </Typography>
        </Box>
      )}

            {/* Modal de Configurações da IA */}
      <Dialog
        open={settingsModal.open}
        onClose={handleCloseSettings}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            maxHeight: '80vh',
            [theme.breakpoints.down('md')]: {
              margin: theme.spacing(1),
              maxHeight: '90vh'
            }
          }
        }}
      >
        <DialogContent sx={{
          p: 2.5,
          [theme.breakpoints.down('md')]: {
            p: 1.5
          }
        }}>
          {/* Instruções Personalizadas */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 1.5, color: '#2c3e50', fontWeight: 500 }}>
              {t('ai.settings.instructions.title')}
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              placeholder={t('ai.settings.instructions.placeholder')}
              value={aiInstructions}
              onChange={(e) => setAiInstructions(e.target.value)}
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5
                }
              }}
            />
          </Box>

                    {/* Upload de Arquivos */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 1.5, color: '#2c3e50', fontWeight: 500 }}>
              {t('ai.settings.files.title')}
            </Typography>

            <input
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.txt,image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  const files = Array.from(e.target.files);
                  files.forEach(file => {
                    if (file.type.startsWith('image/')) {
                      setUploadedImages(prev => [...prev, file]);
                    } else {
                      setUploadedFiles(prev => [...prev, file]);
                    }
                  });
                }
              }}
              style={{ display: 'none' }}
              id="settings-file-upload"
            />
            <label htmlFor="settings-file-upload">
              <Button
                variant="outlined"
                component="span"
                size="small"
                startIcon={<Upload />}
                sx={{
                  borderColor: '#4674af',
                  color: '#4674af',
                  fontSize: '0.8rem',
                  '&:hover': {
                    borderColor: '#1E3A8A',
                    backgroundColor: 'rgba(70, 116, 175, 0.1)'
                  }
                }}
              >
                {t('ai.settings.files.button')}
              </Button>
            </label>

            {/* Lista de arquivos */}
            {(uploadedFiles.length > 0 || uploadedImages.length > 0) && (
              <Box sx={{ maxHeight: '150px', overflowY: 'auto' }}>
                {uploadedFiles.map((file, index) => (
                  <Box
                    key={`doc-${index}`}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      p: 1,
                      mb: 0.5,
                      backgroundColor: '#f8f9fa',
                      borderRadius: 1,
                      fontSize: '0.8rem'
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, minWidth: 0 }}>
                      <Description sx={{ color: '#4674af', fontSize: '1rem' }} />
                      <Typography variant="body2" sx={{ color: '#2c3e50', fontSize: '0.8rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {file.name}
                      </Typography>
                    </Box>
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveUploadedFile(index, 'document')}
                      sx={{ color: '#dc3545', p: 0.5 }}
                    >
                      <Close sx={{ fontSize: '0.9rem' }} />
                    </IconButton>
                  </Box>
                ))}
                {uploadedImages.map((file, index) => (
                  <Box
                    key={`img-${index}`}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      p: 1,
                      mb: 0.5,
                      backgroundColor: '#f8f9fa',
                      borderRadius: 1,
                      fontSize: '0.8rem'
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, minWidth: 0 }}>
                      <Image sx={{ color: '#4674af', fontSize: '1rem' }} />
                      <Typography variant="body2" sx={{ color: '#2c3e50', fontSize: '0.8rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {file.name}
                      </Typography>
                    </Box>
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveUploadedFile(index, 'image')}
                      sx={{ color: '#dc3545', p: 0.5 }}
                    >
                      <Close sx={{ fontSize: '0.9rem' }} />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={handleCloseSettings}
            variant="text"
            size="small"
            sx={{ color: '#6c757d' }}
          >
            {t('ai.settings.actions.cancel')}
          </Button>
          <Button
            onClick={handleSaveSettings}
            variant="contained"
            size="small"
            disabled={isSavingSettings}
            sx={{
              backgroundColor: '#4674af',
              '&:hover': {
                backgroundColor: '#1E3A8A'
              },
              '&:disabled': {
                backgroundColor: '#e8eaed',
                color: '#9aa0a6'
              }
            }}
          >
            {isSavingSettings ? (
              <>
                <CircularProgress size={16} sx={{ mr: 1, color: '#fff' }} />
                {t('ai.settings.actions.saving')}
              </>
            ) : (
              t('ai.settings.actions.save')
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </ChatContainer>
    </>
  );
}