import React, {useState, useEffect} from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Bar, BarChart } from 'recharts';
import { HomeContainerBody, HomeContainerHeader, HomeContainerHeaderButtonsContainer, HomeContainerHeaderButtonsElement, HomeContainerHeaderButtonsElementDiv, StreakContainer, StreakContainerWorkoutContainer, StreakContainerWorkoutElement, StreakContainerWorkoutElementIcon, StreakContainerWorkoutElementParagraph, StreakContainerWorkoutElementParagraph2, StreakContainerWorkoutElementParagraphContainer } from './styles.ts';
import IconBeer from '../../icons/workout-icons/beer.png'
import IconCard from '../../icons/workout-icons/card.png'
import IconTax from '../../icons/workout-icons/tax.png'
import IconAvg from '../../icons/workout-icons/avg-price.png'
import IconReceita from '../../icons/workout-icons/receita.png'


const data = [
  { name: 'Jan', total: 4000, amt: 2400 },
  { name: 'Fev', total: 3000, amt: 2210 },
  { name: 'Mar', total: 2000, amt: 2290 },
  { name: 'Abr', total: 2780, amt: 2000 },
  { name: 'Mar', total: 1890, amt: 2181 },
  { name: 'Jun', total: 2390, amt: 2500 },
  { name: 'Jul', total: 3490, amt: 2100 },
  { name: 'Ago', total: 3490, amt: 2100 },
  { name: 'Set', total: 3490, amt: 2100 },
  { name: 'Out', total: 3490, amt: 2100 },
  { name: 'Nov', total: 3490, amt: 2100 },
  { name: 'Dez', total: 3490, amt: 2100 },
];

const SimpleLineChart = () => {
  return (
    <div style={{background:'white', padding:'50px 50px 0px 50px', borderRadius:10, minHeight:'290px', maxHeight:'290px'}}>
    <LineChart style={{marginLeft:'-2%', fontSize:'12pt'}} width={650} height={260} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="total" stroke="#82ca9d" />
    </LineChart>
    </div>
  );
}

const MobileLineChart = () => {
    return (
      <div style={{width:'100%', height:'100%'}}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="total" fill="#82ca9d" />
      </BarChart>
      </div>
    );
  }

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

  export const workout = [
    {
      icon:'leg',
      name:'Pilsen',
      quantity:'132',
    },
    {
      icon:'arm',
      name:'American Lager',
      quantity:'130',
    },

    {
      icon:'back',
      name:'Vienna Lagger',
      quantity:'125',
    },

    {
      icon:'leg',
      name:'Dunkel',
      quantity:'123',
    },

    {
      icon:'back',
      name:'Bock',
      quantity:'123',
    },
  ]

const Payments: React.FC = () => {
  return (
    <div>
        <HomeContainerHeader>Área de pagamentos</HomeContainerHeader>
        <HomeContainerHeader style={{marginTop:'-7%', fontSize:'15pt', marginBottom:'1%', color:'rgba(0,0,0,0.5)'}}>Informações financeiras</HomeContainerHeader>
        <HomeContainerBody>
            {window.outerWidth > 600?SimpleLineChart():SimpleLineChart()}
            {/* <HomeContainerHeaderButtonsContainer>
              <HomeContainerHeaderButtonsElementDiv>
                <HomeContainerHeaderButtonsElement>Cervejas</HomeContainerHeaderButtonsElement>
              </HomeContainerHeaderButtonsElementDiv>
              <HomeContainerHeaderButtonsElementDiv>
                <HomeContainerHeaderButtonsElement>Resultados</HomeContainerHeaderButtonsElement>
              </HomeContainerHeaderButtonsElementDiv>
              <HomeContainerHeaderButtonsElementDiv>
                <HomeContainerHeaderButtonsElement>Relatórios</HomeContainerHeaderButtonsElement>
              </HomeContainerHeaderButtonsElementDiv>
            </HomeContainerHeaderButtonsContainer> */}
            <div style={{display:window.outerWidth > 600?'none':'block', textAlign:'left', marginLeft:'2%', marginBottom:'-2%', marginTop:'10%'}}>
              <h2>Sua Lista de Cervejas disponíveis</h2>
            </div>
            <StreakContainer>
              <StreakContainerWorkoutContainer>
                {workout.map((list)=>{
                  return(
                <StreakContainerWorkoutElement>
                  <StreakContainerWorkoutElementIcon>
                    <img style={{width:'70%', margin:6, borderRadius:10}} src={getIcon(list.icon)}/>
                  </StreakContainerWorkoutElementIcon>
                  <StreakContainerWorkoutElementParagraphContainer>
                    <StreakContainerWorkoutElementParagraph>
                      {list.name}
                    </StreakContainerWorkoutElementParagraph>
                    <StreakContainerWorkoutElementParagraph2>
                      {list.quantity}
                    </StreakContainerWorkoutElementParagraph2>
                  </StreakContainerWorkoutElementParagraphContainer>
                </StreakContainerWorkoutElement>
                )})}
              </StreakContainerWorkoutContainer>
            </StreakContainer>
        </HomeContainerBody>
        <div style={{display:'flex', marginTop:'-3%'}}>
        <StreakContainer style={{width:'280px', height:'185px', marginLeft:'0%', marginRight:'6%'}}>
          <div style={{textAlign:'center'}}>
              <img style={{width:'40%', borderRadius:10, marginTop:'3%'}} src={IconReceita}/>
            <h1 style={{marginTop:'-5%'}}>R$2.100</h1>
            <p style={{marginTop:'-8%'}}>Total de Receitas Anual</p>
          </div>
        </StreakContainer>
        <StreakContainer style={{width:'280px', height:'185px', marginLeft:'0%', marginRight:'6%'}}>
          <div style={{textAlign:'center'}}>
              <img style={{width:'40%', borderRadius:10}} src={IconCard}/>
            <h1 style={{marginTop:'-5%'}}>212</h1>
            <p style={{marginTop:'-8%'}}>Transações processadas</p>
          </div>
        </StreakContainer>
        <StreakContainer style={{width:'280px', height:'185px', marginLeft:'0%', marginRight:'6%'}}>
          <div style={{textAlign:'center'}}>
              <img style={{width:'37%', borderRadius:10, marginTop:'5%'}} src={IconAvg}/>
            <h1 style={{marginTop:'-0%'}}>R$22.20</h1>
            <p style={{marginTop:'-8%'}}>Ticket Médio</p>
          </div>
        </StreakContainer>
        <StreakContainer style={{width:'280px', height:'185px', marginLeft:'0%'}}>
          <div style={{textAlign:'center'}}>
              <img style={{width:'30%', borderRadius:10, marginTop:'10%'}} src={IconTax}/>
            <h1 style={{marginTop:'-3%'}}>R$202.49</h1>
            <p style={{marginTop:'-8%'}}>Impostos e Taxas</p>
          </div>
        </StreakContainer>
        </div>
    </div>
  );
}

export default Payments;