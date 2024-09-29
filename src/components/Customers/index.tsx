import React from 'react'
import { TableCustomer, TableWrapperCustomer, TdCustomer, ThCustomer, TrainContainer, TrainContainerHeader, TrainContainerRecommendTrainerCard, TrainContainerRecommendTrainerCardButton, TrainContainerRecommendTrainerCardH3, TrainContainerRecommendTrainerCardImage, TrainContainerRecommendTrainerCardP, TrainContainerRecommendTrainerCardRate, TrainContainerRecommendTrainerCardRateStar, TrainContainerRecommendTrainerContainer, TrainContainerRecommendTrainerWideCard, TrainContainerRecommendTrainerWideCardLeft, TrainContainerRecommendTrainerWideCardRight, TrainContainerRecommendTrainerWideCardRightButton, TrainContainerRecommendTrainerWideCardRightCancel, TrainContainerRecommendTrainerWideCardRightConfirm, TrCustomer } from './styles.ts';
import { IoStar } from "react-icons/io5";
import { FaCalendar } from "react-icons/fa6";
import UserNoImage from '../../images/user.png'
import { workout } from '../payments/index.tsx';
import { StreakContainerWorkoutElement, StreakContainerWorkoutElementIcon, StreakContainerWorkoutElementParagraphContainer, StreakContainerWorkoutElementParagraph, StreakContainerWorkoutElementParagraph2, StreakContainerWorkoutContainer, StreakContainer } from '../payments/styles.ts';
import IconBeer from '../../icons/workout-icons/beer.png'
import IconNoBeer from '../../icons/workout-icons/no-beer.png'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Bar, BarChart, PieChart, Pie, Cell } from 'recharts';


const data = [
  { name: 'Dom', uv: 4000, pv: 2400, amt: 2400 },
  { name: 'Seg', uv: 3000, pv: 1398, amt: 2210 },
  { name: 'Ter', uv: 2000, pv: 3800, amt: 2290 },
  { name: 'Qua', uv: 2780, pv: 3908, amt: 2000 },
  { name: 'Qui', uv: 1890, pv: 4800, amt: 2181 },
  { name: 'Sex', uv: 2390, pv: 3800, amt: 2500 },
  { name: 'Sáb', uv: 3490, pv: 4300, amt: 2100 },
];


const SimpleLineChart = () => {
  return (
    <BarChart style={{marginLeft:'6%', fontSize:'10pt', marginBottom:'-7%', height:'350px'}} width={350} height={270} data={data}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="name" />
    <Tooltip />
    <Bar dataKey="pv" fill="#c42929" />
    <Bar dataKey="uv" fill="#000000" />
  </BarChart>
  );
}

const SmallPieChartExample = () => {
  const data = [
    { name: 'Pilsen', value: 400 },
    { name: 'American Lager', value: 300 },
    { name: 'Vienna Lagger', value: 300 },
    { name: 'Dunkel', value: 200 },
  ];

  const COLORS = ['#d9fd57', '#97b026', '#FFBB28', '#bce05a'];  


  return (
    <div style={{width:'45%', height:'100%'}}>
    <PieChart width={250}  
       height={150}>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        outerRadius={60}
        fill="#8884d8"
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip  
 />
    </PieChart>
    </div>
  );
};


const Customers: React.FC = () => {

    const getIcon = (icon) =>{
        switch(icon){
          case 'leg':
            return IconBeer;
          case 'arm':
            return IconBeer;
          case 'back':
            return IconBeer;
          default:
            break;
        }
      }

   return (
        <TrainContainer>
            <div>
                <h1>Olá! Nome do Usuário</h1>
                <h4 style={{color:'rgba(0,0,0,0.5)', marginTop:'-2%'}}>Aqui está as informações da cervejaria</h4>
            </div>
            <TrainContainerHeader style={{marginLeft:'-3%'}}>
            <StreakContainer style={{boxShadow:'1px 1px 10px rgba(0,0,0,0.1)', background:'white', width:'400px'}}>
                <div style={{padding:'2px 0px 0px 20px'}}>
                  <h2>Detalhes dos clientes</h2>
                  <div>
                    <p>Total de Clientes</p>
                    <input style={{background:'rgba(0,0,0,0.09)', border:'0px', width:'90%', height:'20px'}}/>
                  </div>
                  <div style={{display:'flex'}}>
                    <div>
                      <p>Clientes Ativos</p>
                      <input style={{background:'rgba(0,0,0,0.09)', border:'0px', width:'80%', height:'20px'}}/>
                    </div>
                    <div>
                      <p>Clientes Inativos</p>
                      <input style={{background:'rgba(0,0,0,0.09)', border:'0px', width:'80%', height:'20px'}}/>
                    </div>
                  </div>
                  <div>
                    <p>Taxa de retenção de clientes</p>
                    <input style={{background:'rgba(0,0,0,0.09)', border:'0px', width:'90%', height:'20px'}}/>
                  </div>
                </div>
            </StreakContainer>
            <div style={{display:'flex', flexDirection:'column', marginRight:'3%', marginLeft:'2%', height:'100%'}}>
                <TrainContainerRecommendTrainerWideCard style={{height:'150px', boxShadow:'1px 1px 10px rgba(0,0,0,0.1)'}}>
                  {SmallPieChartExample()}
                </TrainContainerRecommendTrainerWideCard>
                <TrainContainerRecommendTrainerWideCard style={{height:'150px', boxShadow:'1px 1px 10px rgba(0,0,0,0.1)'}}>
                  {SmallPieChartExample()}
                </TrainContainerRecommendTrainerWideCard>
            </div>
            <StreakContainer style={{boxShadow:'1px 1px 10px rgba(0,0,0,0.1)', background:'white', width:'400px'}}>
                <div>{SimpleLineChart()}</div>
            </StreakContainer>
            </TrainContainerHeader>
            <br/>
            <TableWrapperCustomer style={{marginLeft:'-3%'}}>
            <TableCustomer>
              <thead>
                <TrCustomer>
                  <ThCustomer>Name</ThCustomer>
                  <ThCustomer>Email</ThCustomer>
                  <ThCustomer>Phone</ThCustomer>
                  <ThCustomer>Mls</ThCustomer>
                  <ThCustomer>Valor comprado</ThCustomer>
                </TrCustomer>
              </thead>
              <tbody>
                <TrCustomer>
                  <TdCustomer>John Doe</TdCustomer>
                  <TdCustomer>john.doe@example.com</TdCustomer>
                  <TdCustomer>99 99999-9999</TdCustomer>
                  <TdCustomer>10000 ml</TdCustomer>
                  <TdCustomer>R$100.00</TdCustomer>
                </TrCustomer>
                <TrCustomer>
                  <TdCustomer>Jane Smith</TdCustomer>
                  <TdCustomer>jane.smith@example.com</TdCustomer>
                  <TdCustomer>99 99999-9999</TdCustomer>
                  <TdCustomer>10000 ml</TdCustomer>
                  <TdCustomer>R$100.00</TdCustomer>
                </TrCustomer>
                <TrCustomer>
                  <TdCustomer>Mike Johnson</TdCustomer>
                  <TdCustomer>mike.johnson@example.com</TdCustomer>
                  <TdCustomer>99 99999-9999</TdCustomer>
                  <TdCustomer>10000 ml</TdCustomer>
                  <TdCustomer>R$100.00</TdCustomer>
                </TrCustomer>
                <TrCustomer>
                  <TdCustomer>Mike Johnson</TdCustomer>
                  <TdCustomer>mike.johnson@example.com</TdCustomer>
                  <TdCustomer>99 99999-9999</TdCustomer>
                  <TdCustomer>10000 ml</TdCustomer>
                  <TdCustomer>R$100.00</TdCustomer>
                </TrCustomer>
                <TrCustomer>
                  <TdCustomer>Mike Johnson</TdCustomer>
                  <TdCustomer>mike.johnson@example.com</TdCustomer>
                  <TdCustomer>99 99999-9999</TdCustomer>
                  <TdCustomer>10000 ml</TdCustomer>
                  <TdCustomer>R$100.00</TdCustomer>
                </TrCustomer>
              </tbody>
            </TableCustomer>
          </TableWrapperCustomer>
        </TrainContainer>
    );
}

export default Customers;