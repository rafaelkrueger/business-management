/* eslint-disable @typescript-eslint/no-unused-expressions */
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Bar, BarChart } from 'recharts';
import { HomeContainerBody, HomeContainerHeader } from './styles.ts';
import { DollarSign, CreditCard, BarChart3, Percent, Brain, Info } from 'lucide-react';
import HistoryIcon from '@mui/icons-material/History';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import AiAssistantModal from '../ai-assistant-modal/index.tsx';
import PaymentService from '../../services/payment.service.ts';
import {
  Grid,
  Card as MuiCard,
  CardContent,
  Typography,
  Box,
  IconButton,
} from '@mui/material';
import { ExternalLink } from 'lucide-react';
import PaymentHistoryModal from './PaymentHistoryModal.tsx';

const NoDataMessage = () => {
  const { t } = useTranslation();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#555', textAlign: 'center', padding: '20px', marginLeft:'5%' }}>
      <div style={{ fontSize: '48px', animation: 'spin 2s linear infinite' }}>📊</div>
      <h2 style={{ margin: '10px 0', fontSize: '24px' }}>{t('products.noData')}</h2>
      <p style={{ fontSize: '16px', marginTop: '0px' }}>{t('products.again')}</p>
    </div>
  );
};

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

const Card: React.FC<CardProps> = ({ children, style, ...rest }) => (
  <div
    style={{
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '15px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      ...style,
    }}
    {...rest}
  >
    {children}
  </div>
);

const PaymentCard: React.FC<{ payment: any }> = ({ payment }) => {
  const [open, setOpen] = useState(false);

  const historyData = (payment.paymentHistory || []).map((h) => ({
    date: new Date(h.paymentDate).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
    amount: Number(h.amount),
  }));

  const isPaid = payment.status === 'paid';
  const statusColor = isPaid ? '#10b981' : '#f59e0b';
  const statusBg = isPaid ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)';

  return (
    <Grid item xs={12}>
      <MuiCard
        sx={{
          borderLeft: '3px solid',
          borderLeftColor: statusColor,
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
            transform: 'translateY(-2px)',
          },
          mb: 1.5,
        }}
      >
        <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  color: 'text.primary',
                  fontSize: '0.95rem',
                  mb: 0.5,
                  lineHeight: 1.3
                }}
              >
                {payment.description || payment.product?.name || 'Payment'}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    px: 1,
                    py: 0.25,
                    bgcolor: statusBg,
                    borderRadius: '6px',
                    border: `1px solid ${statusColor}20`,
                  }}
                >
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      bgcolor: statusColor,
                      mr: 0.5,
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      color: statusColor,
                      fontWeight: 600,
                      fontSize: '0.7rem',
                      textTransform: 'capitalize',
                    }}
                  >
                    {payment.status}
                  </Typography>
                </Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: 'text.secondary',
                    fontSize: '0.75rem'
                  }}
                >
                  {new Date(payment.paymentDate).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                  })}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {payment.link && (
                <IconButton
                  size="small"
                  onClick={() => window.open(payment.link as string, '_blank')}
                  sx={{
                    color: '#6b7280',
                    '&:hover': { color: '#3b82f6', bgcolor: 'rgba(59, 130, 246, 0.1)' },
                  }}
                >
                  <ExternalLink size={16} />
                </IconButton>
              )}
              <IconButton
                size="small"
                onClick={() => setOpen(true)}
                sx={{
                  color: '#6b7280',
                  '&:hover': { color: '#3b82f6', bgcolor: 'rgba(59, 130, 246, 0.1)' },
                }}
              >
                <HistoryIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>

          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 1.5,
            pt: 1.5,
            borderTop: '1px solid rgba(0,0,0,0.06)'
          }}>
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  color: 'text.primary',
                  lineHeight: 1.2
                }}
              >
                {`${payment.currency} ${Number(payment.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              </Typography>
            </Box>
            {historyData.length > 0 && (
              <Box sx={{ width: '120px', height: '40px' }}>
                <LineChart width={120} height={40} data={historyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                  <XAxis dataKey="date" hide />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{
                      fontSize: 10,
                      padding: '4px 8px',
                      borderRadius: '6px',
                      border: 'none',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke={statusColor}
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </Box>
            )}
          </Box>
        </CardContent>
      </MuiCard>
      <PaymentHistoryModal
        open={open}
        onClose={() => setOpen(false)}
        history={payment.paymentHistory || []}
      />
    </Grid>
  );
};

const Payments: React.FC<{ activeCompany }> = ({ activeCompany }) => {
  const { t } = useTranslation();
  const [tableData, setTableData] = useState([]);
  const [glanceData, setGlanceData] = useState({});
  const [aiAssistant, setAiAssistant] = useState(false);

  useEffect(() => {
    if (activeCompany) {
      PaymentService.withProduct(activeCompany)
        .then((res) => setTableData(res.data))
        .catch(console.error);

      PaymentService.glance(activeCompany)
        .then((res) => setGlanceData(res.data))
        .catch(console.error);
    }
  }, [activeCompany]);

  const chartData = tableData.map((payment) => ({
    paymentDate: new Date(payment.paymentDate).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
    total: Number(payment.amount),
  }));

  const SimpleLineChart = () => (
    <Card style={{ minHeight: '380px', maxHeight: '380px', marginLeft: '-60px' }}>
      <LineChart width={650} height={360} data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="paymentDate" tick={{ fontSize: 10 }} />
        <YAxis tick={{ fontSize: 10 }} />
        <Tooltip contentStyle={{ fontSize: 12 }} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Line type="monotone" dataKey="total" stroke="#82ca9d" />
      </LineChart>
    </Card>
  );

  const MobileLineChart = () => (
    <div style={{ width: '100%', height: '380px' }}>
      <BarChart width={window.innerWidth - 60} height={360} data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="paymentDate" tick={{ fontSize: 10 }} />
        <YAxis tick={{ fontSize: 10 }} />
        <Tooltip contentStyle={{ fontSize: 12 }} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="total" fill="#82ca9d" />
      </BarChart>
    </div>
  );

  const cards = [
    { icon: <DollarSign size={40} color="#22c55e" />, value: glanceData.totalAmount ? `$${glanceData.totalAmount}` : '-', label: t('payments.totalAnnualRevenue') },
    { icon: <CreditCard size={40} color="#3b82f6" />, value: glanceData.count || '-', label: t('payments.processedTransactions') },
    { icon: <BarChart3 size={40} color="#facc15" />, value: glanceData.averageTicket ? `$${glanceData.averageTicket}` : '-', label: t('payments.averageTicket') },
    { icon: <Percent size={40} color="#ef4444" />, value: glanceData.taxes ? `$${glanceData.taxes.toFixed(2)}` : '-', label: t('payments.taxes') },
    { icon: <Brain size={40} color="#a855f7" />, value: t('AI Powered'), label: t('payments.aiInsights') },
  ];


  return (
    <div style={{ padding: '20px' }}>
      <AiAssistantModal isOpen={aiAssistant} onClose={()=>{setAiAssistant(false)}} companyId={activeCompany} type={t('aiAssistant.types.payments')}/>
      <HomeContainerHeader>
        <div style={{display:'flex', marginLeft:'18px'}}>
        {t('payments.title')}
        {
          window.innerWidth > 600 && (
          <Tippy content={t('payments.tooltipText')} placement="right">
            <Info size={20} style={{ marginLeft: '10px', cursor: 'pointer', marginTop:'1.5%' }} />
          </Tippy>
          )
        }
        </div>
      </HomeContainerHeader>
      <HomeContainerHeader style={{ marginTop: '-7%', fontSize: '15pt', marginBottom: '1%', color: 'rgba(0,0,0,0.5)', marginLeft:'18px' }}>
        {t('payments.financialInfo')}
      </HomeContainerHeader>
      <HomeContainerBody>
        {window.outerWidth > 600 ? <SimpleLineChart /> : <MobileLineChart />}
        {tableData.length > 0 ? (
          <Grid container spacing={1.5} sx={{ maxHeight: '400px', overflowY: 'auto', ml: 1, pr: 1 }}>
            {tableData.map((payment) => (
              <PaymentCard key={payment.id} payment={payment} />
            ))}
          </Grid>
        ) : (
          <NoDataMessage />
        )}
      </HomeContainerBody>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1px', marginTop: '40px' }}>
        {cards.map((card, index) => (
          <Card onClick={()=>{if(index === 4)setAiAssistant(true)}} key={index} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', width: window.innerWidth > 600 ? '145px' : '88%', marginBottom:'30px' }}>
            {card.icon}
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '10px' }}>{card.value}</h1>
            <p style={{ color: '#6b7280', marginTop: '5px' }}>{card.label}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Payments;
