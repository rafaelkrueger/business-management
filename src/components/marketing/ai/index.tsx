import React, { useState } from 'react';
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
  Avatar,
  Badge,
  IconButton,
  Fade,
  Grow
} from '@mui/material';
import {
  SmartToy,
  Send,
  HelpOutline,
  TrendingUp,
  Group,
  Campaign,
  Star,
  ChevronRight
} from '@mui/icons-material';

const categories = [
  { label: 'Todos', icon: <Star />, color: '#6366F1' },
  { label: 'Sugestões', icon: <HelpOutline />, color: '#0A6CCC' },
  { label: 'Performance', icon: <TrendingUp />, color: '#059669' },
  { label: 'Equipes', icon: <Group />, color: '#F97316' },
  { label: 'Campanhas', icon: <Campaign />, color: '#8B5CF6' }
];

const suggestionCards = [
  {
    title: 'Como melhorar meu engajamento?',
    description: 'Descubra estratégias baseadas em dados para aumentar suas taxas de interação em até 300%',
    category: 'Sugestões',
    stars: 4.8
  },
  {
    title: 'Quais canais devo priorizar?',
    description: 'Análise comparativa dos canais com melhor ROI para seu segmento',
    category: 'Performance',
    stars: 4.5
  },
  {
    title: 'Guia completo: Campanhas de e-mail',
    description: 'Do briefing à análise de resultados em 7 passos simples',
    category: 'Campanhas',
    stars: 4.9
  },
  {
    title: 'Qualificação de leads avançada',
    description: 'Saiba como identificar e classificar seus leads de forma eficiente',
    category: 'Sugestões',
    stars: 4.7
  },
  {
    title: 'Segmentação precisa',
    description: 'Técnicas avançadas para dividir seu público-alvo com precisão',
    category: 'Performance',
    stars: 4.6
  },
  {
    title: 'Cronograma ideal para Instagram',
    description: 'Melhores horários e frequência baseados em seus dados históricos',
    category: 'Campanhas',
    stars: 4.4
  },
  {
    title: 'Conteúdos virais para LinkedIn',
    description: '10 modelos prontos para posts profissionais de alto engajamento',
    category: 'Sugestões',
    stars: 4.8
  },
  {
    title: 'Análise do funil de vendas',
    description: 'Métricas essenciais e pontos de otimização para cada etapa',
    category: 'Performance',
    stars: 4.7
  }
];

export default function PremiumMarketingAssistant() {
  const theme = useTheme();
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [inputValue, setInputValue] = useState('');
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const handleSend = () => {
    if (selectedCard || inputValue.trim()) {
      console.log('Mensagem enviada:', selectedCard || inputValue);
      setInputValue('');
      setSelectedCard(null);
    }
  };

  const filteredCards = activeCategory === 'Todos'
    ? suggestionCards
    : suggestionCards.filter(card => card.category === activeCategory);

  return (
    <Container maxWidth="lg" sx={{ py: 4, height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        mb: 4,
        px: 2,
        pt: 4
        }}>

        {/* Título principal */}
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
            Marketing Assistant
            </Typography>
        </Box>

        {/* Subtítulo */}
        <Typography variant="body1" sx={{
            color: theme.palette.text.secondary,
            mb: 3,
            maxWidth: 500,
            textAlign: 'center',
            lineHeight: 1.6
        }}>
            Obtenha insights inteligentes e recomendações personalizadas
        </Typography>

        </Box>

      {/* Categorias */}
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

      {/* Cards de Sugestões */}
      <Box sx={{ flex: 1, overflowY: 'auto', mb: 3, px: 1}}>
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
                  {/* Efeito de brilho ao selecionar */}
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

                  {/* Rating */}
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 1
                  }}>
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
      </Box>

      {/* Área de Input */}
{/* Área de Input Premium */}
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
    {/* TextField Aprimorado */}
    <TextField
      fullWidth
      variant="outlined"
      placeholder={selectedCard ? "✨ Pronto para enviar sua dúvida..." : "💡 Digite sua pergunta ou selecione uma sugestão acima..."}
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

    {/* Botão Premium */}
    <Button
      variant="contained"
      color="primary"
      size="large"
      disabled={!inputValue && !selectedCard}
      onClick={handleSend}
      endIcon={<Send sx={{
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
        '&:active': {
          transform: 'translateY(0)'
        },
        '&.Mui-disabled': {
          background: theme.palette.action.disabledBackground,
          boxShadow: 'none'
        }
      }}
    >
      Enviar
    </Button>
  </Box>

  {/* Dica flutuante */}
  {!inputValue && !selectedCard && (
    <Fade in={!inputValue && !selectedCard}>
      <Typography
        variant="caption"
        sx={{
          display: 'block',
          textAlign: 'center',
          mt: 1,
          color: theme.palette.text.secondary,
          fontStyle: 'italic'
        }}
      >
        Selecione uma sugestão ou digite sua pergunta
      </Typography>
    </Fade>
  )}
</Paper>
    </Container>
  );
}