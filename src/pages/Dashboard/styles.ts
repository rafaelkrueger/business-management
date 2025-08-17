import styled from "styled-components";
import { IoMdMenu } from "react-icons/io";

export const DashboardContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
  overflow: hidden;

  @media (max-width: 600px) {
    flex-direction: column;
    margin-top: -80px;
    margin-left: -100px;
    overflow: unset;
  }
`;

export const DashboardContainerShowed = styled.div`
  flex: 1;
  height: 100vh;
  overflow-y: auto;
  padding-bottom: 100px;
  margin-left: 280px;
  transition: margin-left 0.3s ease;

  &.sidebar-collapsed {
    margin-left: 80px;
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

  @media (max-width: 600px) {
    margin-left: -100px;
    padding: 15px;
    width: 100%;
    height: calc(100vh - 80px);
    margin-top: 80px;
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