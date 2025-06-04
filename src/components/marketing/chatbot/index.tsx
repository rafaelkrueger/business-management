import { useState } from 'react';
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
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
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
  SmartToy
} from '@mui/icons-material';
import ChatbotService from '../../../services/chatbot.service.ts';

const initialBotConfig = {
  name: '',
  instruction: '',
  generateTemplates: true,
  welcomeMessage: '',
};

export const ChatbotManager: React.FC<{ activeCompany: any, setModule: (module: string) => void }> = ({ activeCompany, setModule }) => {
  const [bots, setBots] = useState([
    { id: 'bot1', name: 'Bot da Loja', instruction: 'Você ajuda clientes a escolher produtos da loja.', color: '#6366F1' },
    { id: 'bot2', name: 'Bot do Curso', instruction: 'Você ajuda alunos a entenderem sobre marketing.', color: '#10B981' },
  ]);
  const [creatingBot, setCreatingBot] = useState(false);
  const [botConfig, setBotConfig] = useState(initialBotConfig);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [activeBot, setActiveBot] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleInputChange = (e) => {
    setBotConfig({ ...botConfig, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = () => {
    setBotConfig({ ...botConfig, generateTemplates: !botConfig.generateTemplates });
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
          content: 'Ótimo! Com base nas suas instruções, configurei o chatbot para: ' +
                   (chatInput.includes('produto') ? 'ajudar clientes com dúvidas sobre produtos e sugestões.' :
                   chatInput.includes('curso') ? 'explicar conceitos complexos de forma simplificada.' :
                   'fornecer respostas precisas e amigáveis.')
        }
      ]);
    }, 600);
  };

const handleCreateBot = async () => {
  try {
    const response = await ChatbotService.createBot({
      name: botConfig.name,
      instruction: botConfig.instruction,
      companyId: activeCompany,
      welcomeMessage: botConfig.welcomeMessage,
      generateTemplates: botConfig.generateTemplates,
    });

    const newBot = {
      id: response.id,
      name: response.name,
      instruction: response.instruction,
      color: `#${Math.floor(Math.random() * 16777215).toString(16)}`
    };

    setBots([...bots, newBot]);
    setCreatingBot(false);
    setBotConfig(initialBotConfig);
    setChatMessages([]);
  } catch (err) {
    console.error('Erro ao criar bot:', err);
    // opcional: exibir notificação de erro
  }
};


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
              <IconButton onClick={() => setCreatingBot(false)} sx={{ mr: 2 }}>
                <ArrowBackIcon />
              </IconButton>
              <Button
                variant="contained"
                onClick={handleCreateBot}
                startIcon={<CheckCircleIcon />}
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
                Criar Chatbot
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
                      <SettingsIcon sx={{ mr: 1, color: '#6366F1' }} /> Configurações do Bot
                    </Typography>

                    <TextField
                      fullWidth
                      margin="normal"
                      label="Nome do Bot"
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
                      label="Instruções para o Bot"
                      name="instruction"
                      value={botConfig.instruction}
                      onChange={handleInputChange}
                      multiline
                      rows={4}
                      variant="outlined"
                      placeholder="Ex: Você é um assistente de vendas que ajuda clientes a escolher produtos..."
                      InputProps={{
                        sx: { borderRadius: 3 }
                      }}
                    />

                    <TextField
                      fullWidth
                      margin="normal"
                      label="Mensagem de boas-vindas"
                      name="welcomeMessage"
                      value={botConfig.welcomeMessage}
                      onChange={handleInputChange}
                      variant="outlined"
                      InputProps={{
                        sx: { borderRadius: 3 }
                      }}
                    />

                    <Box display="flex" alignItems="center" mt={2} mb={1}>
                      <Checkbox
                        checked={botConfig.generateTemplates}
                        onChange={handleCheckboxChange}
                        color="primary"
                        sx={{ '& .MuiSvgIcon-root': { fontSize: 24 } }}
                      />
                      <Typography variant="body2">Gerar templates automaticamente</Typography>
                      <Tooltip title="O bot irá sugerir templates de respostas com base nas interações">
                        <HelpIcon sx={{ ml: 1, fontSize: 18, color: '#94A3B8' }} />
                      </Tooltip>
                    </Box>
                    <Box display="flex" alignItems="center" mt={2} mb={1}>
                      <Checkbox
                        checked={botConfig.generateTemplates}
                        onChange={handleCheckboxChange}
                        color="primary"
                        sx={{ '& .MuiSvgIcon-root': { fontSize: 24 } }}
                      />
                      <Typography variant="body2">Gerar templates automaticamente</Typography>
                      <Tooltip title="O bot irá sugerir templates de respostas com base nas interações">
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
                      <SmartToy sx={{ mr: 1, color: '#8B5CF6' }} /> Ensine seu bot
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
                            Digite abaixo para testar o comportamento do seu chatbot.<br />
                            As respostas serão simuladas com base nas suas instruções.
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
                        placeholder="Digite uma mensagem de teste..."
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
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ flex: 1, p: 4, overflow: 'auto' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>Meus Chatbots</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setCreatingBot(true)}
              sx={{
                background: 'linear-gradient(45deg, #6366F1 0%, #8B5CF6 100%)',
                borderRadius: 2,
                px: 3,
                py: 1,
                textTransform: 'none',
                fontWeight: 600,
                boxShadow: '0 4px 14px rgba(99, 102, 241, 0.3)'
              }}
            >
              Criar Chatbot
            </Button>
          </Box>

          <Grid container spacing={3}>
            {bots.map((bot) => (
              <Grid item xs={12} sm={6} md={4} key={bot.id}>
                <Card sx={{
                  borderRadius: 4,
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
                  border: '1px solid #F1F5F9',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)'
                  }
                }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ bgcolor: bot.color, mr: 2 }}>{bot.name.charAt(0)}</Avatar>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>{bot.name}</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{
                      minHeight: 60,
                      mb: 2,
                      color: '#64748B'
                    }}>
                      {bot.instruction}
                    </Typography>
                    <Chip
                      label="Ativo"
                      size="small"
                      sx={{
                        backgroundColor: '#F0FDF4',
                        color: '#166534',
                        fontWeight: 500
                      }}
                    />
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'flex-end', borderTop: '1px solid #F1F5F9' }}>
                    <Button size="small" variant="outlined" sx={{ borderRadius: 2, mr: 1 }}>
                      Testar
                    </Button>
                    <Button size="small" variant="contained" sx={{ borderRadius: 2 }}>
                      Editar
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}