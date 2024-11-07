import React, { useEffect, useState } from 'react'
import { TrainContainer, TrainContainerHeader, TrainContainerRecommendTrainerCard, TrainContainerRecommendTrainerCardButton, TrainContainerRecommendTrainerCardH3, TrainContainerRecommendTrainerCardImage, TrainContainerRecommendTrainerCardP, TrainContainerRecommendTrainerCardRate, TrainContainerRecommendTrainerCardRateStar, TrainContainerRecommendTrainerContainer, TrainContainerRecommendTrainerWideCard, TrainContainerRecommendTrainerWideCardLeft, TrainContainerRecommendTrainerWideCardRight, TrainContainerRecommendTrainerWideCardRightButton, TrainContainerRecommendTrainerWideCardRightCancel, TrainContainerRecommendTrainerWideCardRightConfirm } from './styles.ts';
import { IoStar } from "react-icons/io5";
import { FaCalendar } from "react-icons/fa6";
import { StreakContainerWorkoutElement, StreakContainerWorkoutElementIcon, StreakContainerWorkoutElementParagraphContainer, StreakContainerWorkoutElementParagraph, StreakContainerWorkoutElementParagraph2, StreakContainerWorkoutContainer } from '../payments/styles.ts';
import IconBeer from '../../icons/workout-icons/beer.png'
import { MdProductionQuantityLimits } from "react-icons/md";
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import ProductService from '../../services/product.service.ts';
import CustomerService from '../../services/customer.service.ts';
import PaymentService from '../../services/payment.service.ts';
import CalendarService from '../../services/calendar.service.ts';
import UserNoImage from '../../images/user.png'
import Slider from '../slider/index.tsx';

const PieChartExample = ({ paymentTableData }) => {
  const paymentStatusData = paymentTableData.reduce((acc, payment) => {
    const status = payment.status || 'Unknown';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const data = Object.entries(paymentStatusData).map(([name, value]) => ({
    name,
    value,
  }));

  const noDataAvailable = data.length === 0;
  const displayData = noDataAvailable ? [{ name: 'Sem Dados', value: 1 }] : data;
  const COLORS = noDataAvailable ? ['#CCCCCC'] : ['#d9fd57', '#97b026', '#FFBB28', '#bce05a'];

  return (
    <PieChart width={400} height={280}>
      <Pie
        data={displayData}
        cx="50%"
        cy="50%"
        outerRadius={120}
        fill="#8884d8"
        label={noDataAvailable ? () => 'No Data' : undefined}
      >
        {displayData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  );
};


const Home: React.FC<{ activeCompany, userData, activateModule }> = ({ ...props }) => {
  const [productTableData, setProductTableData] = useState([]);
  const [customerTableData, setCustomerTableData] = useState([]);
  const [paymentTableData, setPaymentTableData] = useState([]);
  const [calendarTableData, setCalendarTableData] = useState([]);
  const [todayEvent, setTodayEvent] = useState(null);

  useEffect(() => {
    if (props.activeCompany) {
      ProductService.get(props.activeCompany)
        .then((res) => setProductTableData(res.data))
        .catch((err) => console.log(err));

        CustomerService.get(props.activeCompany)
        .then((res) => setCustomerTableData(res.data))
        .catch((err) => console.log(err));

        PaymentService.get(props.activeCompany)
          .then((res) => setPaymentTableData(res.data))
          .catch((err) => console.log(err));

          CalendarService.get({ companyId: props.activeCompany, userId: props.userData._id })
          .then((res) => {
            setCalendarTableData(res.data);
            const today = new Date().toISOString().slice(0, 10);
            const eventToday = res.data.find(event => event.date.startsWith(today));
            setTodayEvent(eventToday);
          })
          .catch((err) => console.log(err));
    }
  }, [props.activeCompany]);

      const renderProduct = (product) => (
        <div style={{
          padding: '16px',
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          maxWidth: '300px',
          textAlign: 'center',
        }}>
          <img
            src={product.imageUrl || 'https://via.placeholder.com/150'}
            alt={product.name}
            style={{
              width: '100%',
              height: 'auto',
              borderRadius: '8px',
              objectFit: 'cover',
            }}
          />
          <h3 style={{
            margin: '12px 0 8px',
            fontSize: '1.2rem',
            fontWeight: '600',
            color: '#333',
          }}>{product.name}</h3>
          <p style={{
            margin: 0,
            fontSize: '0.9rem',
            color: '#777',
          }}>{product.category}</p>
        </div>
      );

      const getTodayDate = () => {
        const today = new Date();
        return today.getDate();
      };

      const checkLowestProductInStock = () => {
        if (!productTableData || productTableData.length === 0) {
          return null; // Return null if no products are available
        }

        const lowestProduct = productTableData.reduce((lowest, product) => {
          return (product.quantityInStock < lowest.quantityInStock) ? product : lowest;
        });

        return {name:lowestProduct.name, image:''};
      };



   return (
        <TrainContainer>
            <div>
                <h1>Olá! {props.userData? props.userData.name : ''}</h1>
                <h4 style={{color:'rgba(0,0,0,0.5)', marginTop:'-2%'}}>Aqui está as informações da empresa</h4>
            </div>
            <TrainContainerHeader>
            <div>
            <PieChartExample paymentTableData={paymentTableData} />
                <br/><br/>
            </div>
            <div style={{display:'flex', flexDirection:'column', marginRight:'9%', height:'100%'}}>
            <TrainContainerRecommendTrainerWideCard>
            <TrainContainerRecommendTrainerWideCardLeft>
              <FaCalendar size={window.outerWidth > 600 ? 40 : 60} />
              <p style={{ marginTop: window.outerWidth > 600 ? '-75%' : '-65%', marginLeft: window.outerWidth > 600 ? '39%' : '48%', color: 'white' }}>
                {getTodayDate()}
              </p>
            </TrainContainerRecommendTrainerWideCardLeft>
            <TrainContainerRecommendTrainerWideCardRight style={{marginTop:'-4%'}}>
              <h5>{todayEvent ? todayEvent.name : "Agendar Evento"}</h5>
              <p style={{ marginTop: '-13%', fontSize: '10pt' }}>
                {todayEvent ? todayEvent.description : "Nenhum evento hoje"}
              </p>
              <TrainContainerRecommendTrainerWideCardRightButton onClick={() => props.activateModule('Calendário')}>Ver Agenda Completa</TrainContainerRecommendTrainerWideCardRightButton>
            </TrainContainerRecommendTrainerWideCardRight>
          </TrainContainerRecommendTrainerWideCard>
                <TrainContainerRecommendTrainerWideCard>
                <TrainContainerRecommendTrainerWideCardLeft style={{width:'100%',marginRight:'-10%'}}>
                        <MdProductionQuantityLimits size={40} style={{width:'40%', marginTop:'0%'}}/>
                </TrainContainerRecommendTrainerWideCardLeft>
                    <TrainContainerRecommendTrainerWideCardRight style={{ marginLeft:'-7%', marginTop:window.outerWidth > 600?'-5%':'2%', marginRight:window.outerWidth > 600?'7%':'15%'}}>
                        <h5>{checkLowestProductInStock()? checkLowestProductInStock().name : ''}</h5>
                        <p style={{marginTop:'-13%', fontSize:'10pt'}}>Está no fim</p>
                        <div style={{display:'flex'}}>
                            <TrainContainerRecommendTrainerWideCardRightCancel>Remover</TrainContainerRecommendTrainerWideCardRightCancel>
                            <TrainContainerRecommendTrainerWideCardRightConfirm>Confirmar</TrainContainerRecommendTrainerWideCardRightConfirm>
                        </div>
                    </TrainContainerRecommendTrainerWideCardRight>
                </TrainContainerRecommendTrainerWideCard>
            </div>
            <div style={{display:'flex', flexDirection:'row'}}>
            <StreakContainerWorkoutContainer style={{width:window.outerWidth > 600?'70%':'87%', height:'280px',border:'1px rgba(0,0,0,0.3) solid', marginTop:window.outerWidth > 600?'0%':'18%' , marginBottom:window.outerWidth > 600?'0%':'6%'}}>
            {customerTableData.length > 0 ? customerTableData.map((list)=>{
                  return(
                <StreakContainerWorkoutElement>
                  <StreakContainerWorkoutElementIcon style={{marginTop:'2.5%'}}>
                    <img style={{width:'75%', marginLeft:'13%' ,borderRadius:10, marginTop:'17%'}} src={UserNoImage}/>
                  </StreakContainerWorkoutElementIcon>
                  <StreakContainerWorkoutElementParagraphContainer>
                    <StreakContainerWorkoutElementParagraph>
                      {list.name ? list.name : ''}
                    </StreakContainerWorkoutElementParagraph>
                    <StreakContainerWorkoutElementParagraph2>
                      {list.email ? list.email : ''}
                    </StreakContainerWorkoutElementParagraph2>
                  </StreakContainerWorkoutElementParagraphContainer>
                </StreakContainerWorkoutElement>
                )}): <StreakContainerWorkoutElement style={{width:'500px', textAlign:'center'}}></StreakContainerWorkoutElement>}
            </StreakContainerWorkoutContainer>
            </div>
            </TrainContainerHeader>
            <br/>
            <div style={{marginTop:'0%'}}>
                <TrainContainerRecommendTrainerContainer>
                  <Slider items={productTableData} renderItem={renderProduct}/>
                </TrainContainerRecommendTrainerContainer>
            </div>
        </TrainContainer>
    );
}

export default Home;