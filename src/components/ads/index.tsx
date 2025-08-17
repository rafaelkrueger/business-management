import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box, Typography, Grid, Card, CardContent, Button, Chip, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl,
  InputLabel, Select, MenuItem, Alert, LinearProgress, Stack, Divider,
  List, ListItem, ListItemText, ListItemIcon, Avatar, Badge, Tooltip, Switch,
  FormControlLabel, Paper, alpha, useTheme, Tabs, Tab, Fab, SpeedDial,
  SpeedDialAction, SpeedDialIcon, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Accordion, AccordionSummary, AccordionDetails
} from '@mui/material';
import {
  Add as AddIcon, PlayArrow as PlayIcon, Pause as PauseIcon, Edit as EditIcon,
  Delete as DeleteIcon, Refresh as RefreshIcon, TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon, Warning as WarningIcon, CheckCircle as CheckCircleIcon,
  Error as ErrorIcon, Settings as SettingsIcon, Analytics as AnalyticsIcon,
  Campaign as CampaignIcon, Notifications as NotificationsIcon, Download as DownloadIcon,
  Email as EmailIcon, Facebook as FacebookIcon, Google as GoogleIcon, Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon, MoreVert as MoreVertIcon, Visibility as VisibilityIcon,
  Speed as SpeedIcon, AttachMoney as MoneyIcon, FilterList as FilterIcon, Search as SearchIcon,
  BarChart as BarChartIcon, Dashboard as DashboardIcon, ViewModule as ViewModuleIcon,
  ViewList as ViewListIcon, ViewComfy as ViewComfyIcon, ExpandMore as ExpandMoreIcon,
  KeyboardArrowUp as ArrowUpIcon, KeyboardArrowDown as ArrowDownIcon, Rocket as RocketIcon,
  Bolt as BoltIcon, LocalFireDepartment as FireIcon, EmojiEvents as TrophyIcon,
  WorkspacePremium as PremiumIcon, AccountTree as AccountTreeIcon, Insights as InsightsIcon,
  Receipt as ReceiptIcon, Sync as SyncIcon, Link as LinkIcon, LinkOff as LinkOffIcon,
  ArrowBackIos
} from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, Legend } from 'recharts';
import AdsService from '../../services/ads.service.ts';

// Paleta de cores moderna
const COLORS = {
  primary: 'rgb(51, 115, 198)',
  secondary: '#8B5CF6',
  accent: '#EC4899',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  background: '#F8FAFC',
  card: '#FFFFFF',
  textPrimary: '#1F2937',
  textSecondary: '#6B7280',
  border: '#E5E7EB'
};

interface AdsManagementProps {
  activeCompany?: string;
  setModule?: (module: string) => void;
}

interface Platform {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  status: 'connected' | 'disconnected' | 'error';
  accountName?: string;
  lastSync?: string;
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
}

interface Campaign {
  id: string;
  name: string;
  platform: string;
  status: 'active' | 'paused' | 'completed' | 'draft';
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  ctr: number;
  cpc: number;
  cpm: number;
  conversions: number;
  cpl: number;
  roas: number;
  startDate: string;
  endDate?: string;
  objective: string;
  targetAudience: string;
}

interface PerformanceData {
  totalSpent: number;
  totalImpressions: number;
  totalClicks: number;
  totalConversions: number;
  avgCtr: number;
  avgCpc: number;
  avgCpm: number;
  avgCpl: number;
  avgRoas: number;
  platformBreakdown: any[];
  dailyData: any[];
  weeklyTrend: any[];
}

export const AdsManagement: React.FC<AdsManagementProps> = ({ activeCompany, setModule }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [performanceData, setPerformanceData] = useState<PerformanceData>({
    totalSpent: 0,
    totalImpressions: 0,
    totalClicks: 0,
    totalConversions: 0,
    avgCtr: 0,
    avgCpc: 0,
    avgCpm: 0,
    avgCpl: 0,
    avgRoas: 0,
    platformBreakdown: [],
    dailyData: [],
    weeklyTrend: []
  });
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');
  const [alerts, setAlerts] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'cards'>('grid');

  // Mock data
  const mockPlatforms: Platform[] = [
    {
      id: 'google',
      name: 'Google Ads',
      icon: <GoogleIcon sx={{ color: '#4285F4', fontSize: 42, marginLeft:'-23px' }} />,
      color: '#4285F4',
      status: 'disconnected',
      accountName: 'Conta Principal',
      lastSync: '2 horas atrás',
      spend: 1250.50,
      impressions: 45000,
      clicks: 1200,
      conversions: 45
    },
    {
      id: 'facebook',
      name: 'Facebook Ads',
      icon: <FacebookIcon sx={{ color: '#1877F2', fontSize: 42, marginLeft:'-23px' }} />,
      color: '#1877F2',
      status: 'disconnected',
      accountName: 'Minha Empresa',
      lastSync: '1 hora atrás',
      spend: 890.30,
      impressions: 32000,
      clicks: 980,
      conversions: 32
    },
    {
      id: 'instagram',
      name: 'Instagram Ads',
      icon: <InstagramIcon sx={{ color: '#E1306C', fontSize: 42, marginLeft:'-23px' }} />,
      color: '#E1306C',
      status: 'disconnected',
      accountName: 'Minha Empresa',
      lastSync: '1 hora atrás',
      spend: 650.20,
      impressions: 28000,
      clicks: 750,
      conversions: 28
    },
         {
       id: 'tiktok',
       name: 'TikTok Ads',
        icon: <Box sx={{
          width: 42,
          height: 42,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#000000', marginLeft:'-23px'
        }}>
          <svg viewBox="0 0 24 24" fill="currentColor" width="82" height="82">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
          </svg>
        </Box>,
       color: '#000000',
       status: 'disconnected',
       spend: 0,
       impressions: 0,
       clicks: 0,
       conversions: 0
     },
     {
       id: 'twitter',
       name: 'X Ads',
               icon: <Box sx={{
          width: 32,
          height: 32,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#000000', marginLeft:'-23px'
        }}>
          <svg viewBox="0 0 24 24" fill="currentColor" width="82" height="82">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </Box>,
       color: '#000000',
       status: 'disconnected',
       spend: 0,
       impressions: 0,
       clicks: 0,
       conversions: 0
     }
  ];
  const mockCampaigns: Campaign[] = [
    {
      id: '1',
      name: 'Campanha Black Friday',
      platform: 'google',
      status: 'active',
      budget: 500,
      spent: 320.50,
      impressions: 15000,
      clicks: 450,
      ctr: 3.0,
      cpc: 0.71,
      cpm: 21.37,
      conversions: 18,
      cpl: 17.81,
      roas: 2.8,
      startDate: '2024-11-20',
      endDate: '2024-11-30',
      objective: 'Conversões',
      targetAudience: 'Interessados em promoções'
    },
    {
      id: '2',
      name: 'Awareness Brand',
      platform: 'facebook',
      status: 'active',
      budget: 300,
      spent: 180.20,
      impressions: 25000,
      clicks: 320,
      ctr: 1.28,
      cpc: 0.56,
      cpm: 7.21,
      conversions: 8,
      cpl: 22.53,
      roas: 1.5,
      startDate: '2024-11-15',
      objective: 'Reconhecimento',
      targetAudience: 'Público geral 25-45'
    },
    {
      id: '3',
      name: 'Instagram Stories',
      platform: 'instagram',
      status: 'paused',
      budget: 200,
      spent: 95.80,
      impressions: 12000,
      clicks: 180,
      ctr: 1.5,
      cpc: 0.53,
      cpm: 7.98,
      conversions: 5,
      cpl: 19.16,
      roas: 1.2,
      startDate: '2024-11-10',
      objective: 'Engajamento',
      targetAudience: 'Jovens 18-30'
    }
  ];
  const mockPerformanceData: PerformanceData = {
    totalSpent: 2790.00,
    totalImpressions: 105000,
    totalClicks: 2750,
    totalConversions: 105,
    avgCtr: 2.62,
    avgCpc: 1.01,
    avgCpm: 26.57,
    avgCpl: 26.57,
    avgRoas: 1.83,
    platformBreakdown: [
      { platform: 'Google Ads', spent: 1250.50, impressions: 45000, clicks: 1200, conversions: 45 },
      { platform: 'Facebook Ads', spent: 890.30, impressions: 32000, clicks: 980, conversions: 32 },
      { platform: 'Instagram Ads', spent: 650.20, impressions: 28000, clicks: 750, conversions: 28 }
    ],
    dailyData: [
      { date: '2024-11-20', spent: 120, conversions: 5 },
      { date: '2024-11-21', spent: 135, conversions: 7 },
      { date: '2024-11-22', spent: 98, conversions: 4 },
      { date: '2024-11-23', spent: 156, conversions: 8 },
      { date: '2024-11-24', spent: 142, conversions: 6 },
      { date: '2024-11-25', spent: 178, conversions: 9 },
      { date: '2024-11-26', spent: 165, conversions: 7 }
    ],
    weeklyTrend: [
      { week: 'Semana 1', spent: 850, conversions: 35 },
      { week: 'Semana 2', spent: 920, conversions: 42 },
      { week: 'Semana 3', spent: 1020, conversions: 48 }
    ]
  };
  const mockAlerts = [
    {
      id: '1',
      type: 'warning',
      title: 'Orçamento próximo do limite',
      message: 'Campanha "Black Friday" atingiu 85% do orçamento diário',
      timestamp: '2024-11-26T10:30:00Z'
    },
    {
      id: '2',
      type: 'error',
      title: 'CTR abaixo do esperado',
      message: 'Campanha "Awareness Brand" com CTR de 0.8% (meta: 2%)',
      timestamp: '2024-11-26T09:15:00Z'
    },
    {
      id: '3',
      type: 'info',
      title: 'Sincronização concluída',
      message: 'Dados do Google Ads atualizados com sucesso',
      timestamp: '2024-11-26T08:45:00Z'
    }
  ];

  useEffect(() => {
    loadData();
  }, [activeCompany]);

  const loadData = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      setPlatforms(mockPlatforms);
      setCampaigns(mockCampaigns);
      setPerformanceData(mockPerformanceData);
      setAlerts(mockAlerts);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthConnection = async (platform: string) => {
    try {
      let response;

      switch (platform) {
        case 'google':
          response = await AdsService.getGoogleOAuthUrl();
          break;
        case 'facebook':
          response = await AdsService.getFacebookOAuthUrl();
          break;
        case 'instagram':
          response = await AdsService.getFacebookOAuthUrl(); // Instagram usa Facebook OAuth
          break;
        case 'tiktok':
          response = await AdsService.getTikTokOAuthUrl();
          break;
        case 'twitter':
          response = await AdsService.getTwitterOAuthUrl();
          break;
        default:
          throw new Error('Plataforma não suportada');
      }

      // Abrir a URL de OAuth em uma nova janela
      const authWindow = window.open(
        response.url,
        'oauth',
        'width=600,height=700,scrollbars=yes,resizable=yes'
      );

      if (authWindow) {
        // Monitorar o callback
        const checkClosed = setInterval(() => {
          if (authWindow.closed) {
            clearInterval(checkClosed);
            // Aqui você pode implementar a lógica para verificar se a conexão foi bem-sucedida
            setAlerts(prev => [...prev, {
              id: Date.now(),
              type: 'info',
              message: 'Verificando conexão...',
              duration: 3000
            }]);
          }
        }, 1000);
      } else {
        // Fallback: abrir na mesma janela se popup for bloqueado
        window.location.href = response.url;
      }

    } catch (error: any) {
      setAlerts(prev => [...prev, {
        id: Date.now(),
        type: 'error',
        message: error.response?.data?.message || 'Erro ao iniciar OAuth',
        duration: 5000
      }]);
    }
  };

  const handleCreateCampaign = () => {
    setShowCreateDialog(true);
  };

  const handleToggleCampaign = async (campaignId: string) => {
    setCampaigns(prev => prev.map(campaign =>
      campaign.id === campaignId
        ? { ...campaign, status: campaign.status === 'active' ? 'paused' : 'active' }
        : campaign
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return COLORS.success;
      case 'paused': return COLORS.warning;
      case 'completed': return COLORS.primary;
      case 'draft': return COLORS.textSecondary;
      default: return COLORS.textSecondary;
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'google': return <GoogleIcon sx={{ color: '#4285F4', fontSize: 32 }} />;
      case 'facebook': return <FacebookIcon sx={{ color: '#1877F2', fontSize: 32 }} />;
      case 'instagram': return <InstagramIcon sx={{ color: '#E1306C', fontSize: 32 }} />;
      case 'tiktok': return (
        <Box sx={{
          width: 32,
          height: 32,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#000000'
        }}>
          <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
          </svg>
        </Box>
      );
      case 'twitter': return (
        <Box sx={{
          width: 32,
          height: 32,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#000000'
        }}>
          <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </Box>
      );
      case 'linkedin': return <LinkedInIcon sx={{ color: '#0077B5', fontSize: 32 }} />;
      default: return <CampaignIcon sx={{ color: COLORS.primary, fontSize: 32 }} />;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'google': return '#4285F4';
      case 'facebook': return '#1877F2';
      case 'instagram': return '#E1306C';
      case 'tiktok': return '#000000';
      case 'twitter': return '#000000';
      case 'linkedin': return '#0077B5';
      default: return COLORS.primary;
    }
  };

  const chartColors = [COLORS.primary, COLORS.secondary, COLORS.accent, COLORS.warning, COLORS.success];

  // Componente de card de métrica moderno
  const MetricCard = ({ title, value, icon, trend, subtitle, isHighlight = false }: any) => (
    <Card
      sx={{
        background: isHighlight
          ? `linear-gradient(135deg, ${COLORS.primary} 0%, ${alpha(COLORS.primary, 0.8)} 100%)`
          : COLORS.card,
        color: isHighlight ? 'white' : COLORS.textPrimary,
        borderRadius: '12px',
        p: 3,
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'transform 0.3s, box-shadow 0.3s',
                 '&:hover': {
           transform: 'translateY(-5px)',
           boxShadow: isHighlight
             ? '0 8px 30px rgba(51, 115, 198, 0.3)'
             : '0 8px 25px rgba(0,0,0,0.1)',
         }
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
        <Box>
          <Typography variant="body2" sx={{
            opacity: isHighlight ? 0.9 : 0.7,
            mb: 1,
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            fontSize: '0.75rem'
          }}>
            {title}
          </Typography>
          <Typography variant="h4" fontWeight="bold" mb={1}>
            {value}
          </Typography>
          {subtitle && (
            <Typography variant="body2" sx={{ opacity: isHighlight ? 0.8 : 0.6 }}>
              {subtitle}
            </Typography>
          )}
        </Box>

        <Box
          sx={{
            p: 1.5,
            borderRadius: '50%',
            background: isHighlight ? alpha('#fff', 0.2) : alpha(COLORS.primary, 0.1),
            color: isHighlight ? 'white' : COLORS.primary,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '14px',
            height: '14px',
            marginTop:'-10px'
          }}
        >
          {icon}
        </Box>
      </Box>

      {trend && (
        <Box display="flex" alignItems="center" mt={2}>
          {trend > 0 ? (
            <ArrowUpIcon sx={{ fontSize: 16, mr: 0.5, color: isHighlight ? 'white' : COLORS.success }} />
          ) : (
            <ArrowDownIcon sx={{ fontSize: 16, mr: 0.5, color: isHighlight ? 'white' : COLORS.error }} />
          )}
          <Typography
            variant="body2"
            sx={{
              opacity: 0.9,
              color: isHighlight ? 'white' : (trend > 0 ? COLORS.success : COLORS.error),
              fontWeight: 600,
              fontSize: '0.875rem'
            }}
          >
            {Math.abs(trend)}% vs mês anterior
          </Typography>
        </Box>
      )}
    </Card>
  );

  const PlatformCard = ({ platform }: { platform: Platform }) => (
    <Card
      onClick={() => {
        if (platform.status === 'disconnected') {
          handleOAuthConnection(platform.id);
        }
      }}
      sx={{
        background: COLORS.card,
        borderRadius: '16px',
        p: 4,
        height: '10%',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        border: 'none',
        cursor: platform.status === 'disconnected' ? 'pointer' : 'default',
        '&:hover': {
          boxShadow: platform.status === 'disconnected' ? '0 6px 24px rgba(0,0,0,0.08)' : '0 4px 20px rgba(0,0,0,0.04)',
          transform: platform.status === 'disconnected' ? 'translateY(-4px)' : 'none',
        }
      }}
    >
             {/* Header elegante */}
       <Box display="flex" alignItems="center" gap={3} mt={-3.5}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 34,
              height: 64
            }}
          >
            {platform.icon}
          </Box>
          <Box sx={{ flex: 1 }}>
            <Box display="flex" alignItems="center" gap={1}>
              <Typography
                variant="h3"
                fontWeight="300"
                color={COLORS.textPrimary}
                sx={{ letterSpacing: '-0.2px', fontSize:'15px' }}
              >
                {platform.name}
              </Typography>
                  {platform.status === 'connected' ? (
                 <LinkIcon sx={{ color: COLORS.primary, fontSize: 19, marginLeft:'10px' }} />
               ) : (
                 <LinkOffIcon sx={{ color: COLORS.error, fontSize: 19, marginLeft:'10px' }} />
               )}
            </Box>
            {platform.status === 'disconnected' && (
              <Typography
                variant="body2"
                color={COLORS.textSecondary}
                sx={{ mt: 1, fontSize: '0.75rem' }}
              >
                Click to connect
              </Typography>
            )}
          </Box>
       </Box>
    </Card>
  );

  // Componente de campanha elegante
  const CampaignCard = ({ campaign }: { campaign: Campaign }) => {
    const platformColor = getPlatformColor(campaign.platform);

    return (
      <Card
        sx={{
          background: COLORS.card,
          borderRadius: '12px',
          p: 3,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          transition: 'all 0.3s ease',
          borderLeft: `4px solid ${platformColor}`,
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
          }
        }}
      >
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <Avatar sx={{
            bgcolor: alpha(platformColor, 0.1),
            color: platformColor,
            width: 40,
            height: 40
          }}>
            {getPlatformIcon(campaign.platform)}
          </Avatar>
          <Box flex={1}>
            <Typography variant="subtitle1" fontWeight="bold" noWrap>
              {campaign.name}
            </Typography>
            <Typography variant="body2" color={COLORS.textSecondary}>
              {campaign.objective} • {campaign.targetAudience}
            </Typography>
          </Box>
        </Box>

        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography variant="body2" color={COLORS.textSecondary}>
            Orçamento
          </Typography>
          <Typography variant="body2" fontWeight="bold">
            R$ {campaign.budget}
          </Typography>
        </Box>

        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography variant="body2" color={COLORS.textSecondary}>
            Gasto
          </Typography>
          <Typography variant="body2" fontWeight="bold">
            R$ {campaign.spent}
          </Typography>
        </Box>

        <Box display="flex" justifyContent="space-between" mb={2}>
          <Typography variant="body2" color={COLORS.textSecondary}>
            Status
          </Typography>
          <Chip
            label={campaign.status}
            size="small"
            sx={{
              fontWeight: 600,
              bgcolor: alpha(getStatusColor(campaign.status), 0.1),
              color: getStatusColor(campaign.status)
            }}
          />
        </Box>

        <Box sx={{
          background: alpha(COLORS.primary, 0.05),
          borderRadius: '8px',
          p: 1.5,
          mb: 2,
          border: `1px solid ${alpha(COLORS.primary, 0.1)}`
        }}>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Typography variant="body2" color={COLORS.textSecondary} textAlign="center">
                ROAS
              </Typography>
              <Typography variant="h5" fontWeight="bold" textAlign="center" color={COLORS.primary}>
                {campaign.roas}x
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color={COLORS.textSecondary} textAlign="center">
                CTR
              </Typography>
              <Typography variant="h5" fontWeight="bold" textAlign="center">
                {campaign.ctr}%
              </Typography>
            </Grid>
          </Grid>
        </Box>

        <Box display="flex" gap={1} mt="auto">
          <Button
            variant="outlined"
            size="small"
            startIcon={campaign.status === 'active' ? <PauseIcon /> : <PlayIcon />}
            fullWidth
            onClick={() => handleToggleCampaign(campaign.id)}
            sx={{
              borderColor: COLORS.border,
              color: COLORS.textPrimary,
              '&:hover': { borderColor: COLORS.primary }
            }}
          >
            {campaign.status === 'active' ? 'Pausar' : 'Ativar'}
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={<EditIcon />}
            fullWidth
            sx={{
              borderColor: COLORS.border,
              color: COLORS.textPrimary,
              '&:hover': { borderColor: COLORS.primary }
            }}
          >
            Editar
          </Button>
        </Box>
      </Card>
    );
  };

  const tabItems = [
    { icon: <DashboardIcon />, label: 'Dashboard' },
    { icon: <AccountTreeIcon />, label: 'Campanhas' },
    { icon: <LinkIcon />, label: 'Plataformas' },
    { icon: <NotificationsIcon />, label: 'Alertas' },
    { icon: <ReceiptIcon />, label: 'Relatórios' },
  ];

  return (
    <Box sx={{
      background: COLORS.background,
      minHeight: '100vh',
      p: { xs: 2, md: 4 },
      maxWidth: '100vw',
      overflowX: 'hidden'
    }}>
      {loading && <LinearProgress sx={{ position: 'fixed', top: 0, left: 0, right: 0, height: 3 }} />}

      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
          <Box display={'flex'} flexDirection={'row'}>
                 <ArrowBackIos style={{cursor:'pointer', marginTop:'10px', marginRight:'10px'}} onClick={()=>{setModule?.('')}}/>
          <Box>
            <Typography variant="h4" fontWeight="400" color={COLORS.textPrimary} gutterBottom>
              Tráfego Pago
            </Typography>
          </Box>
          </Box>
                     <Button
             variant="contained"
             startIcon={<AddIcon />}
             onClick={handleCreateCampaign}
             sx={{
               borderRadius: '8px',
               background: COLORS.primary,
               fontWeight: 600,
               boxShadow: `0 4px 10px ${alpha(COLORS.primary, 0.3)}`,
               '&:hover': {
                 background: alpha(COLORS.primary, 0.9),
                 boxShadow: `0 6px 15px ${alpha(COLORS.primary, 0.4)}`,
               }
             }}
           >
             Nova Campanha
           </Button>
        </Box>

        {/* Tabs */}
        <Paper sx={{
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
        }}>
          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              background: COLORS.card,
              '& .MuiTab-root': {
                minHeight: 64,
                fontSize: '1rem',
                fontWeight: 500,
                textTransform: 'none',
                color: COLORS.textSecondary,
                '&.Mui-selected': {
                  color: COLORS.primary,
                }
              },
              '& .MuiTabs-indicator': {
                backgroundColor: COLORS.primary,
                height: 3,
              }
            }}
          >
            {tabItems.map((item, index) => (
              <Tab
                key={index}
                icon={item.icon}
                label={item.label}
                iconPosition="start"
              />
            ))}
          </Tabs>
        </Paper>
      </Box>

      {/* Content */}
      <Box>
        {/* Dashboard */}
        {activeTab === 0 && (
          <Box>
            <Grid container spacing={3} mb={4}>
                             <Grid item xs={12} md={3}>
                 <MetricCard
                   title="Total Investido"
                   value={`R$ ${performanceData.totalSpent.toFixed(2)}`}
                   icon={<MoneyIcon />}
                   trend={12.4}
                   isHighlight={true}
                 />
               </Grid>
               <Grid item xs={12} md={3}>
                 <MetricCard
                   title="CTR Médio"
                   value={`${performanceData.avgCtr.toFixed(2)}%`}
                   icon={<VisibilityIcon />}
                   trend={8.2}
                 />
               </Grid>
               <Grid item xs={12} md={3}>
                 <MetricCard
                   title="CPC Médio"
                   value={`R$ ${performanceData.avgCpc.toFixed(2)}`}
                   icon={<SpeedIcon />}
                   trend={-2.1}
                 />
               </Grid>
               <Grid item xs={12} md={3}>
                 <MetricCard
                   title="ROAS Médio"
                   value={`${performanceData.avgRoas.toFixed(1)}x`}
                   icon={<TrophyIcon />}
                   trend={15.7}
                 />
               </Grid>
            </Grid>

            <Grid container spacing={4} mt={10}>
              <Grid item xs={12} lg={8}>
                <Card sx={{
                  borderRadius: '12px',
                  p: 3,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                  background: COLORS.card
                }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="h5" fontWeight="bold">
                      Tendências de Performance
                    </Typography>
                    <Button variant="outlined" size="small">
                      Ver Detalhes
                    </Button>
                  </Box>
                  <ResponsiveContainer width="100%" height={350}>
                    <AreaChart data={performanceData.dailyData}>
                      <defs>
                        <linearGradient id="colorSpent" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.8}/>
                          <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={alpha(COLORS.border, 0.5)} />
                      <XAxis
                        dataKey="date"
                        stroke={COLORS.textSecondary}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis
                        stroke={COLORS.textSecondary}
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => `R$${value}`}
                      />
                      <RechartsTooltip
                        contentStyle={{
                          borderRadius: '8px',
                          border: `1px solid ${COLORS.border}`,
                          background: COLORS.card
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="spent"
                        stroke={COLORS.primary}
                        fill="url(#colorSpent)"
                        strokeWidth={3}
                        name="Gasto Diário"
                      />
                      <Line
                        type="monotone"
                        dataKey="conversions"
                        stroke={COLORS.success}
                        strokeWidth={3}
                        dot={{ strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: COLORS.success }}
                        name="Conversões"
                      />
                      <Legend />
                    </AreaChart>
                  </ResponsiveContainer>
                </Card>
              </Grid>
              <Grid item xs={12} lg={4}>
                <Card sx={{
                  borderRadius: '12px',
                  p: 3,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                  background: COLORS.card
                }}>
                  <Typography variant="h5" fontWeight="bold" mb={3}>
                    Distribuição por Plataforma
                  </Typography>
                  <ResponsiveContainer width="100%" height={350}>
                    <PieChart>
                      <Pie
                        data={performanceData.platformBreakdown}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ platform, percent }) => `${platform}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        innerRadius={60}
                        fill="#8884d8"
                        dataKey="spent"
                      >
                        {performanceData?.platformBreakdown?.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip
                        formatter={(value) => [`R$ ${value}`, 'Gasto']}
                        contentStyle={{
                          borderRadius: '8px',
                          border: `1px solid ${COLORS.border}`,
                          background: COLORS.card
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Campaigns */}
        {activeTab === 1 && (
          <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4} flexWrap="wrap" gap={2}>
              <Box>
                <Typography variant="h4" fontWeight="bold">
                  Campanhas
                </Typography>
                <Typography variant="body1" color={COLORS.textSecondary}>
                  {campaigns.filter(c => c.status === 'active').length} campanhas ativas
                </Typography>
              </Box>
              <Box display="flex" gap={1}>
                <Button
                  variant={viewMode === 'grid' ? 'contained' : 'outlined'}
                  startIcon={<ViewModuleIcon />}
                  onClick={() => setViewMode('grid')}
                  sx={{
                    minWidth: 'auto',
                    borderRadius: '8px',
                    ...(viewMode === 'grid' && {
                      background: alpha(COLORS.primary, 0.1),
                      color: COLORS.primary,
                      borderColor: COLORS.primary
                    })
                  }}
                />
                <Button
                  variant={viewMode === 'list' ? 'contained' : 'outlined'}
                  startIcon={<ViewListIcon />}
                  onClick={() => setViewMode('list')}
                  sx={{
                    minWidth: 'auto',
                    borderRadius: '8px',
                    ...(viewMode === 'list' && {
                      background: alpha(COLORS.primary, 0.1),
                      color: COLORS.primary,
                      borderColor: COLORS.primary
                    })
                  }}
                />
              </Box>
            </Box>

            {viewMode === 'list' ? (
              <Card sx={{
                borderRadius: '12px',
                p: 0,
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                background: COLORS.card
              }}>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ background: alpha(COLORS.primary, 0.05) }}>
                        <TableCell sx={{ fontWeight: 600 }}>Campanha</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Plataforma</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Gasto</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>ROAS</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Ações</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {campaigns.map((campaign) => (
                        <TableRow key={campaign.id} hover>
                          <TableCell>
                            <Box display="flex" alignItems="center" gap={1.5}>
                              <Avatar sx={{
                                bgcolor: alpha(getPlatformColor(campaign.platform), 0.1),
                                color: getPlatformColor(campaign.platform),
                                width: 32,
                                height: 32
                              }}>
                                {getPlatformIcon(campaign.platform)}
                              </Avatar>
                              <Box>
                                <Typography fontWeight="500">{campaign.name}</Typography>
                                <Typography variant="body2" color={COLORS.textSecondary}>
                                  {campaign.objective}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={campaign.platform.toUpperCase()}
                              size="small"
                              sx={{
                                bgcolor: alpha(getPlatformColor(campaign.platform), 0.1),
                                color: getPlatformColor(campaign.platform),
                                fontWeight: 500
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={campaign.status}
                              size="small"
                              sx={{
                                fontWeight: 600,
                                bgcolor: alpha(getStatusColor(campaign.status), 0.1),
                                color: getStatusColor(campaign.status)
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography fontWeight="500">R$ {campaign.spent}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography fontWeight="bold" color={COLORS.primary}>
                              {campaign.roas}x
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <IconButton
                              onClick={() => handleToggleCampaign(campaign.id)}
                              sx={{
                                mr: 1,
                                color: campaign.status === 'active' ? COLORS.warning : COLORS.success
                              }}
                            >
                              {campaign.status === 'active' ? <PauseIcon /> : <PlayIcon />}
                            </IconButton>
                            <IconButton sx={{ color: COLORS.textSecondary }}>
                              <EditIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Card>
            ) : (
              <Grid container spacing={3}>
                {campaigns.map((campaign) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={campaign.id}>
                    <CampaignCard campaign={campaign} />
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        )}

                 {/* Platforms */}
         {activeTab === 2 && (
           <Box>
             <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
               <Typography variant="h6" fontWeight="300">
                 Plataformas de Publicidade
               </Typography>
               <Button
                 variant="outlined"
                 startIcon={<LinkIcon />}
                 onClick={() => {
                   const disconnectedPlatform = platforms.find(p => p.status === 'disconnected');
                   if (disconnectedPlatform) {
                     handleOAuthConnection(disconnectedPlatform.id);
                   }
                 }}
                 disabled={!platforms.some(p => p.status === 'disconnected')}
                 sx={{
                   borderRadius: '8px',
                   borderColor: COLORS.primary,
                   color: COLORS.primary,
                   fontWeight: 600,
                   '&:hover': {
                     borderColor: alpha(COLORS.primary, 0.8),
                     backgroundColor: alpha(COLORS.primary, 0.05)
                   }
                 }}
               >
                 Conectar com OAuth
               </Button>
             </Box>
            <Grid container spacing={3}>
              {platforms.map((platform) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={platform.id}>
                  <PlatformCard platform={platform} />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Alerts */}
        {activeTab === 3 && (
          <Box>
            <Typography variant="h4" fontWeight="bold" mb={4}>
              Alertas e Notificações
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Card sx={{
                  borderRadius: '12px',
                  p: 3,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                  background: COLORS.card
                }}>
                  <Typography variant="h5" fontWeight="bold" mb={3}>
                    Alertas Recentes
                  </Typography>
                  <Stack spacing={2}>
                    {alerts.map((alert) => (
                      <Alert
                        key={alert.id}
                        severity={alert.type}
                        sx={{
                          borderRadius: '8px',
                          alignItems: 'flex-start',
                          borderLeft: `4px solid ${
                            alert.type === 'error' ? COLORS.error :
                            alert.type === 'warning' ? COLORS.warning : COLORS.primary
                          }`
                        }}
                        iconMapping={{
                          error: <ErrorIcon fontSize="inherit" />,
                          warning: <WarningIcon fontSize="inherit" />,
                          info: <CheckCircleIcon fontSize="inherit" />
                        }}
                      >
                        <Box>
                          <Typography variant="subtitle1" fontWeight="bold" mb={0.5}>
                            {alert.title}
                          </Typography>
                          <Typography variant="body2" mb={1}>
                            {alert.message}
                          </Typography>
                                                     <Typography variant="caption" color={COLORS.textSecondary}>
                             {new Date(alert.timestamp).toLocaleString('pt-BR')}
                           </Typography>
                        </Box>
                      </Alert>
                    ))}
                  </Stack>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card sx={{
                  borderRadius: '12px',
                  p: 3,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                  background: COLORS.card,
                  height: '100%'
                }}>
                  <Typography variant="h5" fontWeight="bold" mb={3}>
                    Configurações de Alertas
                  </Typography>
                  <Stack spacing={3}>
                    <Box>
                      <Typography variant="body1" fontWeight="500" mb={1}>
                        Notificações por Email
                      </Typography>
                      <FormControlLabel
                        control={<Switch defaultChecked color="primary" />}
                        label="Receber alertas por email"
                      />
                    </Box>
                    <Divider />
                    <Box>
                      <Typography variant="body1" fontWeight="500" mb={1}>
                        Frequência de Relatórios
                      </Typography>
                      <FormControl fullWidth size="small">
                        <InputLabel>Frequência</InputLabel>
                        <Select
                          label="Frequência"
                          defaultValue="weekly"
                        >
                          <MenuItem value="daily">Diário</MenuItem>
                          <MenuItem value="weekly">Semanal</MenuItem>
                          <MenuItem value="monthly">Mensal</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                    <Divider />
                    <Box>
                      <Typography variant="body1" fontWeight="500" mb={1}>
                        Limite de Orçamento
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        type="number"
                        defaultValue="80"
                        InputProps={{
                          endAdornment: <Typography variant="body2">%</Typography>
                        }}
                      />
                    </Box>
                  </Stack>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Reports */}
        {activeTab === 4 && (
          <Box>
            <Typography variant="h4" fontWeight="bold" mb={4}>
              Relatórios
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card sx={{
                  borderRadius: '12px',
                  p: 3,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                  background: COLORS.card
                }}>
                  <Typography variant="h5" fontWeight="bold" mb={3}>
                    Exportar Dados
                  </Typography>
                  <Stack spacing={2}>
                    <Button
                      variant="outlined"
                      startIcon={<DownloadIcon />}
                      fullWidth
                      sx={{
                        justifyContent: 'flex-start',
                        borderRadius: '8px',
                        py: 1.5,
                        borderColor: COLORS.border,
                        color: COLORS.textPrimary,
                        '&:hover': { borderColor: COLORS.primary }
                      }}
                    >
                      Campanhas (CSV)
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<DownloadIcon />}
                      fullWidth
                      sx={{
                        justifyContent: 'flex-start',
                        borderRadius: '8px',
                        py: 1.5,
                        borderColor: COLORS.border,
                        color: COLORS.textPrimary,
                        '&:hover': { borderColor: COLORS.primary }
                      }}
                    >
                      Métricas (Excel)
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<EmailIcon />}
                      fullWidth
                      sx={{
                        justifyContent: 'flex-start',
                        borderRadius: '8px',
                        py: 1.5,
                        borderColor: COLORS.border,
                        color: COLORS.textPrimary,
                        '&:hover': { borderColor: COLORS.primary }
                      }}
                    >
                      Relatório Semanal
                    </Button>
                  </Stack>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card sx={{
                  borderRadius: '12px',
                  p: 3,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                  background: COLORS.card
                }}>
                  <Typography variant="h5" fontWeight="bold" mb={3}>
                    Relatório de Performance
                  </Typography>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={performanceData?.platformBreakdown || []}>
                      <CartesianGrid strokeDasharray="3 3" stroke={alpha(COLORS.border, 0.5)} vertical={false} />
                      <XAxis dataKey="platform" stroke={COLORS.textSecondary} />
                      <YAxis stroke={COLORS.textSecondary} />
                      <RechartsTooltip
                        contentStyle={{
                          borderRadius: '8px',
                          border: `1px solid ${COLORS.border}`,
                          background: COLORS.card
                        }}
                      />
                      <Bar dataKey="spent" name="Gasto" fill={COLORS.primary} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      mt: 3,
                      borderRadius: '8px',
                      background: COLORS.primary,
                      fontWeight: 600,
                      '&:hover': {
                        background: alpha(COLORS.primary, 0.9),
                        boxShadow: `0 4px 15px ${alpha(COLORS.primary, 0.3)}`
                      }
                    }}
                  >
                    Gerar Relatório Completo
                  </Button>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}
      </Box>

      {/* Speed Dial */}
             <SpeedDial
         ariaLabel="Ações rápidas"
         sx={{ position: 'fixed', bottom: 32, right: 32 }}
         icon={<SpeedDialIcon />}
         FabProps={{
           sx: {
             background: COLORS.primary,
             color: 'white',
             '&:hover': {
               background: alpha(COLORS.primary, 0.9),
             }
           }
         }}
       >
        <SpeedDialAction
          icon={<AddIcon />}
          tooltipTitle="Nova Campanha"
          onClick={handleCreateCampaign}
          FabProps={{ sx: { background: COLORS.card, color: COLORS.primary } }}
        />
        <SpeedDialAction
          icon={<RefreshIcon />}
          tooltipTitle="Atualizar"
          onClick={loadData}
          FabProps={{ sx: { background: COLORS.card, color: COLORS.primary } }}
        />
        <SpeedDialAction
          icon={<InsightsIcon />}
          tooltipTitle="Relatório"
          FabProps={{ sx: { background: COLORS.card, color: COLORS.primary } }}
        />
      </SpeedDial>

      {/* Dialogs */}
             <Dialog
         open={showCreateDialog}
         onClose={() => setShowCreateDialog(false)}
         maxWidth="md"
         fullWidth
         PaperProps={{
           sx: {
             borderRadius: '16px',
             background: COLORS.card
           }
         }}
      >
                 <DialogTitle sx={{
           background: COLORS.primary,
           color: 'white',
           fontWeight: 600
         }}>
           Nova Campanha
         </DialogTitle>
        <DialogContent sx={{ p: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nome da Campanha"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Plataforma</InputLabel>
                <Select label="Plataforma">
                  <MenuItem value="google">
                    <Box display="flex" alignItems="center" gap={1}>
                      <GoogleIcon sx={{ color: '#4285F4' }} />
                      Google Ads
                    </Box>
                  </MenuItem>
                  <MenuItem value="facebook">
                    <Box display="flex" alignItems="center" gap={1}>
                      <FacebookIcon sx={{ color: '#1877F2' }} />
                      Facebook Ads
                    </Box>
                  </MenuItem>
                  <MenuItem value="instagram">
                    <Box display="flex" alignItems="center" gap={1}>
                      <InstagramIcon sx={{ color: '#E1306C' }} />
                      Instagram Ads
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Orçamento Diário" type="number" />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Data de Início" type="date" InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Data de Término" type="date" InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Objetivo</InputLabel>
                <Select label="Objetivo">
                  <MenuItem value="awareness">Reconhecimento de Marca</MenuItem>
                  <MenuItem value="traffic">Tráfego para o Site</MenuItem>
                  <MenuItem value="conversions">Conversões</MenuItem>
                  <MenuItem value="leads">Geração de Leads</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setShowCreateDialog(false)}
            sx={{
              color: COLORS.textSecondary,
              fontWeight: 500
            }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={() => setShowCreateDialog(false)}
            sx={{
              background: COLORS.primary,
              fontWeight: 600,
              borderRadius: '8px',
              px: 3,
              '&:hover': {
                background: alpha(COLORS.primary, 0.9),
                boxShadow: `0 4px 15px ${alpha(COLORS.primary, 0.3)}`
              }
            }}
          >
            Criar Campanha
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdsManagement;