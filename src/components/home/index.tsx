import React from 'react'
import { TrainContainer, TrainContainerHeader, TrainContainerRecommendTrainerCard, TrainContainerRecommendTrainerCardButton, TrainContainerRecommendTrainerCardH3, TrainContainerRecommendTrainerCardImage, TrainContainerRecommendTrainerCardP, TrainContainerRecommendTrainerCardRate, TrainContainerRecommendTrainerCardRateStar, TrainContainerRecommendTrainerContainer, TrainContainerRecommendTrainerWideCard, TrainContainerRecommendTrainerWideCardLeft, TrainContainerRecommendTrainerWideCardRight, TrainContainerRecommendTrainerWideCardRightButton, TrainContainerRecommendTrainerWideCardRightCancel, TrainContainerRecommendTrainerWideCardRightConfirm } from './styles.ts';
import { IoStar } from "react-icons/io5";
import { FaCalendar } from "react-icons/fa6";
import UserNoImage from '../../images/user.png'
import { workout } from '../payments/index.tsx';
import { StreakContainerWorkoutElement, StreakContainerWorkoutElementIcon, StreakContainerWorkoutElementParagraphContainer, StreakContainerWorkoutElementParagraph, StreakContainerWorkoutElementParagraph2, StreakContainerWorkoutContainer } from '../payments/styles.ts';
import IconBeer from '../../icons/workout-icons/beer.png'
import IconNoBeer from '../../icons/workout-icons/no-beer.png'
import { PieChart, Pie, Cell, Tooltip } from 'recharts';

const PieChartExample = () => {
  const data = [
    { name: 'Pilsen', value: 400 },
    { name: 'American Lager', value: 300 },
    { name: 'Vienna Lagger', value: 300 },
    { name: 'Dunkel', value: 200 },
  ];

  const COLORS = ['#d9fd57', '#97b026', '#FFBB28', '#bce05a'];  


  return (
    <PieChart width={400}  
 height={280}>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        outerRadius={120}
        fill="#8884d8"
        label
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip  
 />
    </PieChart>
  );
};


const Home: React.FC = () => {

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
            <TrainContainerHeader>
            <div>
                {PieChartExample()}
                <br/><br/>
            </div>
            <div style={{display:'flex', flexDirection:'column', marginRight:'9%', height:'100%'}}>
                <TrainContainerRecommendTrainerWideCard>
                    <TrainContainerRecommendTrainerWideCardLeft>
                        <FaCalendar size={window.outerWidth > 600?40:60} style={{marginLeft:window.outerWidth > 600?'0%':'12%', marginTop:window.outerWidth > 600?'0%':'10%'}}/>
                        <p style={{marginTop:window.outerWidth > 600?'-75%':'-65%', marginLeft:window.outerWidth > 600?'29%':'48%', color:'white'}}>31</p>
                    </TrainContainerRecommendTrainerWideCardLeft>
                    <TrainContainerRecommendTrainerWideCardRight style={{ marginLeft:'3%', marginTop:window.outerWidth > 600?'-5%':'2%', marginLeft:window.outerWidth > 600?'0%':'11%'}}>
                        <h5>Agendar configuração</h5>
                        <p style={{marginTop:'-13%', fontSize:'10pt'}}>Especialidade</p>
                        <TrainContainerRecommendTrainerWideCardRightButton>Ver Agenda Completa</TrainContainerRecommendTrainerWideCardRightButton>
                    </TrainContainerRecommendTrainerWideCardRight>
                </TrainContainerRecommendTrainerWideCard>
                <TrainContainerRecommendTrainerWideCard>
                <TrainContainerRecommendTrainerWideCardLeft style={{width:'100%',marginRight:'-10%'}}>
                        <img style={{width:'40%', marginTop:'-2%'}} src={IconNoBeer}/>
                </TrainContainerRecommendTrainerWideCardLeft>
                    <TrainContainerRecommendTrainerWideCardRight style={{ marginLeft:'-7%', marginTop:window.outerWidth > 600?'-5%':'2%', marginRight:window.outerWidth > 600?'7%':'15%'}}>
                        <h5>Nome da cerveja</h5>
                        <p style={{marginTop:'-13%', fontSize:'10pt'}}>Está no fim</p>
                        <div style={{display:'flex'}}>
                            <TrainContainerRecommendTrainerWideCardRightCancel>Remover</TrainContainerRecommendTrainerWideCardRightCancel>
                            <TrainContainerRecommendTrainerWideCardRightConfirm>Confirmar</TrainContainerRecommendTrainerWideCardRightConfirm>
                        </div>
                    </TrainContainerRecommendTrainerWideCardRight>
                </TrainContainerRecommendTrainerWideCard>
            </div>
            <div style={{display:'flex', flexDirection:'row'}}>
            <StreakContainerWorkoutContainer style={{width:window.outerWidth > 600?'70%':'87%', maxHeight:window.outerWidth > 600?'238px':'400px' ,border:'1px rgba(0,0,0,0.3) solid', marginTop:window.outerWidth > 600?'0%':'18%' , marginBottom:window.outerWidth > 600?'0%':'6%'}}>
            {workout.map((list)=>{
                  return(
                <StreakContainerWorkoutElement>
                  <StreakContainerWorkoutElementIcon style={{marginTop:'2.5%'}}>
                    <img style={{width:'55%', marginLeft:'25%' ,borderRadius:10, marginTop:'17%'}} src={getIcon(list.icon)}/>
                  </StreakContainerWorkoutElementIcon>
                  <StreakContainerWorkoutElementParagraphContainer style={{marginTop:'2.5%'}}>
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
            </div>
            </TrainContainerHeader>
            <br/>
            <div style={{marginTop:'-4%'}}>
                <h2>Configure suas cervejas! (slider)</h2>
                <TrainContainerRecommendTrainerContainer>
                    <TrainContainerRecommendTrainerCard>
                        <TrainContainerRecommendTrainerCardImage src={IconBeer}></TrainContainerRecommendTrainerCardImage>
                        <TrainContainerRecommendTrainerCardH3>Nome da cerveja</TrainContainerRecommendTrainerCardH3>
                        <TrainContainerRecommendTrainerCardP>Especialidade</TrainContainerRecommendTrainerCardP>
                        <TrainContainerRecommendTrainerCardRate><TrainContainerRecommendTrainerCardRateStar color="yellow"/><TrainContainerRecommendTrainerCardRateStar color="yellow"/><TrainContainerRecommendTrainerCardRateStar color="yellow"/><TrainContainerRecommendTrainerCardRateStar color="yellow"/><TrainContainerRecommendTrainerCardRateStar color="yellow"/></TrainContainerRecommendTrainerCardRate>
                        <TrainContainerRecommendTrainerCardButton>Configurar</TrainContainerRecommendTrainerCardButton>
                    </TrainContainerRecommendTrainerCard>
                    <TrainContainerRecommendTrainerCard>
                        <TrainContainerRecommendTrainerCardImage src={IconBeer}></TrainContainerRecommendTrainerCardImage>
                        <TrainContainerRecommendTrainerCardH3>Nome da cerveja</TrainContainerRecommendTrainerCardH3>
                        <TrainContainerRecommendTrainerCardP>Especialidade</TrainContainerRecommendTrainerCardP>
                        <TrainContainerRecommendTrainerCardRate><TrainContainerRecommendTrainerCardRateStar color="yellow"/><TrainContainerRecommendTrainerCardRateStar color="yellow"/><TrainContainerRecommendTrainerCardRateStar color="yellow"/><TrainContainerRecommendTrainerCardRateStar color="yellow"/><TrainContainerRecommendTrainerCardRateStar color="yellow"/></TrainContainerRecommendTrainerCardRate>
                        <TrainContainerRecommendTrainerCardButton>Configurar</TrainContainerRecommendTrainerCardButton>
                    </TrainContainerRecommendTrainerCard>
                    <TrainContainerRecommendTrainerCard>
                        <TrainContainerRecommendTrainerCardImage src={IconBeer}></TrainContainerRecommendTrainerCardImage>
                        <TrainContainerRecommendTrainerCardH3>Nome da cerveja</TrainContainerRecommendTrainerCardH3>
                        <TrainContainerRecommendTrainerCardP>Especialidade</TrainContainerRecommendTrainerCardP>
                        <TrainContainerRecommendTrainerCardRate><TrainContainerRecommendTrainerCardRateStar color="yellow"/><TrainContainerRecommendTrainerCardRateStar color="yellow"/><TrainContainerRecommendTrainerCardRateStar color="yellow"/><TrainContainerRecommendTrainerCardRateStar color="yellow"/><TrainContainerRecommendTrainerCardRateStar color="yellow"/></TrainContainerRecommendTrainerCardRate>
                        <TrainContainerRecommendTrainerCardButton>Configurar</TrainContainerRecommendTrainerCardButton>
                    </TrainContainerRecommendTrainerCard>
                    <TrainContainerRecommendTrainerCard>
                        <TrainContainerRecommendTrainerCardImage src={IconBeer}></TrainContainerRecommendTrainerCardImage>
                        <TrainContainerRecommendTrainerCardH3>Nome da cerveja</TrainContainerRecommendTrainerCardH3>
                        <TrainContainerRecommendTrainerCardP>Especialidade</TrainContainerRecommendTrainerCardP>
                        <TrainContainerRecommendTrainerCardRate><TrainContainerRecommendTrainerCardRateStar color="yellow"/><TrainContainerRecommendTrainerCardRateStar color="yellow"/><TrainContainerRecommendTrainerCardRateStar color="yellow"/><TrainContainerRecommendTrainerCardRateStar color="yellow"/><TrainContainerRecommendTrainerCardRateStar color="yellow"/></TrainContainerRecommendTrainerCardRate>
                        <TrainContainerRecommendTrainerCardButton>Configurar</TrainContainerRecommendTrainerCardButton>
                    </TrainContainerRecommendTrainerCard>
                    <TrainContainerRecommendTrainerCard>
                        <TrainContainerRecommendTrainerCardImage src={IconBeer}></TrainContainerRecommendTrainerCardImage>
                        <TrainContainerRecommendTrainerCardH3>Nome da cerveja</TrainContainerRecommendTrainerCardH3>
                        <TrainContainerRecommendTrainerCardP>Especialidade</TrainContainerRecommendTrainerCardP>
                        <TrainContainerRecommendTrainerCardRate><TrainContainerRecommendTrainerCardRateStar color="yellow"/><TrainContainerRecommendTrainerCardRateStar color="yellow"/><TrainContainerRecommendTrainerCardRateStar color="yellow"/><TrainContainerRecommendTrainerCardRateStar color="yellow"/><TrainContainerRecommendTrainerCardRateStar color="yellow"/></TrainContainerRecommendTrainerCardRate>
                        <TrainContainerRecommendTrainerCardButton>Configurar</TrainContainerRecommendTrainerCardButton>
                    </TrainContainerRecommendTrainerCard>

                </TrainContainerRecommendTrainerContainer>
            </div>
        </TrainContainer>
    );
}

export default Home;