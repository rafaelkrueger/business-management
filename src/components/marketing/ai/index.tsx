import React, { useEffect, useState, useRef } from 'react';
import {
  Box,
  Typography,
  Chip,
  Grid,
  Container,
  Paper,
  useTheme,
  TextField,
  Button,
  Fade,
  Grow,
  Skeleton,
  Avatar,
  Divider,
  IconButton,
  Badge,
  Tooltip,
  FormControl,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogActions,
  Zoom
} from '@mui/material';
import {
  SmartToy,
  Send,
  HelpOutline,
  TrendingUp,
  Campaign,
  Star,
  ChevronRight,
  ArrowBackIos,
  AutoAwesome,
  Person,
  AttachFile,
  InsertDriveFile,
  Close,
  Check,
  Lock,
  Email,
  PersonPinCircleRounded,
  WebStoriesRounded,
  ZoomIn,
  ZoomOut,
  Download
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import ChatAiService from '../../../services/chat-ai.service.ts';
import { AllInOneApi } from '../../../Api.ts';
import { styled, alpha } from '@mui/material/styles';
import { IoIosPaper, IoMdPaper } from 'react-icons/io';
import ProgressService from '../../../services/progress.service.ts';

const ModuleTimeline = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  margin: theme.spacing(3, 0),
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: theme.spacing(2),
    right: theme.spacing(2),
    height: 2,
    background: alpha(theme.palette.primary.main, 0.2),
    zIndex: 0
  }
}));

const ModuleStep = styled(Box)(({ theme, completed, active, loading }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  zIndex: 1,
  cursor: loading ? 'default' : 'pointer',
  transition: 'all 0.3s ease',
  '& .step-icon': {
    width: 40,
    height: 40,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: completed
      ? theme.palette.success.main
      : active
        ? theme.palette.primary.main
        : loading
          ? theme.palette.primary.light
          : theme.palette.action.disabledBackground,
    color: completed || active || loading ? '#fff' : theme.palette.text.secondary,
    marginBottom: theme.spacing(1),
    boxShadow: active
      ? `0 0 0 4px ${alpha(theme.palette.primary.main, 0.2)}`
      : loading
        ? `0 0 0 4px ${alpha(theme.palette.primary.main, 0.4)}`
        : 'none',
    position: 'relative',
    '&::after': loading ? {
      content: '""',
      position: 'absolute',
      top: -4,
      left: -4,
      right: -4,
      bottom: -4,
      borderRadius: '50%',
      border: `2px solid ${theme.palette.primary.main}`,
      animation: 'pulse 1.5s infinite',
      '@keyframes pulse': {
        '0%': { opacity: 0.6 },
        '50%': { opacity: 0.2 },
        '100%': { opacity: 0.6 }
      }
    } : {}
  },
  '& .step-label': {
    fontSize: '0.75rem',
    fontWeight: 500,
    color: active
      ? theme.palette.primary.main
      : loading
        ? theme.palette.primary.light
        : theme.palette.text.secondary,
    textAlign: 'center'
  },
  '&:hover': {
    '& .step-icon': {
      transform: loading ? 'scale(1)' : 'scale(1.1)'
    }
  }
}));

const modulesTimeline = [
  { id: 'general', label: 'Geral', icon: <SmartToy style={{color:'#fff'}} size={20} /> },
  { id: 'socialMedia', label: 'Social Media', icon: <PersonPinCircleRounded style={{color:'#fff'}} size={20} /> },
  { id: 'forms', label: 'Forms', icon: <IoIosPaper style={{color:'#fff'}} size={20} /> },
  { id: 'email', label: 'Email', icon: <Email style={{color:'#fff'}} size={20} /> },
  // { id: 'salesPage', label: 'Sales Page', icon: <WebStoriesRounded style={{color:'#fff'}} size={20} /> },
];

const ImageContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  margin: theme.spacing(1, 0),
  borderRadius: '12px',
  overflow: 'hidden',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease',
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  cursor: 'pointer',
  '&:hover': {
    transform: 'scale(1.02)',
    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)',
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
    transition: 'opacity 0.3s ease',
    '& .action-button': {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      color: '#fff',
      borderRadius: '50%',
      padding: '4px',
      '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.7)'
      }
    }
  }
}));

export default function PremiumMarketingAssistant({activeCompany, setModule}) {
  const theme = useTheme();
  const { i18n, t } = useTranslation();
  const [inputValue, setInputValue] = useState('');
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [waitingModules, setWaitingModules] = useState<Record<string, boolean>>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loadingModules, setLoadingModules] = useState<string[]>([]);
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeChat, setActiveChat] = useState('general');
  const [chats, setChats] = useState({
    general: {
      conversationId: null,
      messages: []
    },
    socialMedia: {
      conversationId: null,
      messages: []
    },
    forms: {
      conversationId: null,
      messages: []
    },
    email: {
      conversationId: null,
      messages: []
    },
    // salesPage: {
    //   conversationId: null,
    //   messages: []
    // }
  });
  const [completedModules, setCompletedModules] = useState([]);
  const [enabledFeatures, setEnabledFeatures] = useState<string[]>([]);
  const [loadingFeatures, setLoadingFeatures] = useState(true);
  const refreshIntervalRef = useRef<NodeJS.Timeout>();
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const [imageModal, setImageModal] = useState({
    open: false,
    src: '',
    zoom: 1
  });

  const isModuleUnlocked = (moduleId) => {
    if (moduleId === 'general') return true;

    const featureMap = {
      'socialMedia': 'socialMedia',
      'forms': 'forms',
      'email': 'email',
      // 'salesPage': 'salesPage'
    };

    return enabledFeatures.includes(featureMap[moduleId]);
  };

  const welcomeMessage = {
    id: 'welcome',
    sender: 'assistant',
    content: t("marketing.aiAssistant.welcomeMessage"),
    timestamp: new Date()
  };

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [waitingModules]);

  useEffect(() => {
    const el = document.querySelector("#main-content");
    if (el) {
      el.style.overflow = "hidden";
      el.scrollTop = 0;
    }
    window.scrollTo(0, 0);

    return () => {
      if (el) {
        el.style.overflow = "";
      }
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 100);

    return () => clearTimeout(timer);
  }, [activeChat, waitingModules]);

  const fetchEnabledFeatures = async () => {
    try {
      const res = await ProgressService.getProgress(activeCompany);
      console.log(res.data);

      const loadingMods = [];
      for (const [key, value] of Object.entries(res.data)) {
        if (value === 'loading') {
          loadingMods.push(key);
        }
      }
      setLoadingModules(loadingMods);

      const response = await ChatAiService.getEnabledFeatures(activeCompany);
      const features = response.data.map(f => f.field);
      setEnabledFeatures(features);
    } catch (error) {
      console.error('Error loading enabled features:', error);
    } finally {
      setLoadingFeatures(false);
    }
  };

  useEffect(() => {
    fetchEnabledFeatures();
    refreshIntervalRef.current = setInterval(fetchEnabledFeatures, 5000);

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [activeCompany]);

  useEffect(() => {
    const initChat = async () => {
      if (!isModuleUnlocked(activeChat)) return;

      try {
        const pastMessages = await ChatAiService.getConversationByType(activeCompany, activeChat);
        const formattedMessages = pastMessages.map((msg) => ({
          id: msg.id,
          sender: msg.sender,
          content: msg.message,
          timestamp: msg.createdAt,
        }));

        setChats(prev => ({
          ...prev,
          [activeChat]: {
            ...prev[activeChat],
            conversationId: crypto.randomUUID(),
            messages: formattedMessages.length > 0 ? formattedMessages : [welcomeMessage]
          }
        }));
      } catch (error) {
        console.error('Erro ao carregar conversa:', error);
      }
    };

    if (!loadingFeatures) {
      initChat();
    }
  }, [activeChat, loadingFeatures, enabledFeatures]);

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
    link.download = `marketing-assistant-${new Date().toISOString().slice(0, 10)}.png`;
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

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSend = async () => {
    const currentChat = chats[activeChat];
    if (!currentChat.conversationId || (!selectedCard && !inputValue.trim() && !selectedFile) || waitingModules[activeChat]) return;

    const content = selectedCard || inputValue.trim();
    setInputValue('');
    setSelectedCard(null);

    const userMessage = {
      id: crypto.randomUUID(),
      sender: 'user',
      content: content || fileName,
      isFile: !!selectedFile,
      fileName: selectedFile?.name,
      fileType: selectedFile?.type,
      timestamp: new Date()
    };

    const updatedMessages = [...currentChat.messages, userMessage];

    setChats(prev => ({
      ...prev,
      [activeChat]: {
        ...prev[activeChat],
        messages: updatedMessages
      }
    }));

    setWaitingModules(prev => ({ ...prev, [activeChat]: true }));

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
          currentChat.conversationId,
          content || `Arquivo: ${fileName}`,
          activeCompany,
          language,
          activeChat,
          response?.data.url
        );
      } else {
        responseMessages = await ChatAiService.sendMessage(
          currentChat.conversationId,
          content,
          activeCompany,
          language,
          activeChat
        );
      }

      setChats(prev => ({
        ...prev,
        [activeChat]: {
          ...prev[activeChat],
          messages: responseMessages
        }
      }));

      handleRemoveFile();

      if (!completedModules.includes(activeChat)) {
        setCompletedModules([...completedModules, activeChat]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setChats(prev => ({
        ...prev,
        [activeChat]: {
          ...prev[activeChat],
          messages: [
            ...updatedMessages.filter((m) => m.id !== 'typing'),
            {
              id: crypto.randomUUID(),
              sender: 'assistant',
              content: t("marketing.aiAssistant.errorMessage"),
              timestamp: new Date()
            }
          ]
        }
      }));
    } finally {
      setWaitingModules(prev => ({ ...prev, [activeChat]: false }));
    }
  };

  const handleChatChange = (chatId) => {
    if (!isModuleUnlocked(chatId)) return;
    if (loadingModules.includes(chatId)) {
      const currentChat = chats[activeChat];
      const loadingMessage = {
        id: crypto.randomUUID(),
        sender: 'assistant',
        content: t("marketing.aiAssistant.moduleLoadingMessage"),
        timestamp: new Date()
      };

      setChats(prev => ({
        ...prev,
        [activeChat]: {
          ...prev[activeChat],
          messages: [...prev[activeChat].messages, loadingMessage]
        }
      }));
      return;
    }
    setActiveChat(chatId);
    setInputValue('');
    setSelectedCard(null);
    setSelectedFile(null);
    setFileName('');
  };

  const renderMessageContent = (msg) => {
    if(msg.content.includes('data:image/png;base64')){
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
          <Typography variant="body1" sx={{
            fontWeight: 600,
            mb: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <AutoAwesome sx={{ fontSize: '1.2rem' }} />
            {t("marketing.aiAssistant.welcomeTitle")}
          </Typography>
          <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
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
          gap: 1,
          p: 1,
          borderRadius: 1,
          backgroundColor: msg.sender === 'user'
            ? 'rgba(255, 255, 255, 0.1)'
            : 'rgba(87, 138, 205, 0.1)',
          border: `1px solid ${msg.sender === 'user'
            ? 'rgba(255, 255, 255, 0.2)'
            : 'rgba(87, 138, 205, 0.2)'}`,
          maxWidth: '100%',
          wordBreak: 'break-word'
        }}>
          <InsertDriveFile sx={{
            color: msg.sender === 'user' ? '#fff' : '#578acd',
            fontSize: '1.5rem'
          }} />
          <Typography variant="body2" sx={{
            color: msg.sender === 'user' ? '#fff' : 'text.primary',
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
        lineHeight: 1.6
      }}>
        {msg.content}
      </Typography>
    );
  };

  if (loadingFeatures) {
    return (
      <Container maxWidth="lg" sx={{
        py: 4,
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(160deg, #f8faff 0%, #ffffff 100%)'
      }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress sx={{ color: '#578acd' }} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{
      py: 4,
      height: '110vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(160deg, #f8faff 0%, #ffffff 100%)',
      marginTop: {xs:'-40px', sm:'-50px'},
      overflowY:'hidden'
    }}>
      <Box sx={{
        background: 'linear-gradient(90deg, #578acd 0%, #6a9ce0 100%)',
        borderTopLeftRadius: 7,
        borderTopRightRadius: 7,
        p: 3,
        color: '#fff',
        boxShadow: '0 4px 20px rgba(87, 138, 205, 0.2)',
        display:'flex',
        width:{xs: '85.5%', sm:'92.5%', md:'95.5%'},
        justifyContent:'space-around',
        height:{xs: '30px', sm:'60px'},
      }}>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          mb: 0,
          cursor: 'pointer',
          width: '5%',
          marginTop: {xs:'-30px', sm:'-20px'},
          '&:hover': {
            '& .back-arrow': {
              transform: 'translateX(-3px)'
            }
          }
        }} onClick={() => setModule('')}>
          <ArrowBackIos className="back-arrow" sx={{
            color: '#ffffff',
            transition: 'transform 0.2s ease',
            fontSize: '2rem'
          }} />
        </Box>
        <ModuleTimeline style={{width: '90%', marginTop:window.outerWidth > 600 ? '17px' : '-1px'}}>
          {modulesTimeline.map((step, index) => {
            const isCompleted = completedModules.includes(step.id);
            const isUnlocked = isModuleUnlocked(step.id);
            const isLoading = loadingModules.includes(step.id);

            if (!isUnlocked && !isLoading) {
              return (
                <ModuleStep
                  key={step.id}
                  completed={false}
                  active={false}
                  loading={false}
                  onClick={() => {}}
                >
                  <Box className="step-icon">
                    <Lock size={20} />
                  </Box>
                  <Typography sx={{color:'#fff', fontSize:'9pt', visibility: 'hidden'}}>.</Typography>
                </ModuleStep>
              );
            }

            return (
              <ModuleStep
                key={step.id}
                completed={false}
                active={activeChat === step.id}
                loading={isLoading}
                onClick={() => !isLoading && handleChatChange(step.id)}
              >
                <Box className="step-icon">
                  {step.icon}
                  {isLoading && (
                    <CircularProgress
                      size={48}
                      thickness={2}
                      sx={{
                        position: 'absolute',
                        color: '#fff',
                        top: -4,
                        left: -4
                      }}
                    />
                  )}
                </Box>
                <Typography sx={{
                  color: isLoading ? theme.palette.primary.light : '#fff',
                  fontSize:'9pt'
                }}>
                  {step.label}
                </Typography>
              </ModuleStep>
            );
          })}
        </ModuleTimeline>
      </Box>

      {/* Chat container */}
      <Paper
        elevation={0}
        ref={chatContainerRef}
        sx={{
          flex: 1,
          overflowY: 'auto',
          mb: 2,
          p: 2,
          maxHeight:{xs:'300px', sm:'unset'},
          borderBottomLeftRadius: 3,
          borderBottomRightRadius: 3,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          border: '1px solid rgba(87, 138, 205, 0.1)',
          '&::-webkit-scrollbar': {
            width: '6px'
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(87, 138, 205, 0.3)',
            borderRadius: '3px'
          }
        }}
      >
        {chats[activeChat]?.messages?.map((msg) => (
          <Fade in key={msg.id}>
            <Box sx={{
              mb: 3,
              display: 'flex',
              flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row',
              alignItems: 'flex-start',
              gap: 1.5
            }}>
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: msg.sender === 'user' ? '#578acd' : '#e0e7ff',
                  color: msg.sender === 'user' ? '#fff' : '#578acd',
                  fontSize: '0.9rem',
                  mt: 0.5
                }}
              >
                {msg.sender === 'user' ? (
                  <Person sx={{ fontSize: '1rem' }} />
                ) : (
                  <SmartToy sx={{ fontSize: '1rem' }} />
                )}
              </Avatar>
              <Paper elevation={0} sx={{
                maxWidth: '80%',
                p: 2,
                borderRadius: msg.sender === 'user'
                  ? '18px 4px 18px 18px'
                  : '4px 18px 18px 18px',
                backgroundColor: msg.sender === 'user'
                  ? '#578acd'
                  : '#f0f5ff',
                color: msg.sender === 'user'
                  ? '#fff'
                  : 'text.primary',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                position: 'relative',
                marginTop:'20px',
                '&:before': {
                  content: '""',
                  position: 'absolute',
                  width: 0,
                  height: 0,
                  [msg.sender === 'user' ? 'right' : 'left']: '-8px',
                  top: 0,
                  border: msg.sender === 'user'
                    ? '8px solid #578acd'
                    : '8px solid #f0f5ff',
                  borderColor: msg.sender === 'user'
                    ? '#578acd transparent transparent transparent'
                    : '#f0f5ff transparent transparent transparent'
                }
              }}>
                {renderMessageContent(msg)}
              </Paper>
            </Box>
          </Fade>
        ))}
        {waitingModules[activeChat] && (
          <Fade in>
            <Box sx={{
              mb: 3,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'flex-start',
              gap: 1.5
            }}>
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: '#e0e7ff',
                  color: '#578acd',
                  fontSize: '0.9rem',
                  mt: 0.5
                }}
              >
                <SmartToy sx={{ fontSize: '1rem' }} />
              </Avatar>
              <Paper elevation={0} sx={{
                maxWidth: '80%',
                p: 2,
                borderRadius: '4px 18px 18px 18px',
                backgroundColor: '#f0f5ff',
                color: 'text.primary',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                position: 'relative',
                marginTop: '20px'
              }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {[1, 2, 3].map((dot) => (
                    <Box key={dot} sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: 'rgba(87, 138, 205, 0.4)',
                      animation: 'pulse 1.5s infinite ease-in-out',
                      animationDelay: `${dot * 0.2}s`,
                      '@keyframes pulse': {
                        '0%, 100%': { opacity: 0.4 },
                        '50%': { opacity: 1 }
                      }
                    }} />
                  ))}
                </Box>
              </Paper>
            </Box>
          </Fade>
        )}
      </Paper>

      <Box sx={{
        position: 'sticky',
        width:'100%',
        bottom: 0,
        pb: 2,
        background: 'linear-gradient(to top, rgba(255, 255, 255, 1) 50%, rgba(255, 255, 255, 0) 100%)'
      }}>
        <Paper elevation={3} sx={{
          p: 2,
          borderRadius: 3,
          border: '1px solid rgba(87, 138, 205, 0.2)',
          boxShadow: '0 4px 20px rgba(87, 138, 205, 0.1)',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 6px 24px rgba(87, 138, 205, 0.15)'
          }
        }}>
          {selectedFile && (
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 1,
              p: 1,
              borderRadius: 1,
              backgroundColor: 'rgba(87, 138, 205, 0.1)'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <InsertDriveFile sx={{ color: '#578acd' }} />
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {fileName}
                </Typography>
              </Box>
              <IconButton size="small" onClick={handleRemoveFile}>
                <Close sx={{ fontSize: '1rem', color: '#578acd' }} />
              </IconButton>
            </Box>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width:'100%' }}>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: 'none' }}
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <Tooltip title={t("marketing.aiAssistant.attachFile")} arrow>
                <IconButton component="span" sx={{
                  color: '#578acd',
                  '&:hover': {
                    backgroundColor: 'rgba(87, 138, 205, 0.1)'
                  }
                }}>
                  <AttachFile />
                </IconButton>
              </Tooltip>
            </label>

            <TextField
              fullWidth
              variant="outlined"
              placeholder={t("marketing.aiAssistant.placeholder")}
              value={selectedCard || inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                if (selectedCard && e.target.value !== selectedCard) {
                  setSelectedCard(null);
                }
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') handleSend();
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: '#fff',
                  '& fieldset': {
                    borderColor: 'rgba(87, 138, 205, 0.3)'
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(87, 138, 205, 0.5)'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#578acd',
                    boxShadow: '0 0 0 2px rgba(87, 138, 205, 0.2)'
                  }
                }
              }}
            />

            <Button
              variant="contained"
              size="large"
              disabled={(!inputValue && !selectedCard && !selectedFile) || waitingModules[activeChat]}
              onClick={handleSend}
              sx={{
                minWidth: '48px',
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: '#578acd',
                color: '#fff',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: '#4678b5',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(87, 138, 205, 0.4)'
                },
                '&.Mui-disabled': {
                  backgroundColor: 'rgba(87, 138, 205, 0.1)',
                  color: 'rgba(87, 138, 205, 0.3)'
                }
              }}
            >
              <Send sx={{
                fontSize: '1.2rem',
                transition: 'transform 0.3s ease',
                transform: (!inputValue && !selectedCard && !selectedFile) || waitingModules[activeChat] ? 'scale(1)' : 'scale(1.1)'
              }} />
            </Button>
          </Box>
        </Paper>
      </Box>

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
            boxShadow: 'none'
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
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          borderRadius: '28px'
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
    </Container>
  );
}