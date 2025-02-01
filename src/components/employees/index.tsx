import React, { useEffect, useState } from 'react';
import { TrainContainer, TrainContainerRecommendTrainerWideCard } from '../customers/styles.ts';
import EmployeeService from '../../services/employee.service.ts';
import DefaultTable from '../table/index.tsx';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { HiUserPlus } from "react-icons/hi2";
import { FaFileExcel, FaRobot } from "react-icons/fa";
import ReactModal from 'react-modal';
import { EmptyStateButton, EmptyStateContainer, EmptyStateDescription, EmptyStateTitle } from '../products/styles.ts';
import { MdSell } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, Grid, IconButton, InputLabel, MenuItem, Paper, Select, TextField, Typography, useTheme } from '@mui/material';
import { Close } from '@mui/icons-material';

const NoDataMessage = () => {
  const { t } = useTranslation();
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      color: '#555',
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center',
      padding: '20px'
    }}>
      <div style={{ fontSize: '48px', animation: 'spin 2s linear infinite' }}>📊</div>
      <h2 style={{ margin: '10px 0', fontSize: '24px' }}>{t('employees.emptyTitle')}</h2>
      <p style={{ fontSize: '16px', marginTop: '0px' }}>{t('employees.emptySubTitle')}</p>
    </div>
  );
};

const Employees: React.FC<{ activeCompany }> = ({ ...props }) => {
  const [edit, setEdit] = useState(false);
  const { t } = useTranslation();
  const [tableData, setTableData] = useState([]);
  const [glanceData, setGlanceData] = useState([]);
  const theme = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    email: '',
    phone: '',
    gender: '',
    job: '',
    department: '',
    active: 'on',
    birth: '',
    hire: '',
    salary: 0,
    manager: '',
  });

  const columns = [
    { header: t('modal.fullName'), accessor: 'name' },
    { header: t('modal.email'), accessor: 'email' },
    { header: t('modal.phone'), accessor: 'phone' },
    { header: t('modal.gender'), accessor: 'gender' },
    { header: t('modal.job'), accessor: 'job' },
    { header: t('modal.department'), accessor: 'department' },
  ];

  const renderEmptyState = (setIsOpen) => (
    <EmptyStateContainer style={{ height: '180px' }}>
      <EmptyStateTitle>{t('employees.emptyTitle')}</EmptyStateTitle>
      <EmptyStateDescription>{t('employees.emptySubTitle')}</EmptyStateDescription>
      <EmptyStateButton onClick={() => setIsOpen(true)}>
        <MdSell size={20} style={{ marginRight: '10px' }} />
        {t('employees.create')}
      </EmptyStateButton>
      <EmptyStateButton onClick={() => console.log('Importar Planilha')}>
        <FaFileExcel size={20} style={{ marginRight: '10px' }} />
        {t('employees.import')}
      </EmptyStateButton>
    </EmptyStateContainer>
  );

  const handleModalClose = () => {
    setEdit(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      gender: '',
      job: '',
      department: '',
      birth: '',
      hire: '',
      salary: 0,
      manager: '',
      active: '',
    });
    setIsOpen(false);
  };

  const handleModalOpen = () => {
    setIsOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!edit) {
      EmployeeService.create({ companyId: props.activeCompany, formData })
        .then(() => {
          setIsOpen(false);
          EmployeeService.get(props.activeCompany)
            .then((res) => setTableData(res.data))
            .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
    } else {
      EmployeeService.edit({ companyId: props.activeCompany, formData })
        .then(() => {
          setIsOpen(false);
          EmployeeService.get(props.activeCompany)
            .then((res) => setTableData(res.data))
            .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
    }
  };

  const generateColors = (numColors: number) => {
    const colors = [];
    for (let i = 0; i < numColors; i++) {
      colors.push(`hsl(${(i * 360) / numColors}, 70%, 50%)`);
    }
    return colors;
  };

  const CustomPieChart: React.FC<{ data: any[], title: string }> = ({ data, title }) => {
    if (!data || data.length === 0) {
      data = [{ name: 'No Data', value: 0 }];
    }

    const COLORS = generateColors(data.length);

    return (
      <div style={{ width: '100%', height: '100%' }}>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <ResponsiveContainer width="100%" height="80%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius="70%"
              fill="#8884d8"
              dataKey="value"
              label={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend
              layout="horizontal"
              align="center"
              verticalAlign="bottom"
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  };

  useEffect(() => {
    if (props.activeCompany) {
      EmployeeService.get(props.activeCompany)
        .then((res) => setTableData(res.data))
        .catch((err) => console.log(err));

      EmployeeService.glance(props.activeCompany)
        .then((res) => {
          setGlanceData(res.data);
        })
        .catch((err) => console.log(err));
    }
  }, [props.activeCompany]);

  const departmentData = glanceData?.departments?.map(dept => ({
    name: dept.department,
    value: dept.count,
  })) || [];

  const activityData = [
    { name: 'Active', value: glanceData?.activity?.active || 0 },
    { name: 'Inactive', value: glanceData?.activity?.inactive || 0 },
  ];

  const handleRow = (row) => {
    setEdit(true);
    setFormData({
      id: row.id,
      name: row.name,
      email: row.email,
      phone: row.phone,
      gender: row.gender,
      job: row.job,
      department: row.department,
      birth: row.birth,
      hire: row.hire,
      salary: row.salary,
      manager: row.manager,
      active: row.active,
    });
    handleModalOpen();
  };

  return (
    <TrainContainer style={{marginRight:window.innerWidth > 600 ? '0%' : '7%'}}>
      <div>
        <h1>{t('employees.title')}</h1>
        <h4 style={{ color: 'rgba(0,0,0,0.5)', marginTop: '-2%' }}>{t('employees.subtitle')}</h4>
      </div>
      <div style={{ maxHeight: '300px', overflowY: 'auto', overflowX: 'hidden', marginLeft: '-3%' }}>
        {tableData.length === 0 ? (
          renderEmptyState(setIsOpen)
        ) : (
            <div style={{maxWidth: window.innerWidth < 600 ? '100%' : 'unset', overflowX: window.innerWidth < 600 ? 'scroll' : 'unset'}}>
                <DefaultTable columns={columns} data={tableData} handleRow={handleRow} />
            </div>
        )}
      </div>
      <Grid container spacing={3} sx={{ mt: 4 }}>
        <Grid item xs={12} md={4}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              height: '385px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {departmentData.length > 0 ? (
              <CustomPieChart data={departmentData} title={t('employees.departmentChart')} />
            ) : (
              <NoDataMessage />
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  height: '80px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                }}
                onClick={handleModalOpen}
              >
                <HiUserPlus size={40} color={theme.palette.primary.main} />
                <Typography variant="h6" sx={{ mt: 1 }}>
                  {t('employees.create')}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  height: '80px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                }}
              >
                <FaRobot size={60} color={'#ffc107'} />
                <Typography variant="h5" sx={{ mt: 2, fontWeight: 'bold' }}>
                  {t('employees.iaAnalysis')}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  height: '80px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                }}
              >
                <FaFileExcel size={40} color={'green'} />
                <Typography variant="h6" sx={{ mt: 1 }}>
                  {t('employees.import')}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              height: '385px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {activityData.length > 0 ? (
              <CustomPieChart data={activityData} title={t('employees.activityChart')} />
            ) : (
              <NoDataMessage />
            )}
          </Paper>
        </Grid>
      </Grid>

      <Dialog
      open={isOpen}
      onClose={()=>setIsOpen(false)}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '12px',
          padding: '16px',
        },
      }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight="bold">
            {!edit ? t('modal.newEmployee') : t('modal.editEmployee')}
          </Typography>
          <IconButton onClick={()=>setIsOpen(false)}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* Nome Completo */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={t('modal.fullName')}
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                margin="normal"
              />
            </Grid>
            {/* Email */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={t('modal.email')}
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                margin="normal"
              />
            </Grid>
            {/* Celular */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('modal.phone')}
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                required
                margin="normal"
              />
            </Grid>
            {/* Gênero */}
            <Grid item xs={12}>
              <FormControl fullWidth margin="normal">
                <InputLabel>{t('modal.gender')}</InputLabel>
                <Select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  label={t('modal.gender')}
                  required
                >
                  <MenuItem value="Masculine">{t('modal.genderOptions.masculine')}</MenuItem>
                  <MenuItem value="Feminine">{t('modal.genderOptions.feminine')}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {/* Trabalho */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('modal.job')}
                name="job"
                value={formData.job}
                onChange={handleInputChange}
                margin="normal"
              />
            </Grid>
            {/* Departamento */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('modal.department')}
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                margin="normal"
              />
            </Grid>
            {/* Data de Nascimento */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={t('modal.birthDate')}
                name="birth"
                type="date"
                value={formData.birth}
                onChange={handleInputChange}
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            {/* Data de Contratação */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={t('modal.hireDate')}
                name="hire"
                type="date"
                value={formData.hire}
                onChange={handleInputChange}
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            {/* Salário */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('modal.salary')}
                name="salary"
                type="number"
                value={formData.salary}
                onChange={handleInputChange}
                margin="normal"
              />
            </Grid>
            {/* Gerente */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('modal.manager')}
                name="manager"
                value={formData.manager}
                onChange={handleInputChange}
                margin="normal"
              />
            </Grid>
            {/* Ativo */}
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="active"
                    checked={formData.active}
                    onChange={handleInputChange}
                  />
                }
                label={t('modal.active')}
              />
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        <Button sx={{color:'blue', border:'1px blue solid'}} onClick={()=>setIsOpen(false)}>
          {t('modal.cancel')}
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          onClick={handleSubmit}
        >
          {!edit ? t('modal.create') : t('modal.save')}
        </Button>
      </DialogActions>
    </Dialog>
    </TrainContainer>
  );
};

export default Employees;