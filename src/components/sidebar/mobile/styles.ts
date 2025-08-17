import styled, { keyframes } from "styled-components";

// Animations
export const slideIn = keyframes`
  from { transform: translateY(-10px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

export const pulse = keyframes`
  0% { transform: scale(0.95); opacity: 0.8; }
  50% { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(0.95); opacity: 0.8; }
`;

export const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

export const shine = keyframes`
  0% { left: -100%; }
  100% { left: 100%; }
`;

export const SidebarWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  position: absolute;
  z-index: 10;
`;

export const TopSection = styled.div`
  background: #1e293b;
  padding-top: env(safe-area-inset-top);
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.2);
`;

export const CompanyHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 16px 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(0, 168, 255, 0.2), transparent);
    transition: left 0.5s ease;
  }

  &:hover::before {
    left: 100%;
  }

  &:hover {
    background: rgba(0, 0, 0, 0.15);
  }
`;

export const CompanyAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid #578acd;
  box-shadow: 0 0 10px rgba(0, 168, 255, 0.3);
`;

export const CompanyLogo = styled.img<{ small?: boolean }>`
  width: ${props => props.small ? '24px' : '100%'};
  height: ${props => props.small ? '24px' : '100%'};
  object-fit: cover;
`;

export const CompanyPlaceholder = styled.div<{ small?: boolean }>`
  width: ${props => props.small ? '24px' : '100%'};
  height: ${props => props.small ? '24px' : '100%'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: #578acd;
`;

export const CompanyInfo = styled.div`
  flex-grow: 1;
  margin-left: 12px;
  overflow: hidden;
`;

export const CompanyName = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: white;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-shadow: 0 0 5px rgba(0, 168, 255, 0.3);
`;

export const CompanyStatus = styled.div`
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.8);
  opacity: 0.8;
`;

export const ChevronIcon = styled.div`
  color: #578acd;
  opacity: 0.7;
  transition: all 0.3s ease;
  margin-left: 8px;

  ${CompanyHeader}:hover & {
    opacity: 1;
  }
`;

export const CompanyDropdown = styled.div`
  background: rgba(0, 0, 0, 0.15);
  max-height: 60vh;
  overflow-y: auto;
  animation: ${slideIn} 0.3s ease-out;
  border-top: 1px solid rgba(0, 168, 255, 0.2);
  backdrop-filter: blur(5px);

  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(0, 168, 255, 0.3);
    border-radius: 3px;
  }
`;

export const DropdownTitle = styled.div`
  padding: 12px 20px;
  font-size: 0.85rem;
  font-weight: 500;
  color: #578acd;
  opacity: 0.8;
  border-bottom: 1px solid rgba(0, 168, 255, 0.2);
  text-shadow: 0 0 5px rgba(0, 168, 255, 0.3);
`;

export const CompanyOption = styled.div<{ active?: boolean }>`
  display: flex;
  align-items: center;
  padding: 12px 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  background: ${props => props.active ? 'rgba(0, 168, 255, 0.1)' : 'transparent'};
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(0, 168, 255, 0.2), transparent);
    transition: left 0.5s ease;
  }

  &:hover::before {
    left: 100%;
  }

  &:hover {
    background: rgba(0, 168, 255, 0.1);
  }

  & + & {
    border-top: 1px solid rgba(0, 168, 255, 0.1);
  }
`;

export const CompanyLogoWrapper = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.1);
  flex-shrink: 0;
  border: 1px solid rgba(0, 168, 255, 0.3);
`;

export const CompanyOptionInfo = styled.div`
  margin-left: 12px;
  flex-grow: 1;
  overflow: hidden;
`;

export const CompanyOptionName = styled.div`
  font-size: 0.95rem;
  font-weight: 500;
  color: white;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const CompanyOptionStatus = styled.div`
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.7);
  opacity: 0.7;
`;

export const SelectedIndicator = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-left: 12px;
  animation: ${fadeIn} 0.3s ease-out;
  background: #578acd;
  box-shadow: 0 0 10px rgba(0, 168, 255, 0.5);
`;

export const ModuleItem = styled.div<{ active?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 12px;
  min-width: 80px;
  border-radius: 12px;
  background: ${props => props.active ? 'rgba(0, 168, 255, 0.1)' : 'rgba(255, 255, 255, 0.1)'};
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
  backdrop-filter: blur(5px);
  position: relative;
  overflow: hidden;
  border: 1px solid ${props => props.active ? 'rgba(0, 168, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)'};

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(0, 168, 255, 0.2), transparent);
    transition: left 0.5s ease;
  }

  &:hover::before {
    left: 100%;
  }

  &:hover {
    background: rgba(0, 168, 255, 0.15);
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 168, 255, 0.2);
  }

  &:active {
    transform: scale(0.98);
  }
`;

export const ModuleIcon = styled.div<{ active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  color: ${props => props.active ? '#578acd' : 'white'};
  transition: all 0.3s ease;
  filter: drop-shadow(0 0 5px rgba(0, 168, 255, 0.3));

  ${ModuleItem}:hover & {
    color: #578acd;
    transform: scale(1.1);
    filter: drop-shadow(0 0 8px rgba(0, 168, 255, 0.5));
  }

  ${ModuleItem}.active & {
    animation: ${pulse} 1.5s infinite ease-in-out;
  }
`;

export const ModuleLabel = styled.div<{ active?: boolean }>`
  font-size: 0.75rem;
  font-weight: ${props => props.active ? '500' : '400'};
  color: ${props => props.active ? '#578acd' : 'white'};
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  text-shadow: ${props => props.active ? '0 0 5px rgba(0, 168, 255, 0.3)' : 'none'};
`;

export const GlowingDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #578acd;
  box-shadow:
    0 0 5px #578acd,
    0 0 10px rgba(0, 168, 255, 0.5);
  animation: ${pulse} 1.5s infinite ease-in-out;
`;

export const BottomSection = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40px;
  background: #1e293b;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  display: flex;
  align-items: center;
  margin-top: 100px;
  border-top: 1px solid rgba(0, 168, 255, 0.2);
`;

export const ModulesScroll = styled.div`
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding: 0 8px;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const ModulesContainer = styled.div`
  display: inline-flex;
  padding: 0 8px;
  gap: 0px;
  height: 100%;
  align-items: center;
`;

export const CompactModuleItem = styled.div<{ active?: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: -1px 10px;
  padding-left: 5px;
  padding-right: 5px;
  min-width: ${props => props.active ? '80px' : '50px'};
  height: 40px;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(0, 168, 255, 0.2), transparent);
    transition: left 0.5s ease;
  }

  &:hover::before {
    left: 100%;
  }

  &:hover {
    background: rgba(0, 168, 255, 0.15);
  }

  &:active {
    transform: scale(0.95);
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${props => props.active ? '#578acd' : 'transparent'};
    transition: all 0.2s ease;
    box-shadow: ${props => props.active ? '0 0 5px rgba(0, 168, 255, 0.5)' : 'none'};
  }
`;

export const CompactModuleIcon = styled.div<{ active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.active ? '#578acd' : 'white'};
  transition: all 0.2s ease;
  font-size: 1.2rem;
  margin-right: 3px;
  filter: drop-shadow(0 0 3px rgba(0, 168, 255, 0.3));

  ${CompactModuleItem}:hover & {
    color: #578acd;
    transform: scale(1.1);
    filter: drop-shadow(0 0 5px rgba(0, 168, 255, 0.5));
  }

  ${CompactModuleItem}.active & {
    animation: ${pulse} 1.5s infinite ease-in-out;
  }
`;

export const CompactModuleLabel = styled.div<{ active?: boolean }>`
  font-size: 0.6rem;
  font-weight: 500;
  color: ${props => props.active ? '#578acd' : 'white'};
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  animation: ${fadeIn} 0.2s ease-out;
  text-shadow: ${props => props.active ? '0 0 3px rgba(0, 168, 255, 0.3)' : 'none'};
`;

export const Item = styled.div<{ active?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4px;
  min-width: ${props => props.active ? '60px' : '40px'};
  background: ${props => props.active ? 'rgba(0, 168, 255, 0.1)' : 'transparent'};
  transition: transform 0.2s;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(0, 168, 255, 0.2), transparent);
    transition: left 0.5s ease;
  }

  &:hover::before {
    left: 100%;
  }

  &:active {
    transform: scale(0.95);
  }
`;

export const Label = styled.div<{ active?: boolean }>`
  color: ${props => props.active ? '#578acd' : 'white'};
  font-size: 0.65rem;
  margin-top: 2px;
  text-shadow: ${props => props.active ? '0 0 3px rgba(0, 168, 255, 0.3)' : 'none'};
`;

export const LogoutItem = styled(Item)`
  cursor: pointer;
  margin-left: auto;
`;

export const LogoutLabel = styled(Label)`
  color: #ff6666;
  text-shadow: 0 0 3px rgba(255, 102, 102, 0.3);
`;
