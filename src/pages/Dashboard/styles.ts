import styled from "styled-components";
import { IoMdMenu } from "react-icons/io";

export const DashboardContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  @media (max-width: 600px) {
    flex-direction: column;
    margin-top:-80px;
    max-width:100%;
    margin-left:-10px;
  }
`;

export const DashboardContainerShowed = styled.div`
  width: 100%;
  height: 100vh;
  overflow-y: auto;
  padding-bottom: 100px;

  @media (max-width: 600px) {
    margin-left: 0;
    padding: 15px;
    width: 100%;
    height: calc(100vh - 80px);
    margin-top: 80px;
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