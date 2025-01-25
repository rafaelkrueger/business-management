import React from 'react';
import styled from 'styled-components';
import { FaTools } from 'react-icons/fa';

// Styled-components for styling
const MaintenanceContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f0f4f8;
  color: #333;
  text-align: center;
  font-family: Arial, sans-serif;
  padding: 0 20px;
`;

const IconWrapper = styled.div`
  font-size: 4rem;
  color: #007bff;
  margin-bottom: 1rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #343a40;
`;

const Description = styled.p`
  font-size: 1.25rem;
  margin-bottom: 2rem;
  color: #495057;
`;

const Footer = styled.footer`
  position: absolute;
  bottom: 20px;
  font-size: 0.875rem;
  color: #666;
`;

const Maintenance: React.FC = () => {
  return (
    <MaintenanceContainer>
      <IconWrapper>
        <FaTools />
      </IconWrapper>
      <Title>Sistema em Manutenção</Title>
      <Description>
        Devido à alta demanda de usuários, estamos realizando uma manutenção para melhorar nossos serviços. Por favor, tente novamente mais tarde.
      </Description>
      <Footer>
        Agradecemos a sua paciência e compreensão. &copy; {new Date().getFullYear()} Roktune.
      </Footer>
    </MaintenanceContainer>
  );
};

export default Maintenance;
