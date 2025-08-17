import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Divider,
  Avatar,
  Badge,
  Tooltip,
} from '@mui/material';
import {
  Person as PersonIcon,
  Business as BusinessIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  CalendarToday as CalendarIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Google as GoogleIcon,
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  Campaign as CampaignIcon,
} from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  source: string;
  campaign: string;
  platform: string;
  value: number;
  createdAt: string;
  lastContact: string;
}

interface LeadSource {
  platform: string;
  leads: number;
  conversions: number;
  conversionRate: number;
  totalValue: number;
  avgValue: number;
}

export const CrmIntegration: React.FC = () => {
  const { t } = useTranslation();
  const [showLeadDialog, setShowLeadDialog] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Mock data
  const mockLeads: Lead[] = [
    {
      id: '1',
      name: 'João Silva',
      email: 'joao.silva@email.com',
      phone: '(11) 99999-9999',
      company: 'Tech Solutions Ltda',
      status: 'qualified',
      source: 'Google Ads',
      campaign: 'Campanha de Conversão - Google',
      platform: 'google',
      value: 2500,
      createdAt: '2024-01-15T10:30:00Z',
      lastContact: '2024-01-15T14:20:00Z'
    },
    {
      id: '2',
      name: 'Maria Santos',
      email: 'maria.santos@email.com',
      phone: '(11) 88888-8888',
      company: 'Digital Marketing',
      status: 'converted',
      source: 'Facebook Ads',
      campaign: 'Awareness - Facebook',
      platform: 'facebook',
      value: 5000,
      createdAt: '2024-01-14T09:15:00Z',
      lastContact: '2024-01-15T16:45:00Z'
    },
    {
      id: '3',
      name: 'Pedro Costa',
      email: 'pedro.costa@email.com',
      phone: '(11) 77777-7777',
      company: 'Startup XYZ',
      status: 'new',
      source: 'Instagram Ads',
      campaign: 'Remarketing - Instagram',
      platform: 'instagram',
      value: 0,
      createdAt: '2024-01-15T11:45:00Z',
      lastContact: '2024-01-15T11:45:00Z'
    },
    {
      id: '4',
      name: 'Ana Oliveira',
      email: 'ana.oliveira@email.com',
      phone: '(11) 66666-6666',
      company: 'E-commerce ABC',
      status: 'contacted',
      source: 'Google Ads',
      campaign: 'Campanha de Conversão - Google',
      platform: 'google',
      value: 1200,
      createdAt: '2024-01-13T15:20:00Z',
      lastContact: '2024-01-15T10:30:00Z'
    }
  ];

  const mockLeadSources: LeadSource[] = [
    {
      platform: 'Google Ads',
      leads: 45,
      conversions: 12,
      conversionRate: 26.7,
      totalValue: 18000,
      avgValue: 1500
    },
    {
      platform: 'Facebook Ads',
      leads: 28,
      conversions: 8,
      conversionRate: 28.6,
      totalValue: 12000,
      avgValue: 1500
    },
    {
      platform: 'Instagram Ads',
      leads: 22,
      conversions: 5,
      conversionRate: 22.7,
      totalValue: 8000,
      avgValue: 1600
    }
  ];

  const leadStatusColors = {
    new: 'default',
    contacted: 'info',
    qualified: 'warning',
    converted: 'success',
    lost: 'error'
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'google': return <GoogleIcon />;
      case 'facebook': return <FacebookIcon />;
      case 'instagram': return <InstagramIcon />;
      default: return <CampaignIcon />;
    }
  };

  const getStatusColor = (status: string) => {
    return leadStatusColors[status as keyof typeof leadStatusColors] || 'default';
  };

  const handleViewLead = (lead: Lead) => {
    setSelectedLead(lead);
    setShowLeadDialog(true);
  };

  const COLORS = ['#00A8FF', '#00C49F', '#FFBB28'];

  return (
    <Box p={3}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Integração CRM & Leads
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={3}>
        Acompanhe leads e conversões por campanha e plataforma
      </Typography>

      {/* Performance Overview */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" color="text.secondary" mb={1}>
                    Total de Leads
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    {mockLeads.length}
                  </Typography>
                </Box>
                <Box sx={{ color: '#00A8FF' }}>
                  <PersonIcon />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" color="text.secondary" mb={1}>
                    Conversões
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    {mockLeads.filter(l => l.status === 'converted').length}
                  </Typography>
                </Box>
                <Box sx={{ color: '#4CAF50' }}>
                  <TrendingUpIcon />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" color="text.secondary" mb={1}>
                    Taxa de Conversão
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    {((mockLeads.filter(l => l.status === 'converted').length / mockLeads.length) * 100).toFixed(1)}%
                  </Typography>
                </Box>
                <Box sx={{ color: '#FF9800' }}>
                  <TrendingUpIcon />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" color="text.secondary" mb={1}>
                    Valor Total
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    R$ {mockLeads.reduce((sum, lead) => sum + lead.value, 0).toLocaleString()}
                  </Typography>
                </Box>
                <Box sx={{ color: '#9C27B0' }}>
                  <BusinessIcon />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Lead Sources Chart */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" mb={2}>
                Leads por Plataforma
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={mockLeadSources}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ platform, leads }) => `${platform}: ${leads}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="leads"
                  >
                    {mockLeadSources.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Conversion Rate Chart */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" mb={2}>
                Taxa de Conversão por Plataforma
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={mockLeadSources}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="platform" />
                  <YAxis />
                  <RechartsTooltip />
                  <Bar dataKey="conversionRate" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Leads Table */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6">
                  Leads Recentes
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                >
                  Adicionar Lead
                </Button>
              </Box>

              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Lead</TableCell>
                      <TableCell>Empresa</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Origem</TableCell>
                      <TableCell>Campanha</TableCell>
                      <TableCell>Valor</TableCell>
                      <TableCell>Data</TableCell>
                      <TableCell>Ações</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mockLeads.map((lead) => (
                      <TableRow key={lead.id}>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={2}>
                            <Avatar>
                              <PersonIcon />
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight="bold">
                                {lead.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {lead.email}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {lead.company}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={lead.status}
                            color={getStatusColor(lead.status) as any}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1}>
                            {getPlatformIcon(lead.platform)}
                            <Typography variant="body2">
                              {lead.source}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" noWrap>
                            {lead.campaign}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="bold">
                            R$ {lead.value.toLocaleString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {new Date(lead.createdAt).toLocaleDateString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" gap={1}>
                            <Tooltip title="Ver detalhes">
                              <IconButton
                                size="small"
                                onClick={() => handleViewLead(lead)}
                              >
                                <ViewIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Editar">
                              <IconButton size="small" color="primary">
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Excluir">
                              <IconButton size="small" color="error">
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Lead Details Dialog */}
      <Dialog open={showLeadDialog} onClose={() => setShowLeadDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Detalhes do Lead
        </DialogTitle>
        <DialogContent>
          {selectedLead && (
            <Grid container spacing={3} mt={1}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Nome"
                  value={selectedLead.name}
                  margin="normal"
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  value={selectedLead.email}
                  margin="normal"
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Telefone"
                  value={selectedLead.phone}
                  margin="normal"
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Empresa"
                  value={selectedLead.company}
                  margin="normal"
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Status</InputLabel>
                  <Select value={selectedLead.status} label="Status">
                    <MenuItem value="new">Novo</MenuItem>
                    <MenuItem value="contacted">Contactado</MenuItem>
                    <MenuItem value="qualified">Qualificado</MenuItem>
                    <MenuItem value="converted">Convertido</MenuItem>
                    <MenuItem value="lost">Perdido</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Valor"
                  value={`R$ ${selectedLead.value.toLocaleString()}`}
                  margin="normal"
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" mb={2}>
                  Informações da Campanha
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Plataforma"
                  value={selectedLead.source}
                  margin="normal"
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Campanha"
                  value={selectedLead.campaign}
                  margin="normal"
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Data de Criação"
                  value={new Date(selectedLead.createdAt).toLocaleString()}
                  margin="normal"
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Último Contato"
                  value={new Date(selectedLead.lastContact).toLocaleString()}
                  margin="normal"
                  InputProps={{ readOnly: true }}
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowLeadDialog(false)}>
            Fechar
          </Button>
          <Button variant="contained">
            Salvar Alterações
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CrmIntegration;
