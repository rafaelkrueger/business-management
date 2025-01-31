import styled from "styled-components";

export const SidebarContainer = styled.div`
    display: flex;
    flex-direction: column;
    background: linear-gradient(180deg, #001f3f, #003366); /* Degradê azul marinho */
    color: white;
    width: 220px;
    min-width: 300px;
    height: 100vh; /* Ocupa toda a altura da tela */
    overflow: hidden;
    @media (max-width: 600px) {
        width: 100%;
        height: 100%;
        min-height: 892px;
        max-height: 100%;
        position: static;
    }
`;

export const SidebarContainerBody = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    padding-inline: 20px;
    padding-block: 4px;
    max-height: 100%;
    overflow-y: auto;

    ::-webkit-scrollbar {
        width: 8px;
    }

    ::-webkit-scrollbar-thumb {
        background-color: white;
        border-radius: 5px;
    }

    ::-webkit-scrollbar-track {
        background: transparent;
    }

    /* Para Firefox */
    scrollbar-width: thin;
    scrollbar-color: white transparent;
    @media (max-width: 600px) {
        margin-left: -50px;
    }
`;


export const SidebarContainerFooter = styled.div`
    display: flex;
    flex-direction: column;
    padding: 20px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.2); /* Fundo semi-transparente */
    margin-top: auto; /* Garante que o footer fique sempre no final */
`;



export const SidebarContainerHeader = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    background: rgba(0, 0, 0, 0.2); /* Fundo semi-transparente */
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

export const SidebarContainerHeaderProfile = styled.img`
    width: 80px;
    height: 80px;
    border-radius: 50%;
    border: 2px solid #00a8ff; /* Borda azul clara */
`;

export const SidebarContainerHeaderProfileName = styled.p`
    text-align: center;
    font-size: 1.2em;
    font-weight: bold;
    color: white; /* Azul claro */
`;


export const SidebarContainerBodyElementContainer = styled.div`
    display: flex;
    align-items: center;
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 8px;
    transition: all 0.3s ease;

    &:hover {
        background: rgba(255, 255, 255, 0.1); /* Efeito hover suave */
        transform: translateX(5px); /* Movimento sutil */
        cursor: pointer;
    }
`;

export const SidebarContainerBodyElementIcon = styled.div`
    margin-right: 10px;
    color: #00a8ff; /* Azul claro */
`;

export const SidebarContainerBodyElement = styled.p`
    margin: 0;
    font-size: 1em;
    color: white;
    transition: color 0.3s ease;
    &:hover {
        cursor: pointer;
        color: #00a8ff; /* Azul claro no hover */
    }
`;
