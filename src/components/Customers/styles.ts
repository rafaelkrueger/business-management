import styled from "styled-components";
import { IoStar } from "react-icons/io5";


export const TrainContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: -1%;
    margin-bottom: 5%;
    @media (max-width:600px) {
        margin-top:10%;
        margin-left: 9%;
    }
`

export const TrainContainerHeader = styled.div`
    display: flex;
    @media (max-width:600px) {
        flex-direction: column;
        width: 100%;
    }
`


export const TrainContainerRecommendTrainerContainer = styled.div`
    display: flex;
    width: 170%;
    @media (max-width:600px) {
        flex-wrap: wrap;
        max-width: 100%;

    }

`

export const TrainContainerRecommendTrainerCard = styled.div`
    min-width: 160px;
    max-width: 160px;
    background-color: rgba(255,255,255,0.01);
    padding: 5px;
    padding-bottom: 20px;
    display: flex;
    flex-direction: column;
    margin-right: 3%;
    width: 100%;
    @media (max-width:600px) {
        min-width: 10%;
        margin-bottom: 10%;
    }

`

export const TrainContainerRecommendTrainerCardImage = styled.img`
    width: 40%;
    margin-left: 30%;
    margin-bottom: -5%;
`

export const TrainContainerRecommendTrainerCardH3 = styled.h5`
    text-align: center;
`

export const TrainContainerRecommendTrainerCardP = styled.p`
    text-align: center;
    margin-top:-7%;
    color: rgba(0,0,0,0.7);
`

export const TrainContainerRecommendTrainerCardRate = styled.p`
    margin-top: -5%;
    text-align: center;
`
export const TrainContainerRecommendTrainerCardRateStar = styled(IoStar)`
    text-align: center;
`

export const TrainContainerRecommendTrainerCardButton = styled.button`
    width: 70%;
    height: 30px;
    background-color: #252525;
    border: 0px white solid;
    color: white;
    border-radius: 5px;
    margin: auto;
    &:hover{
        cursor: pointer;
        background-color: rgba(0,0,0,0.75);
    }
`

export const TrainContainerRecommendTrainerWideCard = styled.div`
    width: 250px;
    height: 100px;
    background-color: rgba(255,255,255,0.7);
    margin-left: 18%;
    margin-bottom: 15%;
    border-radius: 10px;
    display: flex;
    flex-direction: row;
    &:hover{
        cursor: pointer;
    }
    @media (max-width:600px) {
        margin-left: 1.5%;
        margin-top: 15%;
        margin-bottom: -5%;
        width:95%;
        height: 150px;
    }
`

export const TrainContainerRecommendTrainerWideCardLeft = styled.div`
    margin-right: 10%;
    margin-left:7%;
    margin-top: 10%;
    &:hover{
        cursor: pointer;
    }
    @media (max-width:600px) {
    }
`
export const TrainContainerRecommendTrainerWideCardRight = styled.div`
    margin-top: 10%;
    &:hover{
        cursor: pointer;
    }
    @media (max-width:600px) {
    }
`

export const TrainContainerRecommendTrainerWideCardRightButton = styled.button`
    background:#3e8ed3;
    border: 0px white solid;
    color:white;
    padding:4px;
    border-radius: 3px;
    &:hover{
        cursor: pointer;
    }
    @media (max-width:600px) {
    }
`

export const TrainContainerRecommendTrainerWideCardRightCancel = styled.button`
    background:#c42929;
    border: 0px white solid;
    color:white;
    padding:4px;
    border-radius: 2px;
    &:hover{
        cursor: pointer;
    }
    @media (max-width:600px) {
    }
`

export const TrainContainerRecommendTrainerWideCardRightConfirm = styled.button`
    background:#2e8b57;
    border: 0px white solid;
    color:white;
    padding:4px;
    border-radius: 2px;
    margin-left: 5%;
    &:hover{
        cursor: pointer;
    }
    @media (max-width:600px) {
    }
`

export const TableWrapperCustomer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  margin-top: 2%;
`;