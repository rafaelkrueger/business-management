import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  Avatar,
  Fade,
  styled
} from '@mui/material';
import {
  Psychology,
  Lightbulb,
  TrendingUp,
  Schedule
} from '@mui/icons-material';
import { ThoughtStep } from '../../services/engine-ai.service';

const ThoughtStepContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(1.5),
  borderLeft: '4px solid #4674af',
  borderRadius: '8px',
  backgroundColor: '#f8f9fa',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateX(4px)',
    boxShadow: '0 4px 12px rgba(70, 116, 175, 0.15)',
    backgroundColor: '#f0f4f8'
  }
}));

const StepHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(1.5),
  gap: theme.spacing(1)
}));

const StepNumber = styled(Chip)(({ theme }) => ({
  backgroundColor: '#4674af',
  color: '#ffffff',
  fontWeight: 600,
  fontSize: '0.8rem',
  height: '24px',
  minWidth: '32px'
}));

const Timestamp = styled(Typography)(({ theme }) => ({
  fontSize: '0.75rem',
  color: '#6c757d',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5)
}));

const ThoughtContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5)
}));

const ThoughtSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: theme.spacing(1),
  padding: theme.spacing(1),
  borderRadius: '6px',
  backgroundColor: '#ffffff',
  border: '1px solid #e9ecef'
}));

const ThoughtIcon = styled(Avatar)(({ theme }) => ({
  width: '24px',
  height: '24px',
  backgroundColor: '#4674af',
  color: '#ffffff',
  fontSize: '0.75rem',
  flexShrink: 0,
  marginTop: '2px'
}));

interface ThoughtProcessDisplayProps {
  thoughtProcess: ThoughtStep[];
}

const ThoughtProcessDisplay: React.FC<ThoughtProcessDisplayProps> = ({ thoughtProcess }) => {
  if (!thoughtProcess || thoughtProcess.length === 0) {
    return null;
  }

  return (
    <Fade in timeout={800}>
      <Box sx={{ mt: 2, mb: 2 }}>
        {thoughtProcess.map((thought, index) => (
          <ThoughtStepContainer key={index}>
            <StepHeader>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <StepNumber label={`${thought.step}`} />
                <Typography variant="subtitle2" sx={{
                  fontWeight: 600,
                  color: '#2c3e50',
                  fontSize: '0.9rem'
                }}>
                  Passo {thought.step}
                </Typography>
              </Box>
              <Timestamp>
                <Schedule sx={{ fontSize: '0.75rem' }} />
                {new Date(thought.timestamp).toLocaleTimeString('pt-BR', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit'
                })}
              </Timestamp>
            </StepHeader>

            <ThoughtContent>
              <ThoughtSection>
                <ThoughtIcon>
                  <Psychology sx={{ fontSize: '0.75rem' }} />
                </ThoughtIcon>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" sx={{
                    fontWeight: 600,
                    color: '#4674af',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    fontSize: '0.7rem'
                  }}>
                    Pensamento
                  </Typography>
                  <Typography variant="body2" sx={{
                    color: '#2c3e50',
                    lineHeight: 1.5,
                    mt: 0.5
                  }}>
                    {thought.thought}
                  </Typography>
                </Box>
              </ThoughtSection>

              <ThoughtSection>
                <ThoughtIcon>
                  <TrendingUp sx={{ fontSize: '0.75rem' }} />
                </ThoughtIcon>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" sx={{
                    fontWeight: 600,
                    color: '#4674af',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    fontSize: '0.7rem'
                  }}>
                    Ação
                  </Typography>
                  <Typography variant="body2" sx={{
                    color: '#2c3e50',
                    lineHeight: 1.5,
                    mt: 0.5
                  }}>
                    {thought.action}
                  </Typography>
                </Box>
              </ThoughtSection>

              <ThoughtSection>
                <ThoughtIcon>
                  <Lightbulb sx={{ fontSize: '0.75rem' }} />
                </ThoughtIcon>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" sx={{
                    fontWeight: 600,
                    color: '#4674af',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    fontSize: '0.7rem'
                  }}>
                    Raciocínio
                  </Typography>
                  <Typography variant="body2" sx={{
                    color: '#2c3e50',
                    lineHeight: 1.5,
                    mt: 0.5
                  }}>
                    {thought.reasoning}
                  </Typography>
                </Box>
              </ThoughtSection>
            </ThoughtContent>
          </ThoughtStepContainer>
        ))}
      </Box>
    </Fade>
  );
};

export default ThoughtProcessDisplay;
