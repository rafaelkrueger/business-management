// Customers.tsx
import React, { useEffect, useState } from 'react';
import {
  TableWrapperCustomer,
  TrainContainer,
  TrainContainerHeader,
  TrainContainerRecommendTrainerWideCard,
} from './styles.ts';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import DefaultTable from '../table/index.tsx';
import CustomerService from '../../services/customer.service.ts';
import { useTranslation } from 'react-i18next';
import { Brain, FileSpreadsheet, Info } from 'lucide-react';
import {
  EmptyStateContainer,
  EmptyStateTitle,
  EmptyStateDescription,
} from '../products/styles.ts';
import { StreakContainer } from '../payments/styles.ts';
import Tippy from '@tippyjs/react';
import { Button, Typography, useTheme } from '@mui/material';
import CustomerModal from './customers-modal/index.tsx';
import { HiUserPlus } from 'react-icons/hi2';
import AiAssistantModal from '../ai-assistant-modal/index.tsx';

// Função auxiliar para gerar cores
const generateColors = (numColors: number) =>
  Array.from({ length: numColors }, (_, i) => `hsl(${(i * 360) / numColors}, 70%, 50%)`);

// PieChart para idades
const AgePieChart: React.FC<{ ageData: Record<number, number> }> = ({ ageData = { 0: 0 } }) => {
  const ageChartData = Object.entries(ageData).map(([age, count]) => ({
    name: `${age} years old`,
    value: count,
  }));
  const COLORS = generateColors(ageChartData.length);
  return (
    <PieChart width={250} height={150}>
      <Pie data={ageChartData} cx="50%" cy="50%" outerRadius={60} fill="#8884d8">
        {ageChartData.map((_, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index]} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  );
};

// PieChart para gênero
const GenderPieChart = ({ genderData = { masculine: 0, feminine: 0 } }) => {
  const data = [
    { name: 'Masculine', value: genderData.masculine },
    { name: 'Feminine', value: genderData.feminine },
  ];
  const COLORS = ['#0088FE', '#db1bb5'];
  return (
    <PieChart width={150} height={150}>
      <Pie data={data} cx="50%" cy="50%" outerRadius={60} fill="#8884d8" dataKey="value">
        {data.map((_, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  );
};

// Gráfico de linha para a contagem semanal
const SimpleLineChart: React.FC<{ weekData?: Array<Record<string, number>> }> = ({ weekData = [] }) => {
  if (weekData.length === 0) {
    return (
      <div
        style={{
          textAlign: 'center',
          color: 'rgba(0, 0, 0, 0.5)',
          padding: '20px',
        }}
      ></div>
    );
  }
  const chartData = weekData.map((data, index) => {
    const dayName = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ][index];
    return {
      name: dayName,
      lastWeek: data[`lastWeek${dayName}`] || 0,
      thisWeek: data[`thisWeek${dayName}`] || 0,
    };
  });
  return (
    <LineChart
      width={window.innerWidth > 600 ? 380 : 310}
      height={310}
      data={chartData}
      style={{
        marginLeft: window.innerWidth > 600 ? '-3%' : '-35px',
        fontSize: '10pt',
        marginTop: window.innerWidth > 600 ? '5%' : '7%',
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey="lastWeek" stroke="#c42929" />
      <Line type="monotone" dataKey="thisWeek" stroke="#000000" />
    </LineChart>
  );
};

interface CustomersProps {
  activeCompany: string;
}

const Customers: React.FC<CustomersProps> = ({ activeCompany }) => {
  const { t } = useTranslation();
  const [tableData, setTableData] = useState<any[]>([]);
  const [genderData, setGenderData] = useState<any>();
  const [ageData, setAgeData] = useState<any>();
  const [totalData, setTotalData] = useState<any>();
  const [activityData, setActivityData] = useState<any>();
  const [weekData, setWeekData] = useState<any>();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [aiAssistant, setAiAssistant] = useState(false);
  const theme = useTheme();

  const columns = [
    { header: t('customers.name'), accessor: 'name' },
    { header: t('customers.email'), accessor: 'email' },
    { header: t('customers.phone'), accessor: 'phone' },
    { header: t('customers.gender'), accessor: 'gender' },
  ];

  const fetchCustomers = () => {
    if (activeCompany) {
      CustomerService.get(activeCompany)
        .then((res) => setTableData(res.data))
        .catch(console.error);
      CustomerService.glance(activeCompany)
        .then((res) => {
          setGenderData(res.data.genders);
          setAgeData(res.data.ages);
          setTotalData(res.data.total);
          setActivityData(res.data.activity);
          setWeekData(res.data.weekCount);
        })
        .catch(console.error);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [activeCompany]);

  const renderEmptyState = () => (
    <EmptyStateContainer>
      <EmptyStateTitle>{t('customers.emptyStateTitle')}</EmptyStateTitle>
      <EmptyStateDescription>{t('customers.emptyStateDescription')}</EmptyStateDescription>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          setSelectedCustomer(null); // Garantindo modo criação
          setOpenModal(true);
        }}
      >
        {t('customers.createCustomer') || 'Criar Cliente'}
      </Button>
    </EmptyStateContainer>
  );

  return (
    <TrainContainer>
    <AiAssistantModal isOpen={aiAssistant} onClose={()=>{setAiAssistant(false)}} companyId={activeCompany} type={t('aiAssistant.types.customers')}/>
      <div>
        <div style={{ display: 'flex' }}>
          <h1>{t('customers.title')}</h1>
          {window.innerWidth > 600 && (
            <Tippy content={t('customers.tooltipText')} placement="right">
              <Info
                size={20}
                style={{ marginLeft: '10px', cursor: 'pointer', marginTop: '3.5%' }}
              />
            </Tippy>
          )}
        </div>
        <h4 style={{ color: 'rgba(0,0,0,0.5)', marginTop: '-2%' }}>
          {t('customers.description')}
        </h4>
      </div>
      <TrainContainerHeader style={{ marginLeft: '-3%' }}>
        <StreakContainer
          style={{
            boxShadow: '1px 1px 10px rgba(0,0,0,0.1)',
            background: 'white',
            width: window.innerWidth < 600 ? '300px' : '400px',
          }}
        >
          <div style={{ padding: '2px 0px 0px 20px' }}>
            <h2>{t('customers.detailsTitle')}</h2>
            <div>
              <p>{t('customers.total')}</p>
              <input
                disabled
                value={totalData?.total || 0}
                style={{
                  background: 'rgba(0,0,0,0.09)',
                  border: '0px',
                  width: '90%',
                  height: '20px',
                  padding: '5px 0px 5px 15px',
                }}
              />
            </div>
            <div style={{ display: 'flex' }}>
              <div>
                <p>{t('customers.active')}</p>
                <input
                  disabled
                  value={activityData?.active || 0}
                  style={{
                    background: 'rgba(0,0,0,0.09)',
                    border: '0px',
                    width: '80%',
                    height: '20px',
                    padding: '5px 0px 5px 15px',
                  }}
                />
              </div>
              <div>
                <p>{t('customers.inactive')}</p>
                <input
                  disabled
                  value={activityData?.inactive || 0}
                  style={{
                    background: 'rgba(0,0,0,0.09)',
                    border: '0px',
                    width: '80%',
                    height: '20px',
                    padding: '5px 0px 5px 15px',
                  }}
                />
              </div>
            </div>
            <div>
              <p>{t('customers.retentionRate')}</p>
              <input
                disabled
                style={{
                  background: 'rgba(0,0,0,0.09)',
                  border: '0px',
                  width: '90%',
                  height: '20px',
                  padding: '5px 0px 5px 15px',
                }}
              />
            </div>
          </div>
        </StreakContainer>

        {/* Card de criação de cliente */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginRight: '3%',
            marginLeft: '2%',
            height: '100%',
            marginTop: window.innerWidth < 600 ? '-18%' : 'unset',
            marginBottom: window.innerWidth < 600 ? '13%' : 'unset',
          }}
        >
          <TrainContainerRecommendTrainerWideCard
            onClick={() => {
              setSelectedCustomer(null); // Modo criação
              setOpenModal(true);
            }}
            style={{
              height: '87px',
              boxShadow: '1px 1px 10px rgba(0,0,0,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              textAlign: 'center',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <HiUserPlus style={{ margin: 'auto' }} size={40} color={theme.palette.primary.main} />
              <Typography
                variant="h6"
                sx={{ mt: 1, margin: 0, fontSize: '16px', color: '#4a4a4a' }}
              >
                {t('customers.create')}
              </Typography>
            </div>
          </TrainContainerRecommendTrainerWideCard>

          {/* Outros cards, por exemplo, para exibir gráficos ou importar */}
          <TrainContainerRecommendTrainerWideCard
          onClick={()=>{setAiAssistant(true)}}
            style={{
              height: '87px',
              boxShadow: '1px 1px 10px rgba(0,0,0,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              textAlign: 'center',
            }}
          >
            <h4 style={{ margin: '0', fontSize: '16px', color: '#4a4a4a' }}>
              {t('products.ai')}
            </h4>
            <Brain size={40} style={{ color: 'purple', marginTop: '5px' }} />
          </TrainContainerRecommendTrainerWideCard>
          <TrainContainerRecommendTrainerWideCard
            onClick={() => {
              // Supondo que este card seja para outra ação (ex.: importar via Excel)
              setSelectedCustomer(null);
              setOpenModal(true);
            }}
            style={{
              height: '87px',
              boxShadow: '1px 1px 10px rgba(0,0,0,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              textAlign: 'center',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <FileSpreadsheet style={{ margin: 'auto' }} size={40} color={theme.palette.primary.main} />
              <Typography
                variant="h6"
                sx={{ mt: 1, margin: 0, fontSize: '16px', color: '#4a4a4a' }}
              >
                {t('customers.importSpreadsheet')}
              </Typography>
            </div>
          </TrainContainerRecommendTrainerWideCard>
        </div>

        <StreakContainer
          style={{
            boxShadow: '1px 1px 10px rgba(0,0,0,0.1)',
            background: 'white',
            width: window.innerWidth > 600 ? '400px' : '300px',
          }}
        >
          <SimpleLineChart weekData={weekData} />
        </StreakContainer>
      </TrainContainerHeader>

      {/* Tabela com os clientes */}
      <div
        style={{
          maxWidth: window.innerWidth > 600 ? 'unset' : '300px',
          maxHeight: '250px',
          overflowY: 'auto',
          overflowX: 'hidden',
          marginTop: '-50px',
        }}
      >
        {tableData && tableData.length > 0 ? (
          <DefaultTable
            data={tableData}
            columns={columns}
            handleRow={(rowData: any) => {
              setSelectedCustomer(rowData);
              setOpenModal(true);
            }}
          />
        ) : (
          renderEmptyState()
        )}
      </div>

      {/* Modal unificado para criação/atualização */}
      <CustomerModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onCustomerUpdated={fetchCustomers}
        enterpriseId={activeCompany}
        customer={selectedCustomer}
      />
    </TrainContainer>
  );
};

export default Customers;
