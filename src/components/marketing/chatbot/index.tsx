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
  Fade
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
  PictureAsPdf as PdfIcon
} from '@mui/icons-material';
import ChatbotService from '../../../services/chatbot.service.ts';
import { useNavigate } from 'react-router-dom';
import { IoIosArrowBack } from 'react-icons/io';

const initialBotConfig = {
  name: '',
  instruction: '',
  generateTemplates: true,
  captureLeads: true,
  welcomeMessage: '',
  pdfFiles: [],
  profileImage: null
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

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    const newMessages = [...chatMessages, { role: 'user', content: chatInput }];
    setChatMessages(newMessages);
    setChatInput('');

    setTimeout(() => {
      setChatMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: t('chatbot.response', { context:
            chatInput.includes('product') ? 'product' :
            chatInput.includes('course') ? 'course' : 'default'
          })
        }
      ]);
    }, 600);
  };

  const handleCreateBot = async () => {
    try {
      const formData = new FormData();
      setLoading(true)
      formData.append('name', botConfig.name);
      formData.append('instruction', botConfig.instruction);
      formData.append('companyId', activeCompany);
      formData.append('welcomeMessage', botConfig.welcomeMessage);
      formData.append('generateTemplates', botConfig.generateTemplates);

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
      generateTemplates: true,
      welcomeMessage: bot.welcomeMessage || '',
      pdfFiles: [],
      profileImage: bot.profileImage || null
    });
    setCreatingBot(true);
  };

  const handleUpdateBot = async () => {
    try {
      setLoading(true)
      const formData = new FormData();
      formData.append('id', editingBot.id);
      formData.append('name', botConfig.name);
      formData.append('instruction', botConfig.instruction);
      formData.append('welcomeMessage', botConfig.welcomeMessage);
      formData.append('generateTemplates', botConfig.generateTemplates);

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
      const response = await ChatbotService.getBotByCompanyId(activeCompany);
      setBots(response);
    };

    init();
  }, [activeCompany, creatingBot, editingBot]);

  if (creatingBot) {
    return (
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
                  onClick={()=>{setModule('')}}/>
              </IconButton>
              <Button
                variant="contained"
                onClick={editingBot ? handleUpdateBot : handleCreateBot}
                startIcon={<CheckCircleIcon />}
                disabled={loading}
                sx={{
                  background: 'linear-gradient(45deg, #10B981 0%, #06B6D4 100%)',
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                  textTransform: 'none',
                  fontWeight: 600,
                  boxShadow: '0 4px 14px rgba(16, 185, 129, 0.2)'
                }}
              >
                {editingBot ? t('chatbot.update') : t('chatbot.create')}
              </Button>
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
                      <SettingsIcon sx={{ mr: 1, color: '#6366F1' }} /> {t('chatbot.settings')}
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

                    <Box display="flex" alignItems="center" mt={2} mb={0}>
                      <Checkbox
                        checked={botConfig.generateTemplates}
                        onChange={()=>handleCheckboxChange('generateTemplates')}
                        color="primary"
                        sx={{ '& .MuiSvgIcon-root': { fontSize: 24 } }}
                      />
                      <Typography variant="body2">{t('chatbot.generateTemplates')}</Typography>
                      <Tooltip title={t('chatbot.generateTemplatesTooltip')}>
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
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={7.2}>
                <Card sx={{
                  borderRadius: 4,
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
                  border: '1px solid #F1F5F9',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <CardContent sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, display: 'flex', alignItems: 'center' }}>
                      <SmartToy sx={{ mr: 1, color: '#8B5CF6' }} /> {t('chatbot.teachYourBot')}
                    </Typography>

                    <Box
                      sx={{
                        height: 340,
                        overflowY: 'auto',
                        backgroundColor: '#F8FAFC',
                        borderRadius: 3,
                        p: 2,
                        mb: 2,
                        border: '1px solid #E2E8F0'
                      }}
                    >
                      {chatMessages.length === 0 ? (
                        <Box sx={{
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexDirection: 'column',
                          textAlign: 'center',
                          color: '#64748B'
                        }}>
                          <BotIcon sx={{ fontSize: 64, mb: 2, color: '#CBD5E1' }} />
                          <Typography variant="body2">
                            {t('chatbot.testInstructions')}
                          </Typography>
                        </Box>
                      ) : (
                        chatMessages.map((msg, i) => (
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
                                  {msg.content}
                                </Typography>
                              </Box>
                            </Box>
                          </Fade>
                        ))
                      )}
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <TextField
                        fullWidth
                        placeholder={t('chatbot.typeTestMessage')}
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                        variant="outlined"
                        InputProps={{
                          sx: {
                            borderRadius: 3,
                            backgroundColor: 'white'
                          }
                        }}
                      />
                      <Button
                        onClick={handleSendChat}
                        variant="contained"
                        sx={{
                          minWidth: 48,
                          height: 48,
                          borderRadius: 3,
                          backgroundColor: '#4F46E5',
                          '&:hover': {
                            backgroundColor: '#4338CA'
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
        fontWeight: 800,
        color: '#0F172A',
        fontSize: { xs: '1.5rem', md: '2rem' },
      }}>
      <IoIosArrowBack color="#6f6f6f" size={30}
        style={{
          cursor:'pointer',
          marginRight:'15px',
          marginBottom:'-5px'
        }}
        onClick={()=>{setModule('')}}/>
        {t('chatbot.myChatbots')}
      </Typography>

      <Button
        variant="contained"
        startIcon={<AddIcon sx={{ fontSize: 20 }} />}
        onClick={() => setCreatingBot(true)}
        sx={{
          background: 'linear-gradient(45deg, #6366F1 0%, #8B5CF6 100%)',
          borderRadius: '12px',
          px: 4,
          py: 1.5,
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '1rem',
          boxShadow: '0 4px 20px rgba(99, 102, 241, 0.4)',
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 25px rgba(99, 102, 241, 0.6)',
            background: 'linear-gradient(45deg, #5659E5 0%, #7C4DF5 100%)'
          }
        }}
      >
        {t('chatbot.create')}
      </Button>
    </Box>

    {/* Chatbots Grid */}
    {bots.length === 0 ? (
      <p />
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
                    color: '#6366F1',
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
  </Box>
);
}