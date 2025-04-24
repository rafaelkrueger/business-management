import React, { useEffect, useState } from 'react';
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
  Skeleton
} from '@mui/material';
import {
  SmartToy,
  Send,
  HelpOutline,
  TrendingUp,
  Campaign,
  Star,
  ChevronRight,
  ArrowBackIos
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import ChatAiService from '../../../services/chat-ai.service.ts';

export default function PremiumMarketingAssistant({activeCompany, setModule}) {
  const theme = useTheme();
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState(t("marketing.aiAssistant.all"));
  const [inputValue, setInputValue] = useState('');
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isWaitingResponse, setIsWaitingResponse] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [messages, setMessages] = useState([]);

  const generateSkeletonLines = () => {
    const lines = Math.floor(Math.random() * 3) + 1;
    return Array.from({ length: lines }, () => Math.floor(Math.random() * 60) + 40);
  };


  useEffect(() => {
    const initChat = async () => {
      const id = await ChatAiService.startConversation();
      setConversationId(id);
    };
    initChat();
  }, []);

  useEffect(() => {
    const scrollContainer = document.querySelector('#root > div > div.sc-ktwOfi.gVIUQZ') as HTMLElement;
    if (scrollContainer) {
      scrollContainer.style.overflow = 'hidden';
    }
    return () => {
      if (scrollContainer) {
        scrollContainer.style.overflow = 'auto';
      }
    };
  }, []);

  const categories = [
    { label: t("marketing.aiAssistant.all"), icon: <Star />, color: '#6366F1' },
    { label: t("marketing.aiAssistant.suggestionTitle"), icon: <HelpOutline />, color: '#0A6CCC' },
    { label: t("marketing.aiAssistant.performance"), icon: <TrendingUp />, color: '#059669' },
    // { label: t("marketing.aiAssistant.campaing"), icon: <Campaign />, color: '#8B5CF6' }
  ];

  const suggestionCards = [
    {
      title: t('marketing.aiAssistant.suggestions.improveEngagement.title'),
      description: t('marketing.aiAssistant.suggestions.improveEngagement.description'),
      category: t('marketing.aiAssistant.suggestions.improveEngagement.category'),
      stars: 4.8,
    },
    {
      title: t('marketing.aiAssistant.suggestions.channelPriority.title'),
      description: t('marketing.aiAssistant.suggestions.channelPriority.description'),
      category: t('marketing.aiAssistant.suggestions.channelPriority.category'),
      stars: 4.5,
    },
    {
      title: t('marketing.aiAssistant.suggestions.emailGuide.title'),
      description: t('marketing.aiAssistant.suggestions.emailGuide.description'),
      category: t('marketing.aiAssistant.suggestions.emailGuide.category'),
      stars: 4.9,
    },
    {
      title: t('marketing.aiAssistant.suggestions.leadQualification.title'),
      description: t('marketing.aiAssistant.suggestions.leadQualification.description'),
      category: t('marketing.aiAssistant.suggestions.leadQualification.category'),
      stars: 4.7,
    },

  ];

  const handleSend = async () => {
    if (!conversationId || (!selectedCard && !inputValue.trim())) return;

    const content = selectedCard || inputValue.trim();
    setInputValue('');
    setSelectedCard(null);

    const userMessage = {
      id: crypto.randomUUID(),
      sender: 'user',
      content,
      timestamp: new Date()
    };


    const loadingMessage = {
      id: 'typing',
      sender: 'assistant',
      content: '',
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage, loadingMessage]);
    setIsWaitingResponse(true);

    try {
      const updatedMessages = await ChatAiService.sendMessage(conversationId, content, activeCompany);
      setMessages(updatedMessages);
    } catch (error) {
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== 'typing'),
        {
          id: crypto.randomUUID(),
          sender: 'assistant',
          content: 'Error, please try again later.',
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsWaitingResponse(false);
    }
  };

  const filteredCards = activeCategory === t("marketing.aiAssistant.all")
    ? suggestionCards
    : suggestionCards.filter(card => card.category === activeCategory);

  return (
    <Container maxWidth="lg" sx={{ py: 4, height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{display:'flex', marginTop:'30px', marginBottom:'35px'}}>
        <ArrowBackIos style={{cursor:'pointer', marginTop:'10px', marginRight:'20px', zIndex:1000}} onClick={()=>{setModule('')}}/>
      </Box>
        <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop:'-65px'
        }}>
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            mb: 1
        }}>
            <Typography variant="h4" fontWeight={700} sx={{
            letterSpacing: '-0.5px',
            color: theme.palette.text.primary
            }}>
            {t("marketing.ai")}
            </Typography>
        </Box>
        <Typography variant="body1" sx={{
            color: theme.palette.text.secondary,
            mb: 3,
            maxWidth: 500,
            textAlign: 'center',
            lineHeight: 1.6
        }}>
            {t("marketing.aiDescription")}
        </Typography>

        </Box>
      <Box sx={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 1,
        mb: 4,
        px: 2
      }}>
        {categories.map((category) => (
          <Chip
            key={category.label}
            label={category.label}
            icon={category.icon}
            clickable
            variant={activeCategory === category.label ? 'filled' : 'outlined'}
            onClick={() => setActiveCategory(category.label)}
            sx={{
              fontWeight: 600,
              borderColor: activeCategory === category.label ? category.color : theme.palette.divider,
              backgroundColor: activeCategory === category.label ? `${category.color}10` : 'transparent',
              color: activeCategory === category.label ? category.color : theme.palette.text.secondary,
              '& .MuiChip-icon': {
                color: activeCategory === category.label ? category.color : 'inherit'
              }
            }}
          />
        ))}
      </Box>

      <Box sx={{ flex: 1, overflowY: 'auto', mb: 3, px: 1 }}>
  {messages.length === 0 ? (
    <Grid container spacing={3}>
      {filteredCards.map((card, idx) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={idx} height={200} marginBottom={5}>
          <Grow in={true} timeout={(idx + 1) * 200}>
            <Paper
              elevation={selectedCard === card.title ? 8 : hoveredCard === card.title ? 6 : 2}
              onClick={() => {
                setSelectedCard(card.title);
                setInputValue(card.title);
              }}
              onMouseEnter={() => setHoveredCard(card.title)}
              onMouseLeave={() => setHoveredCard(null)}
              sx={{
                p: 2.5,
                borderRadius: 3,
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                height: '100%',
                border: selectedCard === card.title
                  ? `2px solid ${theme.palette.primary.main}`
                  : `1px solid ${theme.palette.divider}`,
                background: `linear-gradient(to bottom right, ${theme.palette.background.paper}, ${theme.palette.background.default})`,
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 6,
                },
              }}
            >
              {selectedCard === card.title && (
                <Box sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 4,
                  background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                }} />
              )}

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} sx={{
                    fontSize: 16,
                    color: i < Math.floor(card.stars) ? '#FFC107' : theme.palette.action.disabled
                  }} />
                ))}
                <Typography variant="caption" sx={{ ml: 0.5, color: theme.palette.text.secondary }}>
                  {card.stars}
                </Typography>
              </Box>

              <Typography
                variant="subtitle1"
                fontWeight={600}
                gutterBottom
                sx={{
                  color: selectedCard === card.title ? theme.palette.primary.main : 'inherit',
                  minHeight: '3em',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {card.title}
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {card.description}
              </Typography>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Chip
                  label={card.category}
                  size="small"
                  sx={{
                    backgroundColor: categories.find(c => c.label === card.category)?.color + '10',
                    color: categories.find(c => c.label === card.category)?.color,
                    fontWeight: 500,
                    fontSize: '0.7rem'
                  }}
                />
                <Fade in={hoveredCard === card.title || selectedCard === card.title}>
                  <ChevronRight sx={{
                    color: theme.palette.primary.main,
                    transition: 'all 0.3s ease'
                  }} />
                </Fade>
              </Box>
            </Paper>
          </Grow>
        </Grid>
      ))}
    </Grid>
  ) : (
    messages.map((msg) => (
      <Box
      key={msg.id}
      sx={{
        mb: 2,
        textAlign: msg.sender === 'user' ? 'right' : 'left',
        display: 'flex',
        justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start'
      }}
    >
      <Paper
        elevation={2}
        sx={{
          display: 'inline-block',
          p: 1.5,
          borderRadius: 2,
          maxWidth: '70%',
          backgroundColor: msg.sender === 'user'
            ? theme.palette.primary.main
            : theme.palette.grey[200],
          color: msg.sender === 'user'
            ? theme.palette.primary.contrastText
            : theme.palette.text.primary,
          minWidth: msg.id === 'typing' ? 200 : undefined
        }}
      >
        {msg.id === 'typing' ? (
          <Box>
            <Skeleton variant="text" width="80%" height={20} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="90%" height={20} />
          </Box>
        ) : (
          <Box>
            {msg.content.match(/\d+\.\s/) ? (
              <ul style={{ paddingLeft: '1.2rem', margin: 0 }}>
                {msg.content
                  .split(/\d+\.\s/)
                  .slice(1)
                  .map((item, index) => (
                    <li key={index}>
                      <Typography variant="body2" sx={{ lineHeight: 1.8 }}>
                        <strong>{index + 1}.</strong> {item.trim()}
                      </Typography>
                    </li>
                  ))}
              </ul>
            ) : (
              <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                {msg.content}
              </Typography>
            )}
          </Box>
        )}
      </Paper>
    </Box>
    ))
  )}
</Box>


<Paper
  elevation={6}
  sx={{
    p: 2,
    borderRadius: 3,
    background: `linear-gradient(to right, ${theme.palette.background.paper}, ${theme.palette.background.default})`,
    border: `1px solid ${theme.palette.divider}`,
    position: 'sticky',
    bottom: 20,
    mx: 2,
    mb: 2,
    backdropFilter: 'blur(8px)',
    boxShadow: theme.shadows[4],
    transition: 'all 0.3s ease',
    '&:hover': {
      boxShadow: theme.shadows[8],
      borderColor: theme.palette.primary.light
    }
  }}
>
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 2,
      position: 'relative',
    }}
  >
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
      InputProps={{
        sx: {
          borderRadius: 2,
          backgroundColor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          transition: 'all 0.3s ease',
          '&:hover': {
            borderColor: theme.palette.primary.main,
          },
          '&.Mui-focused': {
            borderColor: theme.palette.primary.main,
            boxShadow: `${theme.palette.primary.main} 0 0 0 2px`
          },
          '& .MuiOutlinedInput-notchedOutline': {
            border: 'none'
          }
        },
        startAdornment: (
          <Box sx={{
            display: 'flex',
            mr: 1,
            color: theme.palette.text.secondary
          }}>
            <SmartToy fontSize="small" />
          </Box>
        )
      }}
    />

    <Button
      variant="contained"
      color="primary"
      size="large"
      disabled={!inputValue && !selectedCard}
      onClick={handleSend}
      endIcon={<Send sx={{
        width:'16px',
        transition: 'transform 0.3s ease',
        transform: !inputValue && !selectedCard ? 'scale(1)' : 'scale(1.2)'
      }} />}
      sx={{
        px: 4,
        borderRadius: 2,
        textTransform: 'none',
        fontWeight: 700,
        minWidth: '140px',
        height: '56px',
        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: `${theme.palette.primary.light} 0 6px 16px`,
          background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
        },
        '&.Mui-disabled': {
          background: theme.palette.action.disabledBackground,
          boxShadow: 'none'
        }
      }}
    >
      {t("marketing.aiAssistant.send")}
    </Button>
  </Box>
</Paper>
    </Container>
  );
}