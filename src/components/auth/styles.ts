import styled from '@emotion/styled';
import { Button, Divider, Paper, Typography } from '@mui/material';

export const AuthContainer = styled('div')`
  display: flex;
  min-height: 100vh;
  background-color: #f5f5f5;
  @media (max-width: 600px) {
    display: flex;
    flex-direction: column;
  }
`;

export const AuthLeftPanel = styled('div')`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background-color: #ffffff;
  position: relative;
`;

export const AuthRightPanel = styled('div')`
  flex: 1;
  background: linear-gradient(135deg, #556cd6 0%, #0039cb 100%);
  display: none;
  position: relative;
  overflow: hidden;

  @media (min-width: 900px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export const AuthFormContainer = styled.div`
  width: 100%;
  max-width: 450px;
  margin-top: -150px;
`;

export const AuthLogo = styled.img`
  height: 40px;
  width: auto;
`;

export const AuthTitle = styled(Typography)`
  font-size: 1.75rem;
  font-weight: 700;
  color: #111;
  margin-bottom: 8px;
` as typeof Typography;

export const AuthSubtitle = styled(Typography)`
  font-size: 1rem;
  color: #666;
` as typeof Typography;

export const AuthForm = styled.div`
  margin-top: 32px;
`;

export const AuthLabel = styled('label')`
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
`;

export const AuthInput = styled('input')<{ error?: boolean }>`
  width: 92%;
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid ${({ error }) => (error ? '#f44336' : '#ccc')};
  font-size: 0.9375rem;
  transition: all 0.2s ease;
  background-color: #fff;
  color: #000;

  &:focus {
    outline: none;
    border-color: ${({ error }) => (error ? '#f44336' : '#556cd6')};
    box-shadow: 0 0 0 3px ${({ error }) => (error ? '#ffcdd2' : '#c5cae9')};
  }

  &::placeholder {
    color: #aaa;
  }
`;

export const AuthButton = styled(Button)`
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  text-transform: none;
  font-size: 0.9375rem;
  box-shadow: none;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: none;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const AuthDivider = styled(Divider)`
  margin: 24px 0;
  color: #666;
  font-size: 0.75rem;
  font-weight: 500;

  &::before,
  &::after {
    border-color: #ccc;
  }
`;

export const AuthFooterLink = styled(Button)`
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: none;
  padding: 0;
  min-width: auto;
  color: #556cd6;

  &:hover {
    background-color: transparent;
    text-decoration: underline;
  }
`;

export const AuthImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.9;
`;

export const AuthFeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 16px 0 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const AuthFeatureItem = styled.li`
  color: white;
  font-size: 0.9375rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const AuthPlanCard = styled(Paper)<{ highlighted?: boolean }>`
  position: relative;
  padding: 32px 24px;
  border-radius: 12px;
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  border: 1px solid ${({ highlighted }) => (highlighted ? '#556cd6' : '#ccc')};
  box-shadow: ${({ highlighted }) =>
    highlighted ? '0 10px 25px rgba(0, 0, 0, 0.1)' : 'none'};

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
  }
`;

export const AuthPlanTitle = styled(Typography)`
  font-size: 1.25rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 8px;
  color: #111;
` as typeof Typography;

export const AuthPlanPrice = styled(Typography)`
  font-size: 2.5rem;
  font-weight: 800;
  text-align: center;
  color: #111;
  margin-bottom: 8px;

  span {
    font-size: 1rem;
    font-weight: 500;
    color: #666;
  }
` as typeof Typography;

export const AuthPlanFeatures = styled.div`
  flex: 1;
  margin-top: 16px;
`;

export const AuthErrorText = styled(Typography)`
  color: #f44336;
  font-size: 0.75rem;
  margin-top: 4px;
  margin-left: 26px;
` as typeof Typography;
