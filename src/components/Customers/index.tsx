import React, {useEffect, useState} from 'react'
import { TableWrapperCustomer, TrainContainer, TrainContainerHeader, TrainContainerRecommendTrainerCard, TrainContainerRecommendTrainerCardButton, TrainContainerRecommendTrainerCardH3, TrainContainerRecommendTrainerCardImage, TrainContainerRecommendTrainerCardP, TrainContainerRecommendTrainerCardRate, TrainContainerRecommendTrainerCardRateStar, TrainContainerRecommendTrainerContainer, TrainContainerRecommendTrainerWideCard, TrainContainerRecommendTrainerWideCardLeft, TrainContainerRecommendTrainerWideCardRight, TrainContainerRecommendTrainerWideCardRightButton, TrainContainerRecommendTrainerWideCardRightCancel, TrainContainerRecommendTrainerWideCardRightConfirm } from './styles.ts';
import { IoStar } from "react-icons/io5";
import { FaCalendar } from "react-icons/fa6";
import UserNoImage from '../../images/user.png'
import { workout } from '../payments/index.tsx';
import { StreakContainerWorkoutElement, StreakContainerWorkoutElementIcon, StreakContainerWorkoutElementParagraphContainer, StreakContainerWorkoutElementParagraph, StreakContainerWorkoutElementParagraph2, StreakContainerWorkoutContainer, StreakContainer } from '../payments/styles.ts';
import IconBeer from '../../icons/workout-icons/beer.png'
import IconNoBeer from '../../icons/workout-icons/no-beer.png'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Bar, BarChart, PieChart, Pie, Cell } from 'recharts';
import DefaultTable from '../table/index.tsx'
import CustomerService from '../../services/customer.service.ts'

const data = [
  { name: 'Dom', uv: 4000, pv: 2400, amt: 2400 },
  { name: 'Seg', uv: 3000, pv: 1398, amt: 2210 },
  { name: 'Ter', uv: 2000, pv: 3800, amt: 2290 },
  { name: 'Qua', uv: 2780, pv: 3908, amt: 2000 },
  { name: 'Qui', uv: 1890, pv: 4800, amt: 2181 },
  { name: 'Sex', uv: 2390, pv: 3800, amt: 2500 },
  { name: 'Sáb', uv: 3490, pv: 4300, amt: 2100 },
];

const generateColors = (numColors: number) => {
  const colors = [];
  for (let i = 0; i < numColors; i++) {
    colors.push(`hsl(${(i * 360) / numColors}, 70%, 50%)`);
  }
  return colors;
};

const AgePieChart: React.FC<{ ageData: Record<number, number> }> = ({ ageData }) => {
  if (!ageData || Object.keys(ageData).length === 0) {
    ageData = { 0: 0 };
  }

  const ageChartData = Object.entries(ageData).map(([age, count]) => ({
    name: `${age} years old`,
    value: count,
  }));

  const COLORS = generateColors(ageChartData.length); // Generate colors based on the number of ages

  return (
    <PieChart width={250} height={150}>
      <Pie data={ageChartData} cx="50%" cy="50%" outerRadius={60} fill="#8884d8">
        {ageChartData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index]} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  );
};

const GenderPieChart = ({ genderData }) => {
  if (!genderData) {
    genderData = { masculine: 0, feminine: 0 };
  }

  const data = [
    { name: 'Masculine', value: genderData.masculine },
    { name: 'Feminine', value: genderData.feminine },
  ];

  const COLORS = ['#0088FE', '#db1bb5'];

  return (
    <PieChart width={250} height={150}>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        outerRadius={60}
        fill="#8884d8"
        dataKey="value"
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  );
};

const SimpleLineChart: React.FC<{ weekData?: Array<{ lastWeekSunday?: number; thisWeekSunday?: number; lastWeekMonday?: number; thisWeekMonday?: number; lastWeekTuesday?: number; thisWeekTuesday?: number; lastWeekWednesday?: number; thisWeekWednesday?: number; lastWeekThursday?: number; thisWeekThursday?: number; lastWeekFriday?: number; thisWeekFriday?: number; lastWeekSaturday?: number; thisWeekSaturday?: number; }> }> = ({ weekData }) => {
  // Validate weekData before proceeding
  if (!weekData || weekData.length === 0) {
    return (
      <div style={{ textAlign: 'center', color: 'rgba(0, 0, 0, 0.5)', padding: '20px' }}>
        <p>Nenhum dado disponível para exibir no gráfico.</p>
      </div>
    );
  }

  // Prepare data for the chart
  const chartData = weekData.map((data, index) => {
    const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][index];
    const lastWeekValue = data[`lastWeek${dayName}`];
    const thisWeekValue = data[`thisWeek${dayName}`];

    return {
      name: dayName,
      lastWeek: lastWeekValue !== undefined ? lastWeekValue : 0, // Set to 0 if undefined
      thisWeek: thisWeekValue !== undefined ? thisWeekValue : 0, // Set to 0 if undefined
    };
  });

  // Validation: Check if chartData has valid entries
  const isDataValid = chartData.some(data => data.lastWeek > 0 || data.thisWeek > 0);

  if (!isDataValid) {
    return (
      <div style={{ textAlign: 'center', color: 'rgba(0, 0, 0, 0.5)', padding: '20px' }}>
        <p>Nenhum dado disponível para exibir no gráfico.</p>
      </div>
    );
  }

  return (
    <LineChart
      style={{ marginLeft: '-3%', fontSize: '10pt', marginBottom: '-7%', height: '350px' }}
      width={380}
      height={300}
      data={chartData}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
        <Line type="monotone" dataKey="lastWeek" stroke="#c42929"/>
        <Line type="monotone" dataKey="thisWeek" stroke="#000000" />
    </LineChart>
  );
};



const Customers: React.FC<{ activeCompany }> = ({...props}) => {
  const [tableData, setTableData] = useState()
  const [genderData, setGenderData] = useState()
  const [ageData, setAgeData] = useState()
  const [totalData, setTotalData] = useState()
  const [activityData, setActivityData] = useState()
  const [weekData, setWeekData] = useState()

  const columns = [
    { header: 'Nome', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    { header: 'Celular', accessor: 'phone' },
    { header: 'Gênero', accessor: 'gender' },
  ]

  useEffect(() => {
    if (props.activeCompany) {
      CustomerService.get(props.activeCompany)
        .then((res) => setTableData(res.data))
        .catch((err) => console.log(err))

      CustomerService.glance(props.activeCompany)
      .then((res) => {
        setGenderData(res.data.genders);
        setAgeData(res.data.ages)
        setTotalData(res.data.total)
        setActivityData(res.data.activity)
        setWeekData(res.data.weekCount)
      })
      .catch((err) => console.log(err))
    }
  }, [props.activeCompany]);

   return (
        <TrainContainer>
            <div>
                <h1>Sessão de Clientes</h1>
                <h4 style={{color:'rgba(0,0,0,0.5)', marginTop:'-2%'}}>Aqui está as informações de seus clientes</h4>
            </div>
            <TrainContainerHeader style={{marginLeft:'-3%'}}>
            <StreakContainer style={{boxShadow:'1px 1px 10px rgba(0,0,0,0.1)', background:'white', width:'400px'}}>
                <div style={{padding:'2px 0px 0px 20px'}}>
                  <h2>Detalhes dos clientes</h2>
                  <div>
                    <p>Total de Clientes</p>
                    <input disabled value={totalData?.total as unknown as 0} style={{background:'rgba(0,0,0,0.09)', border:'0px', width:'90%', height:'20px', padding:'5px 0px 5px 15px'}}/>
                  </div>
                  <div style={{display:'flex'}}>
                    <div>
                      <p>Clientes Ativos</p>
                      <input disabled value={activityData?.active as unknown as 0} style={{background:'rgba(0,0,0,0.09)', border:'0px', width:'80%', height:'20px', padding:'5px 0px 5px 15px'}}/>
                    </div>
                    <div>
                      <p>Clientes Inativos</p>
                      <input disabled value={activityData?.inactive as unknown as 0} style={{background:'rgba(0,0,0,0.09)', border:'0px', width:'80%', height:'20px', padding:'5px 0px 5px 15px'}}/>
                    </div>
                  </div>
                  <div>
                    <p>Taxa de retenção de clientes</p>
                    <input disabled style={{background:'rgba(0,0,0,0.09)', border:'0px', width:'90%', height:'20px', padding:'5px 0px 5px 15px'}}/>
                  </div>
                </div>
            </StreakContainer>
            <div style={{display:'flex', flexDirection:'column', marginRight:'3%', marginLeft:'2%', height:'100%'}}>
                <TrainContainerRecommendTrainerWideCard style={{height:'150px', boxShadow:'1px 1px 10px rgba(0,0,0,0.1)'}}>
                  <AgePieChart ageData={ageData} />
                </TrainContainerRecommendTrainerWideCard>
                <TrainContainerRecommendTrainerWideCard style={{height:'150px', boxShadow:'1px 1px 10px rgba(0,0,0,0.1)'}}>
                  <GenderPieChart genderData={genderData as unknown as {masculine:0, feminine:0}} />
                </TrainContainerRecommendTrainerWideCard>
            </div>
            <StreakContainer style={{boxShadow:'1px 1px 10px rgba(0,0,0,0.1)', background:'white', width:'400px'}}>
                <div><SimpleLineChart weekData={weekData} /></div>
            </StreakContainer>
            </TrainContainerHeader>
            <br/>
            <TableWrapperCustomer style={{marginLeft:'-6%'}}>
            <div style={{ maxHeight: '250px', overflowY: 'auto', overflowX: 'hidden' }}>
              <DefaultTable data={tableData as unknown as []} columns={columns}/>
            </div>
          </TableWrapperCustomer>
        </TrainContainer>
    );
}

export default Customers;