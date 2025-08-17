import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box, Typography, Grid, Card, CardContent, Paper,
  Tabs, Tab, Chip, IconButton, FormControl, InputLabel,
  Select, MenuItem, Button, Stack, Divider, Alert,
  LinearProgress, Tooltip, Badge
} from '@mui/material';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell,
  AreaChart, Area, Legend, ComposedChart
} from 'recharts';
import {
  TrendingUp, TrendingDown, BarChart3, PieChart as PieChartIcon,
  Calendar, Filter, Download, RefreshCw, Target, DollarSign,
  Eye, MousePointer, Users, Zap, TrendingUp as TrendingUpIcon
} from 'lucide-react';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import AdsService from '../../services/ads.service.ts';

interface AnalyticsProps {
  activeCompany?: string;
}

export const AdsAnalytics: React.FC<AnalyticsProps> = ({ activeCompany }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);
  const [dateRange, setDateRange] = useState('7d');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [loading, setLoading] = useState(false);
  const [performanceData, setPerformanceData] = useState<any>(null);
  const [platformData, setPlatformData] = useState<any[]>([]);
  const [trendsData, setTrendsData] = useState<any[]>([]);
  const [breakdownData, setBreakdownData] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any>(null);

  const platforms = [
    { key: 'all', label: t('ads.allPlatforms'), color: '#666' },
    { key: 'GOOGLE', label: 'Google Ads', color: '#00A8FF' },
    { key: 'FACEBOOK', label: 'Facebook Ads', color: '#00A8FF' },
    { key: 'INSTAGRAM', label: 'Instagram Ads', color: '#E1306C' },
    { key: 'TIKTOK', label: 'TikTok Ads', color: '#000000' },
    { key: 'TWITTER', label: 'Twitter/X Ads', color: '#00A8FF' }
  ];

  const dateRanges = [
    { value: '1d', label: t('ads.lastDay') },
    { value: '7d', label: t('ads.last7Days') },
    { value: '30d', label: t('ads.last30Days') },
    { value: '90d', label: t('ads.last90Days') },
    { value: 'custom', label: t('ads.customRange') }
  ];

  const getDateRangeDates = useCallback(() => {
    const end = endOfDay(new Date());
    let start: Date;

    switch (dateRange) {
      case '1d':
        start = startOfDay(subDays(new Date(), 1));
        break;
      case '7d':
        start = startOfDay(subDays(new Date(), 7));
        break;
      case '30d':
        start = startOfDay(subDays(new Date(), 30));
        break;
      case '90d':
        start = startOfDay(subDays(new Date(), 90));
        break;
      default:
        start = startOfDay(subDays(new Date(), 7));
    }

    return { start, end };
  }, [dateRange]);

  const fetchAnalyticsData = useCallback(async () => {
    if (!activeCompany) return;

    setLoading(true);
    try {
      const { start, end } = getDateRangeDates();

      // Fetch performance summary
      const performanceResponse = await AdsService.getPerformanceSummary({
        companyId: activeCompany,
        startDate: start.toISOString(),
        endDate: end.toISOString(),
        platforms: selectedPlatform !== 'all' ? [selectedPlatform] : undefined
      });
      setPerformanceData(performanceResponse.data);

      // Fetch platform performance
      const platformResponse = await AdsService.getPlatformPerformance({
        companyId: activeCompany,
        startDate: start.toISOString(),
        endDate: end.toISOString()
      });
      setPlatformData(platformResponse.data);

      // Fetch trends data
      const trendsResponse = await AdsService.getPerformanceTrends(
        activeCompany,
        start.toISOString(),
        end.toISOString(),
        'day'
      );
      setTrendsData(trendsResponse.data);

      // Fetch breakdown data
      const breakdownResponse = await AdsService.getPerformanceBreakdown(
        activeCompany,
        'platform',
        start.toISOString(),
        end.toISOString()
      );
      setBreakdownData(breakdownResponse.data);

      // Fetch recommendations
      const recommendationsResponse = await AdsService.getRecommendations(activeCompany);
      setRecommendations(recommendationsResponse.data);

    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  }, [activeCompany, dateRange, selectedPlatform, getDateRangeDates]);

  useEffect(() => {
    fetchAnalyticsData();
  }, [fetchAnalyticsData]);

  const getPerformanceStats = () => {
    if (!performanceData) return [];

    return [
      {
        title: t('ads.impressions'),
        value: AdsService.formatNumber(performanceData.totalImpressions || 0),
        change: '+12.4%',
        trend: 'up',
        icon: <Eye size={20} />,
        color: '#00A8FF'
      },
      {
        title: t('ads.clicks'),
        value: AdsService.formatNumber(performanceData.totalClicks || 0),
        change: '+8.2%',
        trend: 'up',
        icon: <MousePointer size={20} />,
        color: '#4CAF50'
      },
      {
        title: t('ads.ctr'),
        value: `${(performanceData.avgCtr || 0).toFixed(2)}%`,
        change: '+0.3%',
        trend: 'up',
        icon: <Target size={20} />,
        color: '#FF9800'
      },
      {
        title: t('ads.cpc'),
        value: AdsService.formatCurrency(performanceData.avgCpc || 0),
        change: '-2.1%',
        trend: 'down',
        icon: <DollarSign size={20} />,
        color: '#F44336'
      },
      {
        title: t('ads.conversions'),
        value: AdsService.formatNumber(performanceData.totalConversions || 0),
        change: '+4.7%',
        trend: 'up',
        icon: <Users size={20} />,
        color: '#9C27B0'
      },
      {
        title: t('ads.roas'),
        value: `${(performanceData.avgRoas || 0).toFixed(1)}x`,
        change: '+0.4x',
        trend: 'up',
        icon: <TrendingUpIcon size={20} />,
        color: '#00A8FF'
      }
    ];
  };

  const getPlatformChartData = () => {
    return platformData.map(platform => ({
      name: platform.platform,
      impressions: platform.impressions,
      clicks: platform.clicks,
      spent: platform.spent,
      conversions: platform.conversions,
      ctr: platform.ctr,
      cpc: platform.cpc
    }));
  };

  const getTrendsChartData = () => {
    return trendsData.map((item: any) => ({
      date: format(new Date(item.date), 'MMM dd'),
      impressions: item.impressions,
      clicks: item.clicks,
      spent: item.spent,
      conversions: item.conversions
    }));
  };

  const getBreakdownChartData = () => {
    if (!breakdownData?.breakdown) return [];

    return breakdownData.breakdown.map((item: any) => ({
      name: item.platform,
      value: item.spent,
      impressions: item.impressions,
      clicks: item.clicks
    }));
  };

  const COLORS = ['#00A8FF', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const handleExportData = async (type: 'campaigns' | 'metrics') => {
    if (!activeCompany) return;

    try {
      const { start, end } = getDateRangeDates();
      const response = await (type === 'campaigns'
        ? AdsService.exportCampaigns(activeCompany, 'csv', start.toISOString(), end.toISOString())
        : AdsService.exportMetrics(activeCompany, undefined, 'csv', start.toISOString(), end.toISOString())
      );

      // In a real app, you would handle the download
      console.log('Export response:', response.data);
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  return (
    <Box p={3}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            {t('ads.analytics')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t('ads.analyticsSubtitle')} • {activeCompany || t('ads.selectCompany')}
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<Download size={20} />}
            onClick={() => handleExportData('campaigns')}
          >
            {t('ads.exportCampaigns')}
          </Button>
          <Button
            variant="outlined"
            startIcon={<Download size={20} />}
            onClick={() => handleExportData('metrics')}
          >
            {t('ads.exportMetrics')}
          </Button>
          <Button
            variant="contained"
            startIcon={<RefreshCw size={20} />}
            onClick={fetchAnalyticsData}
            disabled={loading}
          >
            {t('ads.refresh')}
          </Button>
        </Stack>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>{t('ads.dateRange')}</InputLabel>
                <Select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                >
                  {dateRanges.map(range => (
                    <MenuItem key={range.value} value={range.value}>
                      {range.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>{t('ads.platform')}</InputLabel>
                <Select
                  value={selectedPlatform}
                  onChange={(e) => setSelectedPlatform(e.target.value)}
                >
                  {platforms.map(platform => (
                    <MenuItem key={platform.key} value={platform.key}>
                      {platform.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {loading && <LinearProgress sx={{ mb: 3 }} />}

      {/* Performance Overview */}
      <Grid container spacing={3} mb={4}>
        {getPerformanceStats().map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="body2" color="text.secondary" mb={1}>
                      {stat.title}
                    </Typography>
                    <Typography variant="h5" fontWeight="bold" mr={1}>
                      {stat.value}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center">
                    <Box sx={{ color: stat.color, mr: 1 }}>
                      {stat.icon}
                    </Box>
                    <Chip
                      label={stat.change}
                      size="small"
                      color={stat.trend === 'up' ? 'success' : 'error'}
                      icon={stat.trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Analytics Tabs */}
      <Paper sx={{ mb: 4 }}>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label={t('ads.overview')} />
          <Tab label={t('ads.trends')} />
          <Tab label={t('ads.platforms')} />
          <Tab label={t('ads.breakdown')} />
          <Tab label={t('ads.recommendations')} />
        </Tabs>

        <Divider />

        <Box p={3}>
          {/* Overview Tab */}
          {activeTab === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12} lg={8}>
                <Typography variant="h6" mb={2}>
                  {t('ads.performanceTrends')}
                </Typography>
                <ResponsiveContainer width="100%" height={400}>
                  <ComposedChart data={getTrendsChartData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <RechartsTooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="impressions" fill="#00A8FF" name={t('ads.impressions')} />
                    <Line yAxisId="right" type="monotone" dataKey="clicks" stroke="#4CAF50" name={t('ads.clicks')} />
                  </ComposedChart>
                </ResponsiveContainer>
              </Grid>
              <Grid item xs={12} lg={4}>
                <Typography variant="h6" mb={2}>
                  {t('ads.platformDistribution')}
                </Typography>
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={getBreakdownChartData()}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {getBreakdownChartData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Grid>
            </Grid>
          )}

          {/* Trends Tab */}
          {activeTab === 1 && (
            <Box>
              <Typography variant="h6" mb={2}>
                {t('ads.performanceOverTime')}
              </Typography>
              <ResponsiveContainer width="100%" height={500}>
                <AreaChart data={getTrendsChartData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Area type="monotone" dataKey="impressions" stackId="1" stroke="#00A8FF" fill="#00A8FF" />
                  <Area type="monotone" dataKey="clicks" stackId="1" stroke="#4CAF50" fill="#4CAF50" />
                  <Area type="monotone" dataKey="conversions" stackId="1" stroke="#FF9800" fill="#FF9800" />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          )}

          {/* Platforms Tab */}
          {activeTab === 2 && (
            <Box>
              <Typography variant="h6" mb={2}>
                {t('ads.platformPerformance')}
              </Typography>
              <ResponsiveContainer width="100%" height={500}>
                <BarChart data={getPlatformChartData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Bar dataKey="impressions" fill="#00A8FF" name={t('ads.impressions')} />
                  <Bar dataKey="clicks" fill="#4CAF50" name={t('ads.clicks')} />
                  <Bar dataKey="conversions" fill="#FF9800" name={t('ads.conversions')} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          )}

          {/* Breakdown Tab */}
          {activeTab === 3 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" mb={2}>
                  {t('ads.spendByPlatform')}
                </Typography>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={getPlatformChartData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip />
                    <Bar dataKey="spent" fill="#F44336" name={t('ads.spent')} />
                  </BarChart>
                </ResponsiveContainer>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" mb={2}>
                  {t('ads.ctrByPlatform')}
                </Typography>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={getPlatformChartData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip />
                    <Bar dataKey="ctr" fill="#9C27B0" name={t('ads.ctr')} />
                  </BarChart>
                </ResponsiveContainer>
              </Grid>
            </Grid>
          )}

          {/* Recommendations Tab */}
          {activeTab === 4 && recommendations && (
            <Box>
              <Typography variant="h6" mb={3}>
                {t('ads.aiRecommendations')}
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Box display="flex" alignItems="center" mb={2}>
                        <DollarSign size={24} style={{ marginRight: 8, color: '#4CAF50' }} />
                        <Typography variant="h6">
                          {t('ads.budgetOptimization')}
                        </Typography>
                      </Box>
                      {recommendations.budgetOptimization?.map((rec: string, index: number) => (
                        <Alert key={index} severity="info" sx={{ mb: 1 }}>
                          {rec}
                        </Alert>
                      ))}
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Box display="flex" alignItems="center" mb={2}>
                        <Target size={24} style={{ marginRight: 8, color: '#00A8FF' }} />
                        <Typography variant="h6">
                          {t('ads.targetingSuggestions')}
                        </Typography>
                      </Box>
                      {recommendations.targetingSuggestions?.map((rec: string, index: number) => (
                        <Alert key={index} severity="info" sx={{ mb: 1 }}>
                          {rec}
                        </Alert>
                      ))}
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Box display="flex" alignItems="center" mb={2}>
                        <Zap size={24} style={{ marginRight: 8, color: '#FF9800' }} />
                        <Typography variant="h6">
                          {t('ads.creativeRecommendations')}
                        </Typography>
                      </Box>
                      {recommendations.creativeRecommendations?.map((rec: string, index: number) => (
                        <Alert key={index} severity="info" sx={{ mb: 1 }}>
                          {rec}
                        </Alert>
                      ))}
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Box display="flex" alignItems="center" mb={2}>
                        <TrendingUp size={24} style={{ marginRight: 8, color: '#9C27B0' }} />
                        <Typography variant="h6">
                          {t('ads.biddingStrategies')}
                        </Typography>
                      </Box>
                      {recommendations.biddingStrategies?.map((rec: string, index: number) => (
                        <Alert key={index} severity="info" sx={{ mb: 1 }}>
                          {rec}
                        </Alert>
                      ))}
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default AdsAnalytics;
