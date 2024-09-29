import styled, { keyframes } from "styled-components";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

// Keyframes for the skeleton animation
export const shimmer = keyframes`
  0% {
    background-position: -300px 0;
  }
  100% {
    background-position: 300px 0;
  }
`;

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const LoadingIcon = styled(AiOutlineLoading3Quarters)`
  animation: ${spin} 1s linear infinite;
`;


