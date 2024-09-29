import styled from "styled-components";
import { IoMdMenu } from "react-icons/io";


export const DashboardContainer = styled.div`
    display: flex;
    flex-direction: row;
`

export const DashboardContainerShowed = styled.div`
    margin-left: 5%;
    margin-top: 1%;
`

export const DashboardContainerIcon = styled(IoMdMenu)`
    width: 10%;
    height: 5%;
    padding: 5px;
    position: absolute;
    background-color: black;
    margin-left: 3%;
    margin-top: 3%;
    color: white;
    border-radius: 50px;
`