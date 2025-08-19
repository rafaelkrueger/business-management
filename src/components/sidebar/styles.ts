import styled from "styled-components";

export const SidebarContainer = styled.div<{ isCollapsed: boolean }>`
  width: ${({ isCollapsed }) => isCollapsed ? '80px' : '280px'};
  min-width: ${({ isCollapsed }) => isCollapsed ? '80px' : '280px'};
  transition: all 0.3s ease;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background-color: #243b5a;
  color: white;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 100;
  box-shadow: ${({ isCollapsed }) =>
    isCollapsed
      ? '4px 0 10px rgba(0,0,0,0.1)'
      : '4px 0 15px rgba(0,0,0,0.2)'};

  @media (max-width: 600px) {
    width: 100%;
    height: 100%;
    min-height: 892px;
    max-height: 100%;
    position: static;
  }
`;



export const SidebarContainerBody = styled.div<{ isCollapsed?: boolean }>`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    padding-inline: ${props => props.isCollapsed ? '10px' : '30px'};
    padding-block: 4px;
    max-height: 100%;
    overflow-y: auto;

    ::-webkit-scrollbar {
        width: 8px;
    }

    ::-webkit-scrollbar-thumb {
        background-color: rgba(255, 255, 255, 0.3);
        border-radius: 5px;
    }

    ::-webkit-scrollbar-track {
        background: transparent;
    }

    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.3) transparent;

    @media (max-width: 600px) {
        margin-left: -50px;
    }
`;

export const SidebarContainerFooter = styled.div`
  padding: 15px;
  border-top: 1px solid rgba(255,255,255,0.1);
  margin-top: auto;
`;

export const SidebarContainerHeader = styled.div`
  padding: 20px 15px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  display: flex;
  flex-direction: column;
  gap: 15px;
  position: relative;
`;

export const SidebarContainerHeaderProfile = styled.img`
    border-radius: 50%;
    border: 2px solid #fff;
    transition: all 0.3s ease;
    object-fit: cover;

    &:hover {
        transform: scale(1.05);
        box-shadow: 0 0 20px rgba(0, 168, 255, 0.3);
    }
`;

export const ExpandIcon = styled.div<{ isCollapsed?: boolean }>`
    background: transparent;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 12px;
    transition: all 0.3s ease;
    cursor: pointer;
    transform: ${({ isCollapsed }) => isCollapsed ? 'rotate(0deg)' : 'rotate(180deg)'};

    &:hover {
        transform: ${({ isCollapsed }) => isCollapsed ? 'scale(1.1)' : 'rotate(180deg) scale(1.1)'};
    }
`;

export const SidebarContainerHeaderProfileName = styled.p`
    text-align: center;
    font-size: 1.2em;
    font-weight: bold;
    color: white;
    margin: 10px 0 -20px 0;
    transition: all 0.3s ease;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

export const SidebarContainerBodyElementContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 15px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 6px;
  margin-bottom: 5px;
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
    background-color: rgba(255,255,255,0.1);
  }
`;

export const SidebarContainerBodyElementIcon = styled.div`
    margin-right: 10px;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
`;

export const SidebarContainerBodyElement = styled.p`
    margin: 0;
    font-size: 1em;
    color: white;
    transition: all 0.3s ease;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    &:hover {
        color: #ffffff;
    }
`;

export const SupportModuleLabel = styled.div`
    margin: 20px 0 10px 10px;
    font-size: 0.8em;
    color: rgba(255, 255, 255, 0.6);
    text-transform: uppercase;
    letter-spacing: 1px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding-bottom: 5px;
    transition: all 0.3s ease;
`;

export const MainModuleIndicator = styled.span`
    font-size: 0.8em;
    color: #ffffff;
    margin-left: 5px;
    background: rgba(0, 168, 255, 0.1);
    padding: 2px 6px;
    border-radius: 4px;
    font-weight: 500;
`;

export const ActiveModuleIndicator = styled.div`
    width: 8px;
    height: 8px;
    background-color: #ffffff;
    border-radius: 50%;
    display: inline-block;
    margin-left: 8px;
    vertical-align: middle;
    animation: pulse 2s infinite;

    @keyframes pulse {
        0% {
            box-shadow: 0 0 0 0 rgba(0, 168, 255, 0.7);
        }
        70% {
            box-shadow: 0 0 0 10px rgba(0, 168, 255, 0);
        }
        100% {
            box-shadow: 0 0 0 0 rgba(0, 168, 255, 0);
        }
    }
`;

export const SidebarCollapsed = styled.div`
    width: 70px;
    min-width: 70px;
    height: 100vh;
    background: linear-gradient(180deg, #001f3f, #003366);
    transition: all 0.3s ease;
`;