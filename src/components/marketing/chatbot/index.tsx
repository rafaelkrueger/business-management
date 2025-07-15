import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  Checkbox,
  CardActions,
  AppBar,
  Toolbar,
  Avatar,
  IconButton,
  Chip,
  Divider,
  Tooltip,
  Fade,
  Skeleton
} from '@mui/material';
import {
  Menu as MenuIcon,
  Add as AddIcon,
  ArrowBack as ArrowBackIcon,
  SmartToy as BotIcon,
  Send as SendIcon,
  Settings as SettingsIcon,
  HelpOutline as HelpIcon,
  CheckCircle as CheckCircleIcon,
  SmartToy,
  Upload as UploadIcon,
  PictureAsPdf as PdfIcon,
  WhatsApp,
  History as HistoryIcon
} from '@mui/icons-material';
import ChatHistoryModal from './ChatHistoryModal.tsx';
import ProductsSelectModal from './ProductsSelectModal.tsx';
import ChatbotService from '../../../services/chatbot.service.ts';
import { useNavigate } from 'react-router-dom';
import { IoIosArrowBack } from 'react-icons/io';
import { ChartGanttIcon, LockIcon, PlusCircle, PlusCircleIcon } from 'lucide-react';
import { PlusOutlined } from '@ant-design/icons';

interface Product {
  id: string;
  name: string;
  description: string;
  price?: number;
}

const initialBotConfig = {
  name: '',
  instruction: '',
  captureLeads: false,
  createImages: false,
  createPages: false,
  createDocuments: false,
  sellProducts: false,
  connectWhatsapp: false,
  welcomeMessage: '',
  pdfFiles: [],
  profileImage: null,
  selectedProducts: [] as Product[]
};

export const ChatbotManager: React.FC<{ activeCompany: any, setModule: (module: string) => void }> = ({ activeCompany, setModule }) => {
  const { t } = useTranslation();
  const [bots, setBots] = useState([]);
  const [creatingBot, setCreatingBot] = useState(false);
  const [editingBot, setEditingBot] = useState(null);
  const [botConfig, setBotConfig] = useState(initialBotConfig);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [activeBot, setActiveBot] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(false);
  const [loadingBots, setLoadingBots] = useState(true);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyBotId, setHistoryBotId] = useState<string | null>(null);
  const [historyBotSlug, setHistoryBotSlug] = useState<string | null>(null);
  const [productsModalOpen, setProductsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setBotConfig({ ...botConfig, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (key) => {
    setBotConfig({ ...botConfig, [key]: !botConfig[key] });
  };

  const handlePdfUpload = (e) => {
    const files = Array.from(e.target.files);
    setBotConfig({
      ...botConfig,
      pdfFiles: [...botConfig.pdfFiles, ...files]
    });
  };

  const handleRemovePdf = (index) => {
    const newPdfFiles = [...botConfig.pdfFiles];
    newPdfFiles.splice(index, 1);
    setBotConfig({ ...botConfig, pdfFiles: newPdfFiles });
  };

  const handleProfileImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBotConfig({
          ...botConfig,
          profileImage: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendChat = async () => {
    if (!chatInput.trim()) return;

    const userMessage = { role: 'user', content: chatInput + ' ' + '#teach' };
    const newMessages = [...chatMessages, userMessage];
    setChatMessages(newMessages);
    setChatInput('');
    setLoadingMessage(true);

    try {
      const res = await ChatbotService.sendMessageToBot({
        chatId: 'admin',
        slug: editingBot?.slug,
        message: chatInput
      });

      const assistantMessage = {
        role: 'assistant',
        content: res?.reply || t('chatbot.defaultError')
      };

      setChatMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error(err);
      setChatMessages(prev => [
        ...prev,
        { role: 'assistant', content: t('chatbot.defaultError') }
      ]);
    } finally {
      setLoadingMessage(false);
    }
  };


  const handleCreateBot = async () => {
    try {
      const formData = new FormData();
      setLoading(true)
      formData.append('name', botConfig.name);
      formData.append('instruction', botConfig.instruction);
      formData.append('companyId', activeCompany);
      formData.append('welcomeMessage', botConfig.welcomeMessage);
      formData.append('captureLeads', botConfig.captureLeads);
      formData.append('createImages', botConfig.createImages);
      formData.append('createDocuments', botConfig.createDocuments);
      formData.append('sellProducts', botConfig.sellProducts);
      const payloadProducts = botConfig.selectedProducts.map(p => ({
        id: p.id,
        name: p.name,
        description: p.description,
        price: p.price
      }));
      formData.append('products', JSON.stringify(payloadProducts));
      formData.append('createPages', botConfig.createPages);

      if (botConfig.profileImage) {
        const blob = await fetch(botConfig.profileImage).then(r => r.blob());
        formData.append('profileImage', blob, 'profile.png');
      }

      botConfig.pdfFiles.forEach((file, index) => {
        formData.append(`pdfFiles`, file);
      });

      await ChatbotService.createBot(formData);

      setCreatingBot(false);
      setEditingBot(null);
      setBotConfig(initialBotConfig);
      setChatMessages([]);
    } catch (err) {
      console.error('Error creating bot:', err);
    } finally{
      setLoading(false)
    }
  };

  const handleEditBot = (bot) => {
    setEditingBot(bot);
    setBotConfig({
      name: bot.name,
      instruction: bot.instruction,
      welcomeMessage: bot.welcomeMessage || '',
      pdfFiles: [],
      captureLeads: bot.captureLeads,
      createImages: bot.createImages,
      createDocuments: bot.createDocuments,
      sellProducts: bot.sellProducts,
      createPages: bot.createPages,
      profileImage: bot.profileImage || null,
      selectedProducts: bot.products || []
    });
    setCreatingBot(true);
  };

  const handleOpenHistory = (botId: string, botSlug: string) => {
    setHistoryBotId(botId);
    setHistoryBotSlug(botSlug);
    setHistoryOpen(true);
  };

  const handleCloseHistory = () => {
    setHistoryOpen(false);
    setHistoryBotId(null);
    setHistoryBotSlug(null);
  };

  const handleUpdateBot = async () => {
    try {
      setLoading(true)
      const formData = new FormData();
      formData.append('id', editingBot.id);
      formData.append('name', botConfig.name);
      formData.append('instruction', botConfig.instruction);
      formData.append('welcomeMessage', botConfig.welcomeMessage);
      formData.append('captureLeads', botConfig.captureLeads);
      formData.append('createImages', botConfig.createImages);
      formData.append('createDocuments', botConfig.createDocuments);
      formData.append('sellProducts', botConfig.sellProducts);
      const payloadProducts = botConfig.selectedProducts.map(p => ({
        id: p.id,
        name: p.name,
        description: p.description,
        price: p.price
      }));
      formData.append('products', JSON.stringify(payloadProducts));
      formData.append('createPages', botConfig.createPages);

      if (typeof botConfig.profileImage === 'string' && botConfig.profileImage.startsWith('http')) {
        // Image URL already exists, no need to re-upload
        formData.append('profileImageUrl', botConfig.profileImage);
      } else if (botConfig.profileImage) {
        const blob = await fetch(botConfig.profileImage).then(r => r.blob());
        formData.append('profileImage', blob, 'profile.png');
      }

      botConfig.pdfFiles.forEach((file, index) => {
        formData.append(`pdfFiles`, file);
      });

      const response = await ChatbotService.createBot(formData);

      setBots(bots.map(bot =>
        bot.id === editingBot.id ? { ...bot, ...response } : bot
      ));
      setCreatingBot(false);
      setEditingBot(null);
      setBotConfig(initialBotConfig);
    } catch (err) {
      console.error('Error updating bot:', err);
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoadingBots(true);
      try {
        const response = await ChatbotService.getBotByCompanyId(activeCompany);
        setBots(response);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingBots(false);
      }
    };

    init();
  }, [activeCompany, creatingBot, editingBot]);

  if (creatingBot) {
    return (
      <>
      <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <AppBar
            position="static"
            elevation={0}
            sx={{
              backgroundColor: 'white',
              borderBottom: '1px solid #E2E8F0',
              color: '#0F172A'
            }}
          >
            <Toolbar style={{justifyContent:'space-between'}}>
              <IconButton onClick={() => {
                setCreatingBot(false);
                setEditingBot(null);
                setBotConfig(initialBotConfig);
              }} sx={{ mr: 2 }}>
                <IoIosArrowBack color="#6f6f6f" size={30}
                  style={{
                    cursor:'pointer',
                    marginRight:'15px',
                    marginBottom:'-5px'
                  }}
                  onClick={()=>{setCreatingBot(false); setEditingBot(false); setChatMessages([])}}/>
              </IconButton>
            </Toolbar>
          </AppBar>

          <Box sx={{ flex: 1, p: 4, overflow: 'auto' }}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={4.7}>
                <Card sx={{
                  borderRadius: 4,
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
                  border: '1px solid #F1F5F9'
                }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, display: 'flex', alignItems: 'center' }}>
                      <SettingsIcon sx={{ mr: 1, color: '#1c3d91' }} /> {t('chatbot.settings')}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <input
                        accept="image/*"
                        style={{ display: 'none' }}
                        id="profile-image-upload"
                        type="file"
                        onChange={handleProfileImageUpload}
                      />
                      <label htmlFor="profile-image-upload">
                        <Avatar
                          src={botConfig.profileImage}
                          sx={{
                            width: 80,
                            height: 80,
                            cursor: 'pointer',
                            border: '2px dashed #E2E8F0'
                          }}
                        >
                          {!botConfig.profileImage && <UploadIcon />}
                        </Avatar>
                      </label>
                      <Box sx={{ ml: 2 }}>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {t('chatbot.profileImage')}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {t('chatbot.profileImageHint')}
                        </Typography>
                      </Box>
                    </Box>

                    <TextField
                      fullWidth
                      margin="normal"
                      label={t('chatbot.name')}
                      name="name"
                      value={botConfig.name}
                      onChange={handleInputChange}
                      variant="outlined"
                      InputProps={{
                        sx: { borderRadius: 3 }
                      }}
                    />

                    <TextField
                      fullWidth
                      margin="normal"
                      label={t('chatbot.instructions')}
                      name="instruction"
                      value={botConfig.instruction}
                      onChange={handleInputChange}
                      multiline
                      rows={4}
                      variant="outlined"
                      placeholder={t('chatbot.instructionsPlaceholder')}
                      InputProps={{
                        sx: { borderRadius: 3 }
                      }}
                    />

                    <TextField
                      fullWidth
                      margin="normal"
                      label={t('chatbot.welcomeMessage')}
                      name="welcomeMessage"
                      value={botConfig.welcomeMessage}
                      onChange={handleInputChange}
                      variant="outlined"
                      InputProps={{
                        sx: { borderRadius: 3 }
                      }}
                    />

                    {/* <Box sx={{ mt: 3 }}>
                      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
                        {t('chatbot.knowledgeBase')}
                      </Typography>
                      <input
                        accept=".pdf"
                        style={{ display: 'none' }}
                        id="pdf-upload"
                        type="file"
                        multiple
                        onChange={handlePdfUpload}
                      />
                      <label htmlFor="pdf-upload">
                        <Button
                          variant="outlined"
                          component="span"
                          startIcon={<PdfIcon />}
                          sx={{ borderRadius: 3, mb: 2 }}
                        >
                          {t('chatbot.uploadPDFs')}
                        </Button>
                      </label>
                      <Box sx={{ maxHeight: 120, overflow: 'auto' }}>
                        {botConfig.pdfFiles.map((file, index) => (
                          <Chip
                            key={index}
                            label={file.name}
                            onDelete={() => handleRemovePdf(index)}
                            sx={{ mr: 1, mb: 1 }}
                            icon={<PdfIcon />}
                          />
                        ))}
                      </Box>
                    </Box> */}

                    <Box display="flex" alignItems="center" mt={0} mb={1}>
                      <Checkbox
                        checked={botConfig.createImages}
                        onChange={()=>{handleCheckboxChange('createImages')}}
                        color="primary"
                        sx={{ '& .MuiSvgIcon-root': { fontSize: 24 } }}
                      />
                      <Typography variant="body2">{t('chatbot.createImages')}</Typography>
                      <Tooltip title={t('chatbot.createImagesTooltip')}>
                        <HelpIcon sx={{ ml: 1, fontSize: 18, color: '#94A3B8' }} />
                      </Tooltip>
                    </Box>
                    <Box display="flex" alignItems="center" mt={0} mb={1}>
                      <Checkbox
                        checked={botConfig.createPages}
                        onChange={()=>{handleCheckboxChange('createPages')}}
                        color="primary"
                        sx={{ '& .MuiSvgIcon-root': { fontSize: 24 } }}
                      />
                      <Typography variant="body2">{t('chatbot.createPages')}</Typography>
                      <Tooltip title={t('chatbot.createPagesTooltip')}>
                        <HelpIcon sx={{ ml: 1, fontSize: 18, color: '#94A3B8' }} />
                      </Tooltip>
                    </Box>
                    <Box display="flex" alignItems="center" mt={0} mb={1}>
                      <Checkbox
                        checked={botConfig.captureLeads}
                        onChange={()=>{handleCheckboxChange('captureLeads')}}
                        color="primary"
                        sx={{ '& .MuiSvgIcon-root': { fontSize: 24 } }}
                      />
                      <Typography variant="body2">{t('chatbot.captureLeads')}</Typography>
                      <Tooltip title={t('chatbot.captureLeadsTooltip')}>
                        <HelpIcon sx={{ ml: 1, fontSize: 18, color: '#94A3B8' }} />
                      </Tooltip>
                    </Box>
                    <Box display="flex" alignItems="center" mt={0} mb={1}>
                      <Checkbox
                        checked={botConfig.createDocuments}
                        onChange={()=>{handleCheckboxChange('createDocuments')}}
                        color="primary"
                        sx={{ '& .MuiSvgIcon-root': { fontSize: 24 } }}
                      />
                      <Typography variant="body2">{t('chatbot.createDocuments')}</Typography>
                      <Tooltip title={t('chatbot.createDocumentsTooltip')}>
                        <HelpIcon sx={{ ml: 1, fontSize: 18, color: '#94A3B8' }} />
                      </Tooltip>
                    </Box>
                    <Box display="flex" alignItems="center" mt={0} mb={1}>
                      <Checkbox
                        checked={botConfig.sellProducts}
                        onChange={()=>{handleCheckboxChange('sellProducts')}}
                        color="primary"
                        sx={{ '& .MuiSvgIcon-root': { fontSize: 24 } }}
                      />
                      <Typography variant="body2">{t('chatbot.sellProducts')}</Typography>
                      <Tooltip title={t('chatbot.sellProductsTooltips')}>
                        <HelpIcon sx={{ ml: 1, fontSize: 18, color: '#94A3B8' }} />
                      </Tooltip>
                    </Box>
                    <Box display="flex" alignItems="center" mt={0} mb={1}>
                      {
                        botConfig.sellProducts && (
                        <Button variant="outlined" onClick={()=> setProductsModalOpen(true)}>
                          {t('products.selectProducts', 'Select Products')}
                        </Button>
                        )
                      }
                    </Box>
                    <Box display="flex" alignItems="center" gap={2} mt={0} mb={1}>
                      <Button
                        variant={botConfig.connectWhatsapp ? "contained" : "outlined"}
                        startIcon={<WhatsApp />}
                        onClick={() => handleCheckboxChange('connectWhatsapp')}
                        sx={{
                          textTransform: 'none',
                          backgroundColor: botConfig.connectWhatsapp ? '#25D366' : 'transparent',
                          color: botConfig.connectWhatsapp ? 'white' : '#25D366',
                          borderColor: '#25D366',
                          '&:hover': {
                            backgroundColor: botConfig.connectWhatsapp ? '#20b358' : 'rgba(37, 211, 102, 0.1)',
                            borderColor: '#20b358'
                          },
                          px: 2,
                          py: 0.8,
                          borderRadius: '12px'
                        }}
                      >
                        {botConfig.connectWhatsapp ? t('chatbot.connectedWhatsapp') : t('chatbot.connectWhatsapp')}
                      </Button>
                      <Tooltip title={t('chatbot.connectWhatsappHint')}>
                        <HelpIcon sx={{ fontSize: 18, color: '#94A3B8', cursor: 'pointer' }} />
                      </Tooltip>
                    </Box>

                  </CardContent>
                <Button
                variant="contained"
                onClick={editingBot ? handleUpdateBot : handleCreateBot}
                startIcon={<CheckCircleIcon />}
                disabled={loading}
                sx={{
                  background: '#578acd',
                  borderRadius: 2,
                  width:'90%',
                  px: 3,
                  py: 1,
                  margin:2,
                  marginTop:'0px',
                  textTransform: 'none',
                  fontWeight: 600,
                  boxShadow: '0 4px 14px rgba(16, 185, 129, 0.2)'
                }}
              >
                {editingBot ? t('chatbot.update') : t('chatbot.create')}
              </Button>
                </Card>

              </Grid>
            <Grid item xs={12} md={7.2}>
              <Card sx={{
                borderRadius: 4,
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
                border: '1px solid #F1F5F9',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflowY: 'auto',
                height: '65%',
                minHeight: '100%',
              }}>
                <CardContent sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{
                    mb: 2,
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    position: 'relative',
                    zIndex: 2,
                  }}>
                    <SmartToy sx={{ mr: 1, color: '#23509d' }} /> {t('chatbot.teachYourBot')}
                  </Typography>

                  <Box sx={{
                    overflowY: 'auto',
                    backgroundColor: '#F8FAFC',
                    borderRadius: 3,
                    p: 2,
                    mb: 2,
                    border: '1px solid #E2E8F0',
                    minHeight: '75%',
                    position: 'relative'
                  }}>
                    {chatMessages.length === 0 ? (
                      <Box sx={{
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        textAlign: 'center',
                        color: '#64748B',
                        marginTop:'150px'
                      }}>
                        <BotIcon sx={{ fontSize: 64, mb: 2, color: '#CBD5E1' }} />
                        <Typography variant="body2" style={{width:'70%'}}>
                          {t('chatbot.testInstructions')}
                        </Typography>
                      </Box>
                    ) : (
                      <>
                        {chatMessages.map((msg, i) => (
                          <Fade in={true} key={i}>
                            <Box
                              sx={{
                                mb: 2,
                                display: 'flex',
                                flexDirection: msg.role === 'user' ? 'row-reverse' : 'row'
                              }}
                            >
                              <Box
                                sx={{
                                  p: 2,
                                  borderRadius: 4,
                                  maxWidth: '80%',
                                  backgroundColor: msg.role === 'user' ? '#E0E7FF' : '#EDE9FE',
                                  borderBottomRightRadius: msg.role === 'user' ? 4 : 18,
                                  borderBottomLeftRadius: msg.role === 'user' ? 18 : 4,
                                }}
                              >
                                <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                                  {msg.content.replace('#teach', '')}
                                </Typography>
                              </Box>
                            </Box>
                          </Fade>
                        ))}

                        {loadingMessage && (
                          <Fade in={true}>
                            <Box
                              sx={{
                                mb: 2,
                                display: 'flex',
                                flexDirection: 'row'
                              }}
                            >
                              <Box
                                sx={{
                                  p: 2,
                                  borderRadius: 4,
                                  maxWidth: '80%',
                                  backgroundColor: '#EDE9FE',
                                  borderBottomRightRadius: 4,
                                  borderBottomLeftRadius: 18
                                }}
                              >
                                <Typography
                                  variant="body2"
                                  sx={{
                                    lineHeight: 1.6,
                                    fontFamily: 'monospace',
                                    letterSpacing: '1px',
                                    '&::after': {
                                      content: '"..."',
                                      animation: 'dots 1.2s steps(3, end) infinite'
                                    },
                                    '@keyframes dots': {
                                      '0%': { content: '""' },
                                      '33%': { content: '"."' },
                                      '66%': { content: '".."' },
                                      '100%': { content: '""' }
                                    }
                                  }}>.</Typography>
                              </Box>
                            </Box>
                          </Fade>
                        )}
                      </>
                    )}
                    {!editingBot && (
                      <Box sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backdropFilter: 'blur(4px) saturate(180%)',
                        backgroundColor: 'rgba(255, 255, 255, 0.7)',
                        zIndex: 5,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        cursor: 'not-allowed',
                        transition: 'all 0.3s ease'
                      }}>
                        <LockIcon sx={{
                          fontSize: 64,
                          color: '#64748B',
                          opacity: 0.8,
                          mb: 1.5,
                          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                        }} />
                        <Typography variant="body1" sx={{
                          fontWeight: 600,
                          color: '#334155',
                          textAlign: 'center',
                          maxWidth: '80%'
                        }}>
                          {t('chatbot.createBotToStartMessage')}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      fullWidth
                      placeholder={!editingBot ? t('chatbot.createBotToStartMessage') : t('chatbot.typeTestMessage')}
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && editingBot && handleSendChat()}
                      variant="outlined"
                      disabled={!editingBot}
                      InputProps={{
                        sx: {
                          borderRadius: 3,
                          backgroundColor: 'white',
                          opacity: !editingBot ? 0.7 : 1
                        }
                      }}
                    />
                    <Button
                      onClick={handleSendChat}
                      variant="contained"
                      disabled={!editingBot}
                      sx={{
                        minWidth: 48,
                        height: 48,
                        borderRadius: 3,
                        backgroundColor: '#4F46E5',
                        opacity: !editingBot ? 0.7 : 1,
                        '&:hover': {
                          backgroundColor: editingBot ? '#4338CA' : '#4F46E5'
                        }
                      }}
                    >
                      <SendIcon />
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>
      <ProductsSelectModal
        open={productsModalOpen}
        onClose={() => setProductsModalOpen(false)}
        companyId={activeCompany}
        selected={botConfig.selectedProducts}
        onChange={(products) => setBotConfig({ ...botConfig, selectedProducts: products })}
      />
      </>
    );
  }

return (
  <Box sx={{
    minHeight: '100vh',
    backgroundColor: '#F9FAFB',
    p: { xs: 2, md: 4 }
  }}>
    {/* Header Section */}
    <Box sx={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      mb: 4,
      flexWrap: 'wrap',
      gap: 2
    }}>
      <Typography variant="h4" sx={{
        fontWeight: 600,
        color: '#0F172A',
        fontSize: { xs: '1.5rem', md: '1.5rem' },
      }}>
      <IoIosArrowBack color="#6f6f6f" size={30}
        style={{
          cursor:'pointer',
          marginRight:'15px',
          marginBottom:'-5px',
        }}
        onClick={()=>{setModule('')}}/>
        {t('chatbot.myChatbots')}
      </Typography>

      <PlusOutlined
        style={{
          fontSize: '19px',
          color: 'white',
          cursor: 'pointer',
          transition: 'color 0.3s ease',
          marginRight: '5px',
          background:'#578acd',
          padding: '6px',
          borderRadius: '5px',
        }}
         onClick={() => setCreatingBot(true)}
      />
    </Box>

    {/* Chatbots Grid */}
    {loadingBots ? (
      <Grid container spacing={3}>
        {Array.from({ length: 4 }).map((_, index) => (
          <Grid item xs={12} sm={6} lg={4} xl={3} key={index}>
            <Card sx={{
              borderRadius: '16px',
              boxShadow: '0 5px 25px -5px rgba(0, 0, 0, 0.05)',
              border: '1px solid #F1F5F9',
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5 }}>
                  <Skeleton variant="circular" width={48} height={48} sx={{ mr: 2 }} />
                  <Skeleton variant="text" width="60%" height={24} />
                </Box>
                <Skeleton variant="text" width="100%" height={16} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="100%" height={16} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="80%" height={16} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    ) : bots.length === 0 ? (
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      minHeight: '70vh',
      textAlign: 'center',
      p: 3,
      background: 'linear-gradient(135deg, #f9fafb 0%, #f0f4ff 100%)',
      borderRadius: '24px',
      border: '1px dashed #d1d5db',
      mx: 2
    }}>
      {/* Animated Illustration */}
      <Box sx={{
        position: 'relative',
        width: 180,
        height: 180,
        mb: 4,
      }}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 100,
          height: 100,
          background: '#ffffff',
          borderRadius: '30%',
          boxShadow: '0 10px 25px -5px rgba(99, 102, 241, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <SmartToy sx={{
            fontSize: 48,
            color: '#578acd',
            opacity: 0.9
          }} />
        </Box>
      </Box>

      {/* Text Content */}
      <Typography variant="h5" sx={{
        fontWeight: 700,
        color: '#1f2937',
        mb: 1.5,
        mt:-7,
        fontSize: '1.5rem',
        letterSpacing: '-0.025em'
      }}>
        {t('chatbot.emptyTitle')}
      </Typography>

      <Typography variant="body1" sx={{
        color: '#4b5563',
        maxWidth: 500,
        mb: 4,
        lineHeight: 1.7,
        fontSize: '1.05rem'
      }}>
        {t('chatbot.emptyDesc')}
      </Typography>

      {/* CTA Button */}
      <Button
        variant="contained"
        onClick={() => setCreatingBot(true)}
        startIcon={<CheckCircleIcon />}
        disabled={loading}
        sx={{
          background: '#578acd',
          borderRadius: 2,
          width:'90%',
          px: 3,
          py: 1,
          margin:2,
          marginTop:'0px',
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: '0 4px 14px rgba(16, 185, 129, 0.2)'
        }}
      >
        {t('chatbot.create')}
      </Button>

    </Box>
  ) : (
      <Grid container spacing={3}>
        {bots.map((bot) => (
          <Grid item xs={12} sm={6} lg={4} xl={3} key={bot.id}>
            <Card sx={{
              borderRadius: '16px',
              boxShadow: '0 5px 25px -5px rgba(0, 0, 0, 0.05)',
              border: '1px solid #F1F5F9',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
              background: '#FFFFFF',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 15px 45px -5px rgba(0, 0, 0, 0.1)',
                borderColor: '#E0E7FF'
              }
            }}>
              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5 }}>
                  <Avatar
                    src={bot.profileImage}
                    sx={{
                      bgcolor: bot.color,
                      mr: 2,
                      width: 48,
                      height: 48,
                      borderRadius: '14px',
                      fontSize: '1.25rem'
                    }}
                  >
                    {bot.name?.charAt(0)}
                  </Avatar>
                  <Typography variant="h6" sx={{
                    fontWeight: 700,
                    color: '#1E293B',
                    fontSize: '1.1rem'
                  }}>
                    {bot.name}
                  </Typography>
                </Box>

                <Typography variant="body2" sx={{
                  minHeight: 72,
                  mb: 2.5,
                  color: '#64748B',
                  lineHeight: 1.6,
                  fontSize: '0.9rem',
                  display: '-webkit-box',
                  WebkitBoxOrient: 'vertical',
                  WebkitLineClamp: 3,
                  overflow: 'hidden'
                }}>
                  {bot.instruction}
                </Typography>

                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <Chip
                    label={t('chatbot.active')}
                    size="small"
                    sx={{
                      backgroundColor: '#F0FDF4',
                      color: '#166534',
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      borderRadius: '6px',
                      px: 1
                    }}
                  />
                  <Typography variant="caption" sx={{
                    color: '#94A3B8',
                    fontWeight: 500,
                    fontSize: '0.75rem'
                  }}>
                    ID: {bot.id.slice(0,6)}
                  </Typography>
                </Box>
              </CardContent>

              <CardActions sx={{
                p: 3,
                pt: 0,
                gap: 1,
                borderTop: '1px solid #F1F5F9'
              }}>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => handleOpenHistory(bot.id, bot.slug)}
                  sx={{
                    borderRadius: '10px',
                    fontWeight: 600,
                    color: '#64748B',
                    borderColor: '#E2E8F0',
                    flex: 1,
                    py: 1,
                    '&:hover': {
                      borderColor: '#CBD5E1',
                      backgroundColor: '#F8FAFC'
                    }
                  }}
                >
                  <HistoryIcon />
                </Button>
                <Button
                  onClick={() => window.open(`https://roktune.duckdns.org/chatbot/s/${bot.slug}`, '_blank')}
                  size="small"
                  variant="outlined"
                  sx={{
                    borderRadius: '10px',
                    fontWeight: 600,
                    color: '#64748B',
                    borderColor: '#E2E8F0',
                    flex: 1,
                    py: 1,
                    '&:hover': {
                      borderColor: '#CBD5E1',
                      backgroundColor: '#F8FAFC'
                    }
                  }}
                >
                  {t('chatbot.test')}
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  sx={{
                    borderRadius: '10px',
                    fontWeight: 600,
                    background: '#F1F5F9',
                    color: '#638bf1',
                    flex: 1,
                    py: 1,
                    '&:hover': {
                      backgroundColor: '#E0E7FF'
                    }
                  }}
                  onClick={() => handleEditBot(bot)}
                >
                  {t('chatbot.edit')}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    )}
    <ChatHistoryModal
      open={historyOpen}
      onClose={handleCloseHistory}
      botId={historyBotId}
      botSlug={historyBotSlug}
    />
    <ProductsSelectModal
      open={productsModalOpen}
      onClose={() => setProductsModalOpen(false)}
      companyId={activeCompany}
      selected={botConfig.selectedProducts}
      onChange={(products) => setBotConfig({ ...botConfig, selectedProducts: products })}
    />
  </Box>
);
}