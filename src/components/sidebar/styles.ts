import styled from "styled-components";

export const SidebarContainer = styled.div`
    display: flex;
    flex-direction: column;
    background-color: #252525;
    color: white;
    width: 20%;
    min-height: 100%;
    @media (max-width: 600px) {
        width: 100%;
        height: auto;
        min-height: 1000px;
        position: static;
    }
`;

export const SidebarContainerHeader = styled.div`
    display: flex;
    flex-direction: column;
    margin: 10%;
    margin-top: -10%;
    border-bottom: 1px white solid;
    @media (max-width: 600px) {
        margin: 10%;
    }
`;

export const SidebarContainerHeaderProfile = styled.img`
    min-width: 30%;
    max-width: 30%;
    margin-top: 20%;
    margin-left: 33%;
    @media (max-width: 600px) {
        margin-left: 28%;
        margin-top: 0%;
        min-width: 45%;
    }
`;

export const SidebarContainerHeaderProfileName = styled.p`
    text-align: center;
`;

export const SidebarContainerBody = styled.div`
    display: flex;
    flex-direction: column;
    margin-left: 10%;
    margin-top: -2%;
    margin-bottom: 6%;
    max-height: 350px;
    overflow-y: auto;

    height: auto;

    ::-webkit-scrollbar {
        width: 3px !important;
    }

    ::-webkit-scrollbar-thumb {
        background-color: grey !important;
        border-radius: 5px !important;
    }

    ::-webkit-scrollbar-track {
        background: transparent !important;
    }

    scrollbar-width: thin !important;
    scrollbar-color: grey transparent !important;
`;





export const SidebarContainerFooter = styled.div`
    display: flex;
    flex-direction: column;
    margin-left: 10%;
    border-top: 1px white solid;
    margin-right: 15%;
`;

export const SidebarContainerBodyElementContainer = styled.div`
    display: flex;
    margin-bottom: 5%;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
    &:hover {
        transition: 1s;
        background-color: white;
        color: black;
        cursor: pointer;
    }
    @media (max-width: 600px) {
        border-top-right-radius: 10px;
        border-bottom-right-radius: 10px;
        width: 82%;
        margin-left: -6%;
    }
`;

export const SidebarContainerBodyElementIcon = styled.div`
    padding-left: 10px;
    margin-top: 5%;
    margin-right: 7%;
    @media (max-width: 600px) {
        margin-top: 5%;
    }
`;

export const SidebarContainerBodyElement = styled.p``;
