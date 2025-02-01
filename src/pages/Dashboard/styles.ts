import styled from "styled-components";
import { IoMdMenu } from "react-icons/io";


export const DashboardContainer = styled.div`
    display: flex;
    flex-direction: row;
    min-width: 100%;
`

export const DashboardContainerShowed = styled.div`
  width: calc(100% - 5%);
  height: 100vh;
  margin-left: 5%;
  margin-top: 1%;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 5%;

  @media (max-width: 600px) {
    width: calc(100% - 1%);
    margin-left: 1%;
    margin-top: 5%;
    padding-right: 0%;
  }

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #888;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: #555;
  }
`;


export const DashboardContainerIcon = styled(IoMdMenu)`
    width: 10%;
    height: 5%;
    padding: 5px;
    position: fixed;
    background-color: black;
    margin-left: 3%;
    margin-top: 3%;
    color: white;
    border-radius: 50px;
    z-index: 1;
`