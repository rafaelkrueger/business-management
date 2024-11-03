import styled from "styled-components";
import { shimmer } from "../../global.styles.ts";


export const HomeContainerHeader = styled.h1`
    margin-bottom:8%;
    @media (max-width:600px) {
        margin-top:95px ;
    }
`

export const HomeContainerHeaderButtonsContainer = styled.div`
    display: flex;
    position: absolute;
    top: 40px;
    right:-110px;
    @media (max-width:600px) {
        position: relative;
        top: 0px;
        right:0px;
        justify-content: space-around;
        width:100%;
        margin-left: -90%;
        margin-top: 10%;
    }
`

export const HomeContainerHeaderButtonsElementDiv = styled.div`
    margin-right: -90%;
    @media (max-width:600px) {
        margin-left: 0%;
    }

`

export const HomeContainerHeaderButtonsElement = styled.button`
    background-color: black;
    width: 100px;
    height: 40px;
    color: white;
    font-weight: 600;
    border-radius: 10px;
    @media (max-width:600px) {
        background-color: black;
        width: 100px;
        height: 40px;
        color: white;
        border-radius: 10px;
    }

`

export const HomeContainerBody = styled.h1`
    display: flex;
    @media (max-width:600px) {
        flex-direction: column;
        align-items: center;
        font-size: 10pt;
    }
`


export const StreakContainer = styled.div`
    height: 340px;
    width: 370px;
    margin-left: 3%;
    margin-right: -3%;
    border-radius: 10px;
    margin-bottom: 70px;
    box-shadow: 1px 1px 10px rgba(0,0,0,0.1);
    font-size: 12pt;
    background-color: white;
    /* background: linear-gradient(to right, #f0f0f0 8%, #e0e0e0 18%, #f0f0f0 33%); */
    background-size: 1000px 100%;
    @media (max-width:600px) {
        width: 104%;
        margin-top:5%;
        margin-left: 3%;
    }
`;

export const StreakContainerWorkoutContainer = styled.div`
    display: flex;
    flex-direction: column;
    background-color: white;
    max-height: 100%; /* Take the maximum height available */
    overflow-y: auto; /* Enable vertical scrolling when needed */
    height: 100%;
    scrollbar-width: thin;
    scrollbar-color: black transparent; /* Set the color of the scrollbar */

    /* Adjust the track color */
    &::-webkit-scrollbar-track {
        background-color: transparent;
    }

    /* Adjust the thumb color */
    &::-webkit-scrollbar-thumb {
        background-color: rgba(0,0,0,0.5);
        border-radius: 20px; /* Rounded corners */
    }

    /* Adjust the thumb color on hover */
    &::-webkit-scrollbar-thumb:hover {
        background-color: #555; /* Darker black color on hover */
    }
`;

export const StreakContainerWorkoutElement = styled.div`
    padding-left: 5%;
    font-size: 13pt;
    height: 50px;
    min-height: 65px;
    border-bottom: 1px rgba(0,0,0,0.4) solid;
    max-height: max-content;
    display: flex;
`;

export const StreakContainerWorkoutElementIcon = styled.div`
    min-width:12%;
    max-width: 12%;
    min-height: 60%;
    max-height: 60%;
    margin-right: 6%;
    margin-top: 5%;
    background-color: rgba(0,0,0,0.1);
    border-radius: 5px;
`;


export const StreakContainerWorkoutElementParagraphContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

export const StreakContainerWorkoutElementParagraph = styled.p`
    margin-top: 12%;
    font-size: 10pt;
    color: rgba(0,0,0,0.9);
`;

export const StreakContainerWorkoutElementParagraph2 = styled.p`
    margin-top: -11%;
    font-size: 8pt;
    color: rgba(0,0,0,0.5);
`;
