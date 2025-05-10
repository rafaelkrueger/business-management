import styled from '@emotion/styled';
import { RocketLaunch } from '@mui/icons-material';
import { Button, Divider, Paper, Typography, keyframes } from '@mui/material';

// Animations
const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const gradientBackground = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Styled Components
export const AuthContainer = styled('div')`
  display: flex;
  min-height: 100vh;
  background: linear-gradient(-45deg, #0a2540, #578acd, #38639a, #0a2540);
  background-size: 400% 400%;
  animation: ${gradientBackground} 15s ease infinite;
  flex-direction: column;
  padding: 24px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
    z-index: 0;
  }
`;

export const AuthHeader = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 40px;
  position: relative;
  z-index: 1;
`;

export const AuthLogo = styled.img`
  height: 60px;
  width: auto;
  margin-bottom: 16px;
  filter: drop-shadow(0 2px 8px rgba(0,0,0,0.2));
`;

export const AuthTitle = styled(Typography)`
  font-size: 2rem;
  font-weight: 800;
  color: white;
  margin-bottom: 8px;
  text-align: center;
  text-shadow: 0 2px 4px rgba(0,0,0,0.2);
` as typeof Typography;

export const AuthSubtitle = styled(Typography)`
  font-size: 1rem;
  color: rgba(255,255,255,0.9);
  text-align: center;
  max-width: 300px;
` as typeof Typography;

export const AuthFormContainer = styled(Paper)`
  width: 87%;
  padding: 32px 24px;
  border-radius: 24px;
  background: rgba(255,255,255,0.95);
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  position: relative;
  z-index: 1;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255,255,255,0.2);
  margin-top: -40px;
  margin-left:-5px;
`;

export const AuthForm = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const AuthLabel = styled('label')`
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
`;

export const AuthInput = styled('input')<{ error?: boolean }>`
  width: 88%;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid ${({ error }) => (error ? '#f44336' : '#e0e0e0')};
  font-size: 1rem;
  transition: all 0.2s ease;
  background-color: white;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);

  &:focus {
    outline: none;
    border-color: ${({ error }) => (error ? '#f44336' : '#578acd')};
    box-shadow: 0 0 0 3px ${({ error }) => (error ? '#ffcdd2' : 'rgba(87,138,205,0.2)')};
  }

  &::placeholder {
    color: #aaa;
  }
`;

export const AuthButton = styled(Button)`
  padding: 16px;
  border-radius: 12px;
  font-weight: 700;
  text-transform: none;
  font-size: 1rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  margin-top: 8px;

  &:hover {
    box-shadow: 0 6px 10px rgba(0,0,0,0.15);
    transform: translateY(-2px);
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
    border-color: #e0e0e0;
  }
`;

export const AuthFooterLink = styled(Button)`
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: none;
  padding: 0;
  min-width: auto;
  color: #578acd;

  &:hover {
    background-color: transparent;
    text-decoration: underline;
  }
`;

export const AuthErrorText = styled(Typography)`
  color: #f44336;
  font-size: 0.75rem;
  margin-top: 4px;
  margin-left: 8px;
` as typeof Typography;

export const FloatingShape = styled('div')`
  position: absolute;
  border-radius: 50%;
  background: rgba(255,255,255,0.1);
  animation: ${floatAnimation} 6s ease-in-out infinite;
  z-index: 0;

  &:nth-of-type(1) {
    width: 100px;
    height: 100px;
    top: 10%;
    left: -20px;
    animation-delay: 0s;
  }

  &:nth-of-type(2) {
    width: 150px;
    height: 150px;
    bottom: 20%;
    right: -50px;
    animation-delay: 2s;
  }

  &:nth-of-type(3) {
    width: 80px;
    height: 80px;
    top: 50%;
    left: 20%;
    animation-delay: 4s;
  }
`;

export const FeatureBadge = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  background: rgba(255,255,255,0.2);
  border-radius: 20px;
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  margin: 16px auto;
  max-width: fit-content;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255,255,255,0.3);
`;

// dentro de styles.ts, embaixo dos seus outros exports

/** Campo genérico que envolve cada par Label + Input */
export const AuthField = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 16px;
`;

/** Footer com o texto “Já tem conta?” + link */
export const AuthFooter = styled('div')`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  margin-top: 16px;
`;

/** Link simples do footer (pode reaproveitar o AuthFooterLink) */
export const AuthLink = styled(AuthFooterLink)`
  padding: 0;
  text-decoration: underline;
`;

export const AuthHeaderContainer = styled('div')`
  position: relative;
  width: 100%;
  margin-bottom: 40px;
  padding: 24px 0;
  text-align: center;
  z-index: 2;
`;

export const RocketContainer = styled('div')`
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto 16px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const RocketCircle = styled('div')`
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  animation: ${floatAnimation} 6s ease-in-out infinite;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80%;
    height: 80%;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
`;

export const RocketIcon = styled(RocketLaunch)`
  font-size: 60px !important;
  color: #fff;
  filter: drop-shadow(0 0 10px rgba(87, 138, 205, 0.7));
  position: relative;
  z-index: 2;
  animation: ${floatAnimation} 3s ease-in-out infinite;
`;

export const AuthWelcomeTitle = styled(Typography)`
  font-size: 2.5rem;
  font-weight: 800;
  color: white;
  margin-bottom: 8px;
  text-align: center;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  background: linear-gradient(90deg, #fff, #c5d9ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
  display: inline-block;

  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 25%;
    width: 50%;
    height: 3px;
    background: linear-gradient(90deg, transparent, #fff, transparent);
    border-radius: 3px;
  }
` as typeof Typography;

export const AuthWelcomeSubtitle = styled(Typography)`
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.9);
  text-align: center;
  max-width: 300px;
  margin: 0 auto 16px;
  line-height: 1.5;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
` as typeof Typography;

export const PulseBadge = styled('div')`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 24px;
  color: white;
  font-size: 0.85rem;
  font-weight: 600;
  margin: 16px auto;
  max-width: fit-content;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: translateY(-2px);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent);
    animation: shine 3s infinite;
  }

  @keyframes shine {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
`;

export const RocketWrapper = styled('div')`
  position: relative;
  width: 100%;
  height: 100px;
  margin: 0 auto 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  perspective: 1000px;
  margin-bottom: 50px;
`;

export const AnimatedRocket = styled(RocketLaunch)`
  font-size: 64px !important;
  color: rgb(249, 249, 249);
  background-color: #578acd;
  filter: drop-shadow(0 0 15px rgba(87, 138, 205, 0.5));
  transform-style: preserve-3d;
  padding: 20px;
  border-radius: 50px;
  position: relative;
  cursor: pointer;
  transition: transform 0.8s ease, box-shadow 0.3s ease;
  user-select: none;

  /* Efeito de sombra 3D */
  &::after {
    content: '';
    position: absolute;
    bottom: -15px;
    left: 20%;
    width: 60%;
    height: 20px;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 50%;
    transform: rotateX(75deg) scale(0.8);
    filter: blur(5px);
    z-index: -1;
    transition: all 0.8s ease;
  }

  /* Efeito de brilho na "face" oposta (para dar noção de 3D) */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 30px;
    transform: rotateY(90deg);
    opacity: 0;
    transition: opacity 0.8s ease;
  }

  /* Animação quando tocado */
  &:active {
    animation: coinFlip 3.5s ease-in-out;

    &::after {
      transform: rotateX(75deg) scale(1.2) rotateY(180deg);
      filter: blur(10px);
    }

    &::before {
      opacity: 1;
    }
  }

  @keyframes coinFlip {
    0% {
      transform: rotateY(0);
    }
    40% {
      transform: rotateY(720deg) scale(1.1);
    }
    70% {
      transform: rotateY(1080deg) scale(1);
    }
    100% {
      transform: rotateY(1440deg);
    }
  }

  @media (min-width: 600px) {
  font-size: 100px !important;
  }
`;


export const RocketTrail = styled('div')`
  position: absolute;
  bottom: -18px;
  left: 50%;
  transform: translateX(-50%);
  width: 160px;
  height: 18px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 50%;
  filter: blur(8px);
  z-index: -1;
`;


export const SparkContainer = styled('div')`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  margin-bottom: -150px;
  pointer-events: none;
`;

export const Spark = styled('div')`
  position: absolute;
  width: 4px;
  height: 4px;
  background: #fff;
  border-radius: 50%;
  filter: blur(1px);
  animation: sparkle 1s ease-out infinite;

  @keyframes sparkle {
    0% { transform: translateY(0) scale(1); opacity: 1; }
    100% { transform: translateY(-50px) scale(0); opacity: 0; }
  }
`;