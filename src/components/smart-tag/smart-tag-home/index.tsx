import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  useTheme,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
  Collapse,
  IconButton,
  Tooltip as Tp,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@mui/material';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { FiLink, FiPackage, FiMessageCircle, FiCalendar, FiCreditCard, FiCpu } from 'react-icons/fi';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Brain, BookOpen, Monitor, TrendingUp, Calendar, CreditCard, MessageSquare, Package, ChevronDown, ChevronUp, Wrench } from 'lucide-react';
import TrackingService from '../../../services/tracking.service.ts';
import AiAssistantModal from '../../ai-assistant-modal/index.tsx';
import { useTranslation } from 'react-i18next';
import { ContentCopy } from '@mui/icons-material';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const TrackingHome: React.FC<{ activeCompany: string; userData: any; apiKey: string; tagStatus: boolean; tagData:any }> = ({
  activeCompany,
  userData,
  apiKey,
  tagStatus,
  tagData,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const [rawData, setRawData] = useState<any[]>([]);
  const [performanceData, setPerformanceData] = useState<any>(null);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  const [aiAssistant, setAiAssistant] = useState(false);
  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);

  const handleOpenModal = (featureTitle: string) => {
    setSelectedFeature(featureTitle);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedFeature(null);
  };



  const features = [
    { icon: <FiLink size={34} />, title: t('tracking.features.siteIntegration') },
    { icon: <FiPackage size={34} />, title: t('tracking.features.productIntegration') },
    { icon: <FiMessageCircle size={34} />, title: t('tracking.features.chatBotIntegration') },
    { icon: <FiCalendar size={34} />, title: t('tracking.features.calendarIntegration') },
    { icon: <FiCreditCard size={34} />, title: t('tracking.features.paymentIntegration') },
    { icon: <FiCpu size={34} />, title: t('tracking.features.aiIntegration') },
  ];

  const [lineData, setLineData] = useState({
    labels: [] as string[],
    datasets: [
      {
        label: t('tracking.home.home.siteVisits'),
        data: [] as number[],
        borderColor: theme.palette.primary.main,
        backgroundColor: 'rgba(75,192,192,0.2)',
        tension: 0.3,
      },
      {
        label: t('tracking.home.home.newUsers'),
        data: [] as number[],
        borderColor: theme.palette.success.main,
        backgroundColor: 'rgba(76,175,80,0.2)',
        tension: 0.3,
      },
    ],
  });

  const [weeklyVisitsCount, setWeeklyVisitsCount] = useState(0);
  const [lastWeekVisitsCount, setLastWeekVisitsCount] = useState(0);

  useEffect(() => {
    async function fetchPageViewData() {
      try {
        const response = await TrackingService.glancePageView(apiKey);
        const data = response.data;
        setRawData(data);

        const now = new Date();
        const dayOfWeek = now.getDay();
        const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
        const startOfCurrentWeek = new Date(now);
        startOfCurrentWeek.setHours(0, 0, 0, 0);
        startOfCurrentWeek.setDate(now.getDate() + diffToMonday);

        const startOfPreviousWeek = new Date(startOfCurrentWeek);
        startOfPreviousWeek.setDate(startOfCurrentWeek.getDate() - 7);

        const weekly = data.filter((item: any) => new Date(item.createdAt) >= startOfCurrentWeek).length;
        const lastWeek = data.filter((item: any) => {
          const d = new Date(item.createdAt);
          return d >= startOfPreviousWeek && d < startOfCurrentWeek;
        }).length;

        setWeeklyVisitsCount(weekly);
        setLastWeekVisitsCount(lastWeek);
      } catch (error) {
        console.error(t('tracking.home.errors.fetchPageViewData'), error);
      }
    }

    async function fetchPerformanceData() {
      try {
        const response = await TrackingService.glancePerformance(apiKey);
        console.log('Performance data received:', response.data);
        setPerformanceData(response.data);
      } catch (error) {
        console.error(t('tracking.home.errors.fetchPerformanceData'), error);
      }
    }

    if (apiKey) {
      fetchPageViewData();
      fetchPerformanceData();
    }
  }, [apiKey, t]);

  useEffect(() => {
    if (rawData.length === 0) return;

    let labels: string[] = [];
    let counts: number[] = [];
    let newUsersCounts: number[] = [];

    if (timeRange === 'week') {
      const now = new Date();
      const dayOfWeek = now.getDay();
      const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      const startOfCurrentWeek = new Date(now);
      startOfCurrentWeek.setHours(0, 0, 0, 0);
      startOfCurrentWeek.setDate(now.getDate() + diffToMonday);

      labels = [t('tracking.home.days.mon'), t('tracking.home.days.tue'), t('tracking.home.days.wed'), t('tracking.home.days.thu'), t('tracking.home.days.fri'), t('tracking.home.days.sat'), t('tracking.home.days.sun')];

      const grouped: { [key: string]: number } = {};
      const groupedNewUsers: { [key: string]: number } = {};
      labels.forEach((day) => {
        grouped[day] = 0;
        groupedNewUsers[day] = 0;
      });

      const weekData = rawData.filter((item: any) => new Date(item.createdAt) >= startOfCurrentWeek);

      weekData.forEach((item: any) => {
        const d = new Date(item.createdAt);
        const jsDay = d.getDay();
        // Se jsDay for 0, usamos o label para domingo
        const label = jsDay === 0 ? t('tracking.home.days.sun') : labels[jsDay - 1];
        grouped[label] += 1;
        if (item.isNewUser) {
          groupedNewUsers[label] += 1;
        }
      });

      counts = labels.map((day) => grouped[day]);
      newUsersCounts = labels.map((day) => groupedNewUsers[day]);
    } else if (timeRange === 'month') {
      const grouped: { [key: string]: number } = {};
      const groupedNewUsers: { [key: string]: number } = {};
      rawData.forEach((item: any) => {
        const date = new Date(item.createdAt);
        const label = `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
        grouped[label] = (grouped[label] || 0) + 1;
        if (item.isNewUser) {
          groupedNewUsers[label] = (groupedNewUsers[label] || 0) + 1;
        }
      });
      labels = Object.keys(grouped).sort((a, b) => new Date(a + '-01').getTime() - new Date(b + '-01').getTime());
      counts = labels.map((label) => grouped[label] || 0);
      newUsersCounts = labels.map((label) => groupedNewUsers[label] || 0);
    } else if (timeRange === 'year') {
      const grouped: { [key: string]: number } = {};
      const groupedNewUsers: { [key: string]: number } = {};
      rawData.forEach((item: any) => {
        const date = new Date(item.createdAt);
        const label = `${date.getFullYear()}`;
        grouped[label] = (grouped[label] || 0) + 1;
        if (item.isNewUser) {
          groupedNewUsers[label] = (groupedNewUsers[label] || 0) + 1;
        }
      });
      labels = Object.keys(grouped).sort((a, b) => Number(a) - Number(b));
      counts = labels.map((label) => grouped[label] || 0);
      newUsersCounts = labels.map((label) => groupedNewUsers[label] || 0);
    }

    setLineData({
      labels,
      datasets: [
        {
          label: t('tracking.home.home.siteVisits'),
          data: counts,
          borderColor: theme.palette.primary.main,
          backgroundColor: 'rgba(75,192,192,0.2)',
          tension: 0.3,
        },
        {
          label: t('tracking.home.home.newUsers'),
          data: newUsersCounts,
          borderColor: theme.palette.success.main,
          backgroundColor: 'rgba(76,175,80,0.2)',
          tension: 0.3,
        },
      ],
    });
  }, [rawData, timeRange, theme.palette.primary.main, t]);

  const barData = {
    labels: [t('tracking.home.seoMetrics.seoScore'), t('tracking.home.seoMetrics.performance'), t('tracking.home.seoMetrics.accessibility'), t('tracking.home.seoMetrics.bestPractices')],
    datasets: [
      {
        label: t('tracking.home.seoMetrics.scoreLabel'),
        data: performanceData
          ? [
              performanceData.scores.seoScore,
              performanceData.scores.performanceScore,
              performanceData.scores.accessibilityScore,
              performanceData.scores.bestPracticesScore,
            ]
          : [0, 0, 0, 0],
        backgroundColor: [
          theme.palette.primary.light,
          theme.palette.secondary.light,
          theme.palette.success.light,
          theme.palette.warning.light,
        ],
      },
    ],
  };

  const barOptions = {
    indexAxis: 'y' as const,
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: t('tracking.home.seoMetrics.title') },
    },
  };

  const pieData = {
    labels: [t('tracking.home.devices.desktop'), t('tracking.home.devices.mobile'), t('tracking.home.devices.tablet')],
    datasets: [
      {
        label: t('tracking.home.devices.label'),
        data: [55, 35, 10],
        backgroundColor: [
          theme.palette.primary.main,
          theme.palette.secondary.main,
          theme.palette.tertiary ? theme.palette.tertiary.main : '#FFCE56',
        ],
        hoverOffset: 4,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' },
      title: { display: true, text: t('tracking.home.devices.chartTitle') },
    },
  };

  const handleDocumentationRedirect = () => {
    window.open('https://sua-plataforma.com/documentacao', '_blank');
  };

  const handleToolRedirect = (tool: string) => {
    window.open(`https://sua-plataforma.com/ferramentas/${tool}`, '_blank');
  };

  const percentageDiff =
    lastWeekVisitsCount > 0
      ? ((weeklyVisitsCount - lastWeekVisitsCount) / lastWeekVisitsCount) * 100
      : weeklyVisitsCount > 0
      ? 100
      : 0;
  const formattedPercentage = percentageDiff.toFixed(2);
  const percentageColor =
    percentageDiff >= 0 ? theme.palette.success.main : theme.palette.error.main;

  const handleTimeRangeChange = (
    event: React.MouseEvent<HTMLElement>,
    newRange: 'week' | 'month' | 'year' | null
  ) => {
    if (newRange !== null) {
      setTimeRange(newRange);
    }
  };

  const toggleOpen = () => setOpen(!open);

  return (
    <Box p={4} bgcolor={theme.palette.background.default} minHeight="100vh">
      <AiAssistantModal
        isOpen={aiAssistant}
        onClose={() => {
          setAiAssistant(false);
        }}
        companyId={activeCompany}
        type={t('aiAssistant.types.website')}
      />
      <Typography
        sx={{ marginTop: '10px', display: 'flex', alignItems: 'center' }}
        variant="h4"
        fontWeight="bold"
        gutterBottom
      >
        {t('tracking.home.websiteTitle')}

        <Tp
          title={
            tagStatus
              ? t('tracking.tooltip.tagActive')
              : t('tracking.tooltip.tagInactive')
          }
          arrow
        >
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: tagStatus ? 'rgba(0, 255, 0, 0.7)' : 'rgba(255, 0, 0, 0.7)',
              marginLeft: '10px',
              boxShadow: tagStatus
                ? '0 0 3px rgba(0, 255, 0, 0.9)'
                : '0 0 3px rgba(255, 0, 0, 0.9)',
              cursor: 'pointer',
            }}
          />
        </Tp>
      </Typography>
      <Box mt={4}>
      <Button
        variant="outlined"
        onClick={toggleOpen}
        endIcon={open ? <ChevronUp /> : <ChevronDown />}
        sx={{ borderRadius: '12px', fontWeight: 'bold', width: '100%' }}
      >
        {t('tracking.help.connectingWebsite')}
      </Button>

      <Collapse in={open} timeout="auto" unmountOnExit>
        <Box mt={4} textAlign="left">
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            sx={{ wordBreak: 'break-word' }}
          >
            {t('tracking.integrationTag')}
          </Typography>

          <Paper
            variant="outlined"
            sx={{
              p: 2,
              mt: 1,
              bgcolor: theme.palette.grey[100],
              borderRadius: '8px',
              wordBreak: 'break-word',
            }}
          >
            <Typography variant="body2">
              <strong>{t('tracking.apiKey')}:</strong> {apiKey}
            </Typography>
          </Paper>

          <Typography variant="subtitle2" mt={3} sx={{ wordBreak: 'break-word' }}>
            {t('tracking.integrationInstructions')}
          </Typography>

          <Paper
            variant="outlined"
            sx={{
              p: 2,
              mt: 1,
              bgcolor: theme.palette.grey[100],
              borderRadius: '8px',
              wordBreak: 'break-word',
            }}
          >
            <Typography variant="body2">
              {t('tracking.copyScriptInstruction')} <strong>&lt;head&gt;</strong> {t('tracking.ofYourSite')}
            </Typography>

            <Box
              component="pre"
              sx={{
                bgcolor: '#eee',
                p: 2,
                borderRadius: '8px',
                mt: 1,
                wordBreak: 'break-word',
                whiteSpace: 'pre-wrap',
                position: 'relative',
              }}
            >
              {`<script src="https://roktune.duckdns.org/integracao.js" data-api-key="${apiKey}"></script>`}
            </Box>
          </Paper>
        </Box>
      </Collapse>
    </Box>
      <Divider sx={{ my: 2 }} />

      <Grid container spacing={4} mt={2}>
        <Grid item xs={12} md={8}>
          <Box mb={2} display="flex" justifyContent="flex-start">
            <ToggleButtonGroup
              value={timeRange}
              exclusive
              onChange={handleTimeRangeChange}
              size="small"
            >
              <ToggleButton value="week">{t('tracking.home.timeRange.week')}</ToggleButton>
              <ToggleButton value="month">{t('tracking.home.timeRange.month')}</ToggleButton>
              <ToggleButton value="year">{t('tracking.home.timeRange.year')}</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <Paper elevation={3} sx={{ p: 3, borderRadius: '16px', mb: 4 }}>
            <Line
              data={lineData}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: 'top' },
                  title: { display: true, text: t('tracking.home.groupedVisitsTitle') },
                },
              }}
            />
          </Paper>

          <Paper elevation={3} sx={{ p: 3, borderRadius: '16px', mb: 4 }}>
            <Bar data={barData} options={barOptions} />
          </Paper>

          <Grid container spacing={2}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                onClick={() => handleOpenModal(feature.title)}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  p: 1,
                  borderRadius: '12px',
                  height: '120px',
                  backgroundColor: theme.palette.background.paper,
                  boxShadow: theme.shadows[2],
                  cursor: 'pointer',
                }}
              >
                {feature.icon}
                <CardContent sx={{ textAlign: 'center', marginTop: '3%' }}>
                  <Typography variant="body1" fontWeight="medium">
                    {feature.title}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>


        </Grid>



        <Grid item xs={12} md={4} sx={{marginTop:'5%'}}>
          <Card
            sx={{
              p: 2,
              borderRadius: '16px',
              mb: 6,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: theme.palette.background.paper,
            }}
          >
            <TrendingUp size={50} color={theme.palette.primary.main} />
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                {t('tracking.home.weeklyVisitsTitle')}
              </Typography>
              <Typography variant="h4" color="textPrimary">
                {weeklyVisitsCount}
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{ color: percentageColor, fontWeight: 'bold', mt: 1 }}
              >
                {percentageDiff >= 0 ? '+' : ''}
                {formattedPercentage}% {t('tracking.home.vsLastWeek')}
              </Typography>
            </CardContent>
          </Card>

          <Card
            sx={{
              cursor: 'pointer',
              p: 2,
              borderRadius: '16px',
              mb: 6,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: theme.palette.background.paper,
            }}
            onClick={() => {
              setAiAssistant(true);
            }}
          >
            <Brain size={50} color="purple" />
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                {t('tracking.home.aiInsightsTitle')}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {t('tracking.home.aiInsightsDescription')}
              </Typography>
            </CardContent>
          </Card>

          <Card
            sx={{
              p: 2,
              borderRadius: '16px',
              mb: 6,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: theme.palette.background.paper,
            }}
          >
            <BookOpen size={50} color={theme.palette.secondary.main} />
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                {t('tracking.home.documentationTitle')}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {t('tracking.home.documentationDescription')}
              </Typography>
              <Button
                disabled
                variant="contained"
                color="secondary"
                sx={{ mt: 2 }}
                onClick={handleDocumentationRedirect}
              >
                {t('tracking.home.accessDocumentation')}
              </Button>
            </CardContent>
          </Card>

          <Card
            sx={{
              p: 2,
              borderRadius: '16px',
              mb: 6,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: theme.palette.background.paper,
            }}
          >
            <Monitor size={50} color={theme.palette.info.main} />
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                {t('tracking.home.realtimeMonitoringTitle')}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {t('tracking.home.realtimeMonitoringDescription')}
              </Typography>
              <Button
                variant="outlined"
                color="info"
                sx={{ mt: 2 }}
                disabled
                onClick={() => handleToolRedirect('realtime')}
              >
                {t('tracking.home.viewNow')}
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Dialog open={modalOpen} onClose={handleCloseModal}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Wrench size={24} color={theme.palette.warning.main} />
        {selectedFeature}
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ mt: 1 }}>
          {t('tracking.modal.featureUnderMaintenance')}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseModal} color="primary">
          {t('tracking.modal.close')}
        </Button>
      </DialogActions>
    </Dialog>
    </Box>
  );
};

export default TrackingHome;
