import styled from "styled-components";
import { IoMdMenu } from "react-icons/io";

export const DashboardContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
  overflow: hidden;
`;

export const DashboardContainerShowed = styled.div`
  width: 100%;
  height: 100vh;
  overflow-y: auto;
  padding-bottom: 100px; /* altura do menu fixo */

  @media (max-width: 600px) {
    margin-left: 0;
    padding: 15px;
    width: 100%;
    height: calc(100vh - 80px); // Ajuste para altura da mobile sidebar
    margin-top: 80px; // Espaço para a mobile sidebar
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
`;