import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Bar, BarChart } from 'recharts';
import {
  HomeContainerBody,
  HomeContainerHeader,
  StreakContainer,
  StreakContainerWorkoutContainer,
  StreakContainerWorkoutElement,
  StreakContainerWorkoutElementIcon,
  StreakContainerWorkoutElementParagraph,
  StreakContainerWorkoutElementParagraph2,
  StreakContainerWorkoutElementParagraphContainer,
} from './styles.ts';
import IconBeer from '../../icons/workout-icons/beer.png';
import IconCard from '../../icons/workout-icons/card.png';
import IconTax from '../../icons/workout-icons/tax.png';
import IconAvg from '../../icons/workout-icons/avg-price.png';
import IconReceita from '../../icons/workout-icons/receita.png';
import PaymentService from '../../services/payment.service.ts';

const Payments: React.FC<{ activeCompany }> = ({ ...props }) => {
  const [tableData, setTableData] = useState([]);
  const [glanceData, setGlanceData] = useState();

  useEffect(() => {
    if (props.activeCompany) {
      PaymentService.get(props.activeCompany)
        .then((res) => setTableData(res.data))
        .catch((err) => console.log(err));

      PaymentService.glance(props.activeCompany)
        .then((res) => setGlanceData(res.data))
        .catch((err) => console.log(err));
    }
  }, [props.activeCompany]);

  const chartData = tableData.map((payment) => ({
    paymentDate: new Date(payment.paymentDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    total: parseFloat(payment.amount),
  }));

  const SimpleLineChart = () => (
    <div style={{ background: 'white', padding: '50px', borderRadius: 10, minHeight: '240px', maxHeight: '240px' }}>
      <LineChart style={{ marginLeft: '-2%', fontSize: '12pt' }} width={650} height={260} data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="paymentDate" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="total" stroke="#82ca9d" />
      </LineChart>
    </div>
  );

  const MobileLineChart = () => (
    <div style={{ width: '100%', height: '100%' }}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="paymentDate" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="total" fill="#82ca9d" />
      </BarChart>
    </div>
  );

  return (
    <div>
      <HomeContainerHeader>Área de pagamentos</HomeContainerHeader>
      <HomeContainerHeader style={{ marginTop: '-7%', fontSize: '15pt', marginBottom: '1%', color: 'rgba(0,0,0,0.5)' }}>
        Informações financeiras
      </HomeContainerHeader>
      <HomeContainerBody>
        {window.outerWidth > 600 ? <SimpleLineChart /> : <MobileLineChart />}
        <StreakContainer>
          <StreakContainerWorkoutContainer>
            {tableData.map((payment) => (
              <StreakContainerWorkoutElement key={payment.id}>
                <StreakContainerWorkoutElementIcon>
                  <img style={{ width: '70%', margin: 6, borderRadius: 10 }} src={payment.image} />
                </StreakContainerWorkoutElementIcon>
                <StreakContainerWorkoutElementParagraphContainer>
                  <StreakContainerWorkoutElementParagraph>{payment.description}</StreakContainerWorkoutElementParagraph>
                  <StreakContainerWorkoutElementParagraph2>{payment.amount}</StreakContainerWorkoutElementParagraph2>
                </StreakContainerWorkoutElementParagraphContainer>
              </StreakContainerWorkoutElement>
            ))}
          </StreakContainerWorkoutContainer>
        </StreakContainer>
      </HomeContainerBody>

      <div style={{ display: 'flex', marginTop: '-3%' }}>
        <StreakContainer style={{ width: '280px', height: '185px', marginLeft: '0%', marginRight: '6%' }}>
          <div style={{ textAlign: 'center' }}>
            <img style={{ width: '40%', borderRadius: 10, marginTop: '3%' }} src={IconReceita} />
            <h1 style={{ marginTop: '-5%' }}>R${glanceData ? glanceData.totalAmount : ''}</h1>
            <p style={{ marginTop: '-8%' }}>Total de Receitas Anual</p>
          </div>
        </StreakContainer>
        <StreakContainer style={{ width: '280px', height: '185px', marginLeft: '0%', marginRight: '6%' }}>
          <div style={{ textAlign: 'center' }}>
            <img style={{ width: '40%', borderRadius: 10 }} src={IconCard} />
            <h1 style={{ marginTop: '-5%' }}>{glanceData ? glanceData.count : ''}</h1>
            <p style={{ marginTop: '-8%' }}>Transações processadas</p>
          </div>
        </StreakContainer>
        <StreakContainer style={{ width: '280px', height: '185px', marginLeft: '0%', marginRight: '6%' }}>
          <div style={{ textAlign: 'center' }}>
            <img style={{ width: '37%', borderRadius: 10, marginTop: '5%' }} src={IconAvg} />
            <h1 style={{ marginTop: '-0%' }}>R${glanceData ? glanceData.averageTicket : ''}</h1>
            <p style={{ marginTop: '-8%' }}>Ticket Médio</p>
          </div>
        </StreakContainer>
        <StreakContainer style={{ width: '280px', height: '185px', marginLeft: '0%' }}>
          <div style={{ textAlign: 'center' }}>
            <img style={{ width: '30%', borderRadius: 10, marginTop: '10%' }} src={IconTax} />
            <h1 style={{ marginTop: '-3%' }}>R${glanceData ? glanceData.taxes.toFixed(2) : ''}</h1>
            <p style={{ marginTop: '-8%' }}>Taxas</p>
          </div>
        </StreakContainer>
      </div>
    </div>
  );
};

export default Payments;
