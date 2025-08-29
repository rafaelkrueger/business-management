import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  Avatar,
  Fade,
  styled,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  Psychology,
  Lightbulb,
  TrendingUp,
  AutoAwesome
} from '@mui/icons-material';

const InsightsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2)
}));

const InsightCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: '12px',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
  }
}));

const ReasoningCard = styled(InsightCard)(({ theme }) => ({
  backgroundColor: '#f3e5f5',
  border: '1px solid #ce93d8'
}));

const RecommendationsCard = styled(InsightCard)(({ theme }) => ({
  backgroundColor: '#e3f2fd',
  border: '1px solid #90caf9'
}));

const InsightHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(1.5),
  padding: theme.spacing(1),
  borderRadius: '8px',
  backgroundColor: 'rgba(255, 255, 255, 0.7)'
}));

const RecommendationItem = styled(ListItem)(({ theme }) => ({
  padding: theme.spacing(1, 0),
  borderRadius: '6px',
  marginBottom: theme.spacing(0.5),
  backgroundColor: 'rgba(255, 255, 255, 0.5)',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    transform: 'translateX(4px)'
  }
}));

interface EngineInsightsProps {
  reasoning: string;
  recommendations: string[];
  nextAction?: string;
  suggestedModule?: string;
}

const EngineInsights: React.FC<EngineInsightsProps> = ({
  reasoning,
  recommendations,
  nextAction,
  suggestedModule
}) => {
  if (!reasoning && (!recommendations || recommendations.length === 0)) {
    return null;
  }

  return (
    <Fade in timeout={1200}>
      <InsightsContainer>
        {reasoning && (
          <ReasoningCard>
            <InsightHeader>
              <Psychology sx={{ color: '#9c27b0', fontSize: '1.2rem' }} />
              <Typography variant="h6" sx={{
                fontWeight: 600,
                color: '#2c3e50',
                fontSize: '1rem'
              }}>
                🧠 Raciocínio Geral
              </Typography>
            </InsightHeader>
            <Typography variant="body2" sx={{
              color: '#2c3e50',
              lineHeight: 1.6,
              fontSize: '0.9rem'
            }}>
              {reasoning}
            </Typography>
          </ReasoningCard>
        )}

        {recommendations && recommendations.length > 0 && (
          <RecommendationsCard>
            <InsightHeader>
              <Typography variant="h6" sx={{
                fontWeight: 600,
                color: '#2c3e50',
                fontSize: '1rem'
              }}>
                💡 Recomendações
              </Typography>
            </InsightHeader>
            <List dense sx={{ p: 0 }}>
              {recommendations.map((recommendation, index) => (
                <RecommendationItem key={index}>
                  <ListItemIcon sx={{ minWidth: '28px' }}>
                    <Avatar sx={{
                      width: '20px',
                      height: '20px',
                      backgroundColor: '#2196f3',
                      color: '#ffffff',
                      fontSize: '0.7rem'
                    }}>
                      {index + 1}
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={recommendation}
                    sx={{
                      '& .MuiListItemText-primary': {
                        fontSize: '0.85rem',
                        color: '#2c3e50',
                        lineHeight: 1.4,
                        fontWeight: 500
                      }
                    }}
                  />
                </RecommendationItem>
              ))}
            </List>
          </RecommendationsCard>
        )}
      </InsightsContainer>
    </Fade>
  );
};

export default EngineInsights;
