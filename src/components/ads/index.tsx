import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box, Typography, Grid, Button, Stack, Paper,
  Tabs, Tab, Chip, IconButton, TextField,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Tooltip, LinearProgress, Menu, MenuItem, Divider, Badge
} from '@mui/material';
import {
  SiGoogleads, SiFacebook, SiTiktok, SiInstagram
} from 'react-icons/si';
import {
  X, Plus, Search, Filter, MoreVertical,
  BarChart2, Edit, Pause, Play, Trash2, Download
} from 'lucide-react';
import { format } from 'date-fns';

export const AdsManagement: React.FC<{ activeCompany?: string }> = ({ activeCompany }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [campaigns, setCampaigns] = useState<any[]>([
    {
      id: '1',
      name: t('ads.summerSale'),
      platform: 'google',
      status: 'running',
      budget: 5000,
      spent: 2450,
      impressions: 124500,
      clicks: 2450,
      startDate: new Date(2023, 5, 15),
      endDate: new Date(2023, 6, 15)
    },
    {
      id: '2',
      name: t('ads.newCollection'),
      platform: 'instagram',
      status: 'paused',
      budget: 3200,
      spent: 800,
      impressions: 64500,
      clicks: 1200,
      startDate: new Date(2023, 5, 1),
      endDate: new Date(2023, 8, 1)
    },
    {
      id: '3',
      name: t('ads.holidayPromo'),
      platform: 'facebook',
      status: 'completed',
      budget: 8000,
      spent: 8000,
      impressions: 284500,
      clicks: 5600,
      startDate: new Date(2023, 4, 1),
      endDate: new Date(2023, 5, 31)
    }
  ]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');

  const platforms = [
    { key: 'google', icon: <SiGoogleads size={24} />, label: t('ads.google'), color: '#4285F4' },
    { key: 'facebook', icon: <SiFacebook size={24} />, label: t('ads.facebook'), color: '#1877F2' },
    { key: 'tiktok', icon: <SiTiktok size={24} />, label: t('ads.tiktok'), color: '#000000' },
    { key: 'instagram', icon: <SiInstagram size={24} />, label: t('ads.instagram'), color: '#E1306C' },
    { key: 'x', icon: <X size={24} />, label: t('ads.x'), color: '#000000' },
  ];

  const statusColors: Record<string, string> = {
    running: 'success',
    paused: 'warning',
    completed: 'default',
    draft: 'secondary'
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleCreateCampaign = () => {
    setCreateModalOpen(true);
  };

  const handleCloseModal = () => {
    setCreateModalOpen(false);
  };

  const toggleCampaignStatus = (id: string) => {
    setCampaigns(campaigns.map(campaign =>
      campaign.id === id
        ? {
            ...campaign,
            status: campaign.status === 'running' ? 'paused' : 'running'
          }
        : campaign
    ));
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlatform = selectedPlatform === 'all' || campaign.platform === selectedPlatform;
    return matchesSearch && matchesPlatform;
  });

  const platformStats = platforms.map(platform => ({
    ...platform,
    count: campaigns.filter(c => c.platform === platform.key).length
  }));

  return (
    <Box p={3}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            {t('ads.title')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t('ads.subtitle')} • {activeCompany || t('ads.selectCompany')}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Plus size={20} />}
          onClick={handleCreateCampaign}
          sx={{ height: 45 }}
        >
          {t('ads.createCampaign')}
        </Button>
      </Box>

      {/* Platform Cards */}
      <Grid container spacing={2} mb={4}>
        {platformStats.map((p) => (
          <Grid item xs={12} sm={6} md={3} lg={2.4} key={p.key}>
            <Paper
              sx={{
                p: 2,
                borderRadius: 2,
                borderLeft: `4px solid ${p.color}`,
                height: '100%'
              }}
            >
              <Box display="flex" alignItems="center">
                <Box sx={{ color: p.color, mr: 1.5 }}>
                  {p.icon}
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    {p.count}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {p.label}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Tabs Section */}
      <Paper sx={{ mb: 3, borderRadius: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label={t('ads.tabs.allCampaigns')} />
          <Tab label={t('ads.tabs.running')} />
          <Tab label={t('ads.tabs.paused')} />
          <Tab label={t('ads.tabs.completed')} />
          <Tab label={t('ads.tabs.drafts')} />
        </Tabs>

        <Divider />

        {/* Campaigns Toolbar */}
        <Box p={2} display="flex" alignItems="center">
          <TextField
            size="small"
            placeholder={t('ads.searchPlaceholder')}
            InputProps={{
              startAdornment: <Search size={18} style={{ marginRight: 8 }} />
            }}
            sx={{ width: 300, mr: 2 }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <Chip
            label={t('ads.allPlatforms')}
            onClick={() => setSelectedPlatform('all')}
            variant={selectedPlatform === 'all' ? 'filled' : 'outlined'}
            color="primary"
            sx={{ mr: 1 }}
          />

          {platforms.map(p => (
            <Chip
              key={p.key}
              label={p.label}
              onClick={() => setSelectedPlatform(p.key)}
              variant={selectedPlatform === p.key ? 'filled' : 'outlined'}
              sx={{ mr: 1, borderColor: p.color, color: selectedPlatform === p.key ? '#fff' : p.color }}
              style={{
                backgroundColor: selectedPlatform === p.key ? p.color : 'transparent'
              }}
            />
          ))}

          <Tooltip title={t('ads.filters')}>
            <IconButton sx={{ ml: 'auto' }}>
              <Filter size={20} />
            </IconButton>
          </Tooltip>

          <Button startIcon={<Download size={18} />} sx={{ ml: 1 }}>
            {t('ads.export')}
          </Button>
        </Box>

        {/* Campaigns Table */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('ads.campaignName')}</TableCell>
                <TableCell>{t('ads.platform')}</TableCell>
                <TableCell>{t('ads.status')}</TableCell>
                <TableCell>{t('ads.budget')}</TableCell>
                <TableCell>{t('ads.progress')}</TableCell>
                <TableCell>{t('ads.duration')}</TableCell>
                <TableCell>{t('ads.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCampaigns.map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell>
                    <Typography fontWeight="bold">{campaign.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      ID: {campaign.id}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {platforms.find(p => p.key === campaign.platform)?.icon}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={t(`ads.statuses.${campaign.status}`)}
                      color={statusColors[campaign.status] as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight="bold">
                      ${campaign.spent.toLocaleString()}
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.secondary"
                      >
                        /${campaign.budget.toLocaleString()}
                      </Typography>
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Box width="100%" mr={1}>
                        <LinearProgress
                          variant="determinate"
                          value={(campaign.spent / campaign.budget) * 100}
                          color={campaign.status === 'completed' ? 'primary' : 'info'}
                        />
                      </Box>
                      <Typography variant="body2">
                        {Math.round((campaign.spent / campaign.budget) * 100)}%
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {format(campaign.startDate, 'dd/MM/yy')} - {format(campaign.endDate, 'dd/MM/yy')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Tooltip title={t('ads.analytics')}>
                        <IconButton size="small">
                          <BarChart2 size={18} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t('ads.edit')}>
                        <IconButton size="small">
                          <Edit size={18} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip
                        title={
                          campaign.status === 'running'
                            ? t('ads.pause')
                            : t('ads.resume')
                        }
                      >
                        <IconButton
                          size="small"
                          onClick={() => toggleCampaignStatus(campaign.id)}
                        >
                          {campaign.status === 'running' ? (
                            <Pause size={18} />
                          ) : (
                            <Play size={18} />
                          )}
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t('ads.delete')}>
                        <IconButton size="small">
                          <Trash2 size={18} />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {filteredCampaigns.length === 0 && (
          <Box textAlign="center" py={6}>
            <Typography variant="h6" color="text.secondary">
              {t('ads.noCampaigns')}
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Stats Section */}
      <Typography variant="h6" fontWeight="bold" mb={2}>
        {t('ads.performanceTitle')}
      </Typography>
      <Grid container spacing={3} mb={4}>
        {[
          { title: t('ads.impressions'), value: '245K', change: '+12.4%' },
          { title: t('ads.clicks'), value: '12.4K', change: '+8.2%' },
          { title: t('ads.ctr'), value: '5.06%', change: '+0.3%' },
          { title: t('ads.cpc'), value: '$0.42', change: '-2.1%' },
          { title: t('ads.conversions'), value: '1.2K', change: '+4.7%' },
          { title: t('ads.roas'), value: '3.8x', change: '+0.4x' },
        ].map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
            <Paper sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="body2" color="text.secondary" mb={1}>
                {stat.title}
              </Typography>
              <Box display="flex" alignItems="baseline">
                <Typography variant="h5" fontWeight="bold" mr={1}>
                  {stat.value}
                </Typography>
                <Chip
                  label={stat.change}
                  size="small"
                  color={
                    stat.change.startsWith('+')
                      ? 'success'
                      : stat.change.startsWith('-')
                        ? 'error'
                        : 'default'
                  }
                />
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Create Campaign Modal */}
      <Dialog
        open={createModalOpen}
        onClose={handleCloseModal}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold">
            {t('ads.createCampaign')}
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" mb={1}>
                {t('ads.platform')}
              </Typography>
              <Grid container spacing={2}>
                {platforms.map((p) => (
                  <Grid item xs={6} key={p.key}>
                    <Paper
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        cursor: 'pointer',
                        border: '2px solid transparent',
                        '&:hover': { borderColor: p.color }
                      }}
                    >
                      <Box display="flex" alignItems="center">
                        <Box sx={{ color: p.color, mr: 1.5 }}>
                          {p.icon}
                        </Box>
                        <Typography fontWeight="bold">
                          {p.label}
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={t('ads.campaignName')}
                margin="normal"
              />
              <TextField
                fullWidth
                label={t('ads.budget')}
                margin="normal"
                type="number"
              />
              <TextField
                fullWidth
                label={t('ads.targeting')}
                margin="normal"
                select
                SelectProps={{ native: true }}
              >
                <option>{t('ads.targetingOptions.allUsers')}</option>
                <option>{t('ads.targetingOptions.existing')}</option>
                <option>{t('ads.targetingOptions.similar')}</option>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseModal}>
            {t('ads.cancel')}
          </Button>
          <Button variant="contained">
            {t('ads.create')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdsManagement;