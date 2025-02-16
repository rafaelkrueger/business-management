
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import styled, { keyframes } from "styled-components";

// Animação de decolagem para o foguete
const rocketAnimation = keyframes`
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0);
  }
`;

export const AuthContainer = styled.div`
  display: flex;
  flex-direction: row;
  background-color: white;
  height: 100vh;

  @media (max-width: 768px) {
    padding-top: 100px;
    padding-bottom: 100px;
    flex-direction: column;
    background-color: white;
    width: 100%;
  }
`;

export const AuthContainerLeft = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 35%;
  border-right: 2px solid #dce1ea;
  background-color: #ffffff;
  padding: 30px;

  @media (max-width: 768px) {
    width: 100%;
    border-right: none;
    min-height: 100vh;
    padding: 20px;
  }
`;

export const AuthContainerLeftLogo = styled.img`
  width: 35%;
  margin: 0 auto;
  animation: ${rocketAnimation} 2s infinite; /* Adiciona a animação de decolagem */

  @media (max-width: 768px) {
    width: 40%;
    margin: auto;
    margin-bottom: 20px;
    height: auto;
  }
`;

export const AuthContainerElements = styled.div`
  display: flex;
  flex-direction: column;
  width: 80%;
  max-width: 400px;
  margin: 0 auto;

  @media (max-width: 768px) {
    width: 90%;
  }
`;

export const AuthContainerLeftLabelInput = styled.label`
  margin-top: 15px;
  color: #333333;
  font-weight: bold;
  font-size: 14px;
  margin-top: -10px;
  @media (max-width: 768px) {
    margin-top: 0px;
  }
`;

export const AuthContainerLeftInput = styled.input`
  padding: 12px;
  margin-top: 8px;
  margin-bottom: 15px;
  border: 1px solid #dce1ea;
  border-radius: 5px;
  background-color: #f9faff;
  font-size: 14px;
  transition: all 0.3s ease;

  &:focus {
    border-color: #6372ff;
    outline: none;
    box-shadow: 0 0 10px rgba(99, 114, 255, 0.5);
  }

  @media (max-width: 768px) {
    font-size: 13px;
  }
`;

export const AuthContainerLeftLabelPassword = styled.label`
  margin-top: 15px;
  color: #333333;
  font-weight: bold;
  font-size: 14px;
  margin-top: -10px;
  @media (max-width: 768px) {
    margin-top: 0px;
  }
`;

export const AuthContainerLeftPassword = styled.input`
  padding: 12px;
  margin-top: 8px;
  margin-bottom: 15px;
  border: 1px solid #dce1ea;
  border-radius: 5px;
  background-color: #f9faff;
  font-size: 14px;
  transition: all 0.3s ease;

  &:focus {
    border-color: #6372ff;
    outline: none;
    box-shadow: 0 0 10px rgba(99, 114, 255, 0.5);
  }
`;

export const AuthContainerLeftButton = styled.button`
  padding: 12px;
  margin-top: 20px;
  border: none;
  border-radius: 5px;
  background-color: #6372ff;
  color: white;
  font-size: 16px;
  font-weight: bold;
  text-transform: uppercase;
  transition: all 0.3s ease;

  &:hover {
    cursor: pointer;
    background-color: #505ecb;
    box-shadow: 0px 6px 15px rgba(99, 114, 255, 0.5);
  }

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

export const AuthContainerLeftForgotPassword = styled.p`
  margin-top: 15px;
  color: #6372ff;
  text-align: center;
  font-size: 14px;
  text-decoration: underline;
  margin-top:-5px;
  &:hover {
    cursor: pointer;
    color: #505ecb;
  }
`;

export const AuthContainerLeftForgotSignup = styled.p`
  margin-top: 15px;
  color: #333333;
  text-align: center;
  font-size: 14px;

  @media (max-width: 768px) {
    font-size: 13px;
  }
`;

export const AuthContainerLeftForgotSignupLink = styled.strong`
  color: #6372ff;
  text-decoration: underline;
  &:hover {
    cursor: pointer;
    color: #505ecb;
  }
`;

export const AuthContainerRight = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 65%;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const AuthContainerRightImage = styled.img`
  width: 100%;
  height: 100%;

  @media (max-width: 768px) {
    height: 100%;
    object-fit: cover;
  }
`;

// Defina a animação de rotação
const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

// Estilize o ícone com a animação
export const LoadingIcon = styled(AiOutlineLoading3Quarters)`
  animation: ${spin} 1s linear infinite;
  font-size: 1.5rem; /* Ajuste o tamanho do ícone se necessário */
  color: inherit; /* Usa a cor atual */
`;

