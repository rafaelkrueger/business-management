import { styled, alpha } from '@mui/material';
import { Box, Card, Paper } from '@mui/material';

// Definição de cores e gradientes modernos
export const gradients = {
  primary: 'linear-gradient(135deg, #6B8CEF 0%, #5374E7 100%)',
  success: 'linear-gradient(135deg, #53E7B7 0%, #39D2A4 100%)',
  warning: 'linear-gradient(135deg, #FFB74D 0%, #FF9800 100%)',
  info: 'linear-gradient(135deg, #64B5F6 0%, #2196F3 100%)',
  purple: 'linear-gradient(135deg, #B388FF 0%, #7C4DFF 100%)',
  teal: 'linear-gradient(135deg, #4DB6AC 0%, #009688 100%)'
};

export const ModuleCard = styled(Card)(({ theme, active, completed }: any) => ({
  height: '100%',
  minHeight: 280,
  position: 'relative',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  background: theme.palette.mode === 'light'
    ? 'rgba(255, 255, 255, 0.9)'
    : alpha(theme.palette.background.paper, 0.8),
  backdropFilter: 'blur(12px)',
  borderRadius: 20,
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: `0 12px 28px ${alpha(theme.palette.primary.main, 0.12)}`,
    '& .module-icon': {
      transform: 'scale(1.1)',
    }
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    background: completed
      ? gradients.success
      : active
        ? gradients.primary
        : 'transparent'
  }
}));

export const ModuleIcon = styled(Box)(({ theme, gradient }: any) => ({
  width: 56,
  height: 56,
  borderRadius: 16,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: gradient || gradients.primary,
  color: '#fff',
  marginBottom: theme.spacing(2),
  transition: 'transform 0.3s ease',
  boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.2)}`,
}));

export const StatsCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2.5),
  background: theme.palette.mode === 'light'
    ? 'rgba(255, 255, 255, 0.8)'
    : alpha(theme.palette.background.paper, 0.6),
  backdropFilter: 'blur(8px)',
  borderRadius: 16,
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2)
}));

export const DashboardContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  '& .MuiTypography-h4': {
    fontWeight: 700,
    marginBottom: theme.spacing(1)
  },
  '& .MuiTypography-subtitle1': {
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(3)
  }
}));