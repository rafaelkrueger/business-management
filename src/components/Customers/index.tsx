import React, { useEffect, useState } from 'react';
import { TableWrapperCustomer, TrainContainer, TrainContainerHeader, TrainContainerRecommendTrainerWideCard } from './styles.ts';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from 'recharts';
import DefaultTable from '../table/index.tsx';
import CustomerService from '../../services/customer.service.ts';
import { useTranslation } from 'react-i18next';
import { Brain, Info } from 'lucide-react';
import { EmptyStateContainer, EmptyStateTitle, EmptyStateDescription } from '../products/styles.ts';
import { StreakContainer } from '../payments/styles.ts';
import Tippy from '@tippyjs/react';

const generateColors = (numColors: number) => Array.from({ length: numColors }, (_, i) => `hsl(${(i * 360) / numColors}, 70%, 50%)`);

const AgePieChart: React.FC<{ ageData: Record<number, number> }> = ({ ageData = { 0: 0 } }) => {
  const ageChartData = Object.entries(ageData).map(([age, count]) => ({ name: `${age} years old`, value: count }));
  const COLORS = generateColors(ageChartData.length);
  return (
    <PieChart width={250} height={150}>
      <Pie data={ageChartData} cx="50%" cy="50%" outerRadius={60} fill="#8884d8">
        {ageChartData.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index]} />)}
      </Pie>
      <Tooltip />
    </PieChart>
  );
};

const GenderPieChart = ({ genderData = { masculine: 0, feminine: 0 } }) => {
  const data = [
    { name: 'Masculine', value: genderData.masculine },
    { name: 'Feminine', value: genderData.feminine },
  ];
  const COLORS = ['#0088FE', '#db1bb5'];
  return (
    <PieChart width={250} height={150}>
      <Pie data={data} cx="50%" cy="50%" outerRadius={60} fill="#8884d8" dataKey="value">
        {data.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
      </Pie>
      <Tooltip />
    </PieChart>
  );
};

const SimpleLineChart: React.FC<{ weekData?: Array<Record<string, number>> }> = ({ weekData = [] }) => {
  if (weekData.length === 0) {
    return <div style={{ textAlign: 'center', color: 'rgba(0, 0, 0, 0.5)', padding: '20px' }}></div>;
  }
  const chartData = weekData.map((data, index) => {
    const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][index];
    return {
      name: dayName,
      lastWeek: data[`lastWeek${dayName}`] || 0,
      thisWeek: data[`thisWeek${dayName}`] || 0,
    };
  });
  return (
    <LineChart width={window.innerWidth > 600 ? 380 : 310} height={300} data={chartData} style={{marginLeft: window.innerWidth > 600 ? '-3%' : '-35px', fontSize: '10pt', marginTop: window.innerWidth > 600 ? '5%' : '7%' }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey="lastWeek" stroke="#c42929" />
      <Line type="monotone" dataKey="thisWeek" stroke="#000000" />
    </LineChart>
  );
};

const Customers: React.FC<{ activeCompany }> = ({ activeCompany }) => {
  const { t } = useTranslation();
  const [tableData, setTableData] = useState([]);
  const [genderData, setGenderData] = useState();
  const [ageData, setAgeData] = useState();
  const [totalData, setTotalData] = useState();
  const [activityData, setActivityData] = useState();
  const [weekData, setWeekData] = useState();

  const columns = [
    { header: t('customers.name'), accessor: 'name' },
    { header: t('customers.email'), accessor: 'email' },
    { header: t('customers.phone'), accessor: 'phone' },
    { header: t('customers.gender'), accessor: 'gender' },
  ];

  useEffect(() => {
    if (activeCompany) {
      CustomerService.get(activeCompany).then((res) => setTableData(res.data)).catch(console.error);
      CustomerService.glance(activeCompany).then((res) => {
        setGenderData(res.data.genders);
        setAgeData(res.data.ages);
        setTotalData(res.data.total);
        setActivityData(res.data.activity);
        setWeekData(res.data.weekCount);
      }).catch(console.error);
    }
  }, [activeCompany]);

  const renderEmptyState = () => (
    <EmptyStateContainer>
      <EmptyStateTitle>{t('customers.emptyStateTitle')}</EmptyStateTitle>
      <EmptyStateDescription>{t('customers.emptyStateDescription')}</EmptyStateDescription>
    </EmptyStateContainer>
  );

  return (
    <TrainContainer>
      <div>
        <div style={{display:'flex'}}>
        <h1>{t('customers.title')}</h1>
        {
          window.innerWidth > 600 && (
          <Tippy content={t('customers.tooltipText')} placement="right">
            <Info size={20} style={{ marginLeft: '10px', cursor: 'pointer', marginTop:'3.5%' }} />
          </Tippy>
          )
        }
        </div>
        <h4 style={{ color: 'rgba(0,0,0,0.5)', marginTop: '-2%' }}>{t('customers.description')}</h4>
      </div>
      <TrainContainerHeader style={{ marginLeft: '-3%' }}>
        <StreakContainer style={{ boxShadow: '1px 1px 10px rgba(0,0,0,0.1)', background: 'white', width: window.innerWidth < 600 ? '300px' : '400px' }}>
          <div style={{ padding: '2px 0px 0px 20px' }}>
            <h2>{t('customers.detailsTitle')}</h2>
            <div>
              <p>{t('customers.total')}</p>
              <input disabled value={totalData?.total || 0} style={{ background: 'rgba(0,0,0,0.09)', border: '0px', width: '90%', height: '20px', padding: '5px 0px 5px 15px' }} />
            </div>
            <div style={{ display: 'flex' }}>
              <div>
                <p>{t('customers.active')}</p>
                <input disabled value={activityData?.active || 0} style={{ background: 'rgba(0,0,0,0.09)', border: '0px', width: '80%', height: '20px', padding: '5px 0px 5px 15px' }} />
              </div>
              <div>
                <p>{t('customers.inactive')}</p>
                <input disabled value={activityData?.inactive || 0} style={{ background: 'rgba(0,0,0,0.09)', border: '0px', width: '80%', height: '20px', padding: '5px 0px 5px 15px' }} />
              </div>
            </div>
            <div>
              <p>{t('customers.retentionRate')}</p>
              <input disabled style={{ background: 'rgba(0,0,0,0.09)', border: '0px', width: '90%', height: '20px', padding: '5px 0px 5px 15px' }} />
            </div>
          </div>
        </StreakContainer>

        <div style={{ display: 'flex', flexDirection: 'column', marginRight: '3%', marginLeft: '2%', height: '100%', marginTop:window.innerWidth <  600 ? '-18%' : 'unset', marginBottom:window.innerWidth <  600 ? '13%'  : 'unset'}}>
          <TrainContainerRecommendTrainerWideCard style={{ height: '87px', boxShadow: '1px 1px 10px rgba(0,0,0,0.1)' }}>
            <AgePieChart ageData={ageData} />
          </TrainContainerRecommendTrainerWideCard>
          <TrainContainerRecommendTrainerWideCard style={{ height: '87px', boxShadow: '1px 1px 10px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', textAlign: 'center' }}>
            <h4 style={{ margin: '0', fontSize: '16px', color: '#4a4a4a' }}>{t('products.ai')}</h4>
            <Brain size={40} style={{ color: 'purple', marginTop: '5px' }} />
          </TrainContainerRecommendTrainerWideCard>
          <TrainContainerRecommendTrainerWideCard style={{ height: '87px', boxShadow: '1px 1px 10px rgba(0,0,0,0.1)' }}>
            <GenderPieChart genderData={genderData} />
          </TrainContainerRecommendTrainerWideCard>
        </div>

        <StreakContainer style={{ boxShadow: '1px 1px 10px rgba(0,0,0,0.1)', background: 'white', width: window.innerWidth > 600 ? '400px' : '300px' }}>
          <SimpleLineChart weekData={weekData} />
        </StreakContainer>
      </TrainContainerHeader>

      <div style={{ maxWidth: window.innerWidth > 600 ? 'unset' : '300px', maxHeight: '250px', overflowY: 'auto', overflowX: 'hidden', marginTop: '-50px' }}>
        {tableData && tableData.length > 0 ? <DefaultTable data={tableData} columns={columns} /> : renderEmptyState()}
      </div>
    </TrainContainer>
  );
};

export default Customers;
