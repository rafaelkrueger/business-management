import styled from "styled-components";

export const AuthContainer = styled.div`
    display: flex;
    flex-direction: row;
    background-color: #f4f6fa;
    min-height: 100vh;
`;

export const AuthContainerLeft = styled.div`
    display: flex;
    flex-direction: column;
    width: 30%;
    border-right: 1px solid #252525;
    background-color: white;
    padding: 20px;
    @media (max-width: 600px) {
        min-width: 250px;
        border-right: 0px solid white;
    }
`;

export const AuthContainerLeftLogo = styled.img`
    width: 35%;
    margin: 0 auto;
    margin-top: 13%;
    margin-bottom: 10%;
    @media (max-width: 600px) {
        margin-top: 20%;
        margin-bottom: 20%;
        border-radius: 20px;
        width: 100%;
    }
`;

export const AuthContainerElements = styled.div`
    display: flex;
    flex-direction: column;
    margin: 8%;
    @media (max-width: 600px) {
        margin: 0%;
        margin-right: -40%;
        margin-left: 20%;
    }
`;

export const AuthContainerLeftLabelInput = styled.label`
    margin-top: 1%;
    margin-bottom: 3%;
    color: #252525;
    font-weight: bold;
    width: 80%;
`;

export const AuthContainerLeftInput = styled.input`
    padding: 10px;
    margin-bottom: 10%;
    border: 0.01px solid #252525;
    border-radius: 5px;
    background-color: #f9faff;
    &:focus {
        border: 1.0px solid #252525;
        outline: none;
        box-shadow: 0 0 5px rgba(99, 114, 255, 0.5);
    }
`;

export const AuthContainerLeftLabelPassword = styled.label`
    margin-bottom: 3%;
    color: #252525;
    font-weight: bold;
`;

export const AuthContainerLeftPassword = styled.input`
    padding: 10px;
    margin-bottom: 10%;
    border: 1.0px solid #252525;
    border-radius: 5px;
    background-color: #f9faff;
    &:focus {
        border-color: #6372ff;
        outline: none;
        box-shadow: 0 0 5px rgba(99, 114, 255, 0.5);
    }
`;

export const AuthContainerLeftButton = styled.button`
    margin-top: 7%;
    padding: 12px;
    border: none;
    border-radius: 5px;
    background-color: #6372ff;
    color: white;
    font-size: 14pt;
    font-weight: bold;
    transition: background-color 0.3s;
    @media (max-width: 600px) {
        margin-top: 15%;
    }

    &:hover {
        cursor: pointer;
        background-color: #505ecb;
    }
`;

export const AuthContainerLeftForgotPassword = styled.p`
    color: blue;
    text-decoration: underline;
    &:hover {
        cursor: pointer;
    }
`;

export const AuthContainerLeftForgotSignup = styled.p`
    color: #252525;
    text-align: center;
    @media (max-width: 600px) {
        margin-bottom: 10%;
    }
`;

export const AuthContainerLeftForgotSignupLink = styled.strong`
    color: #6372ff;
    text-decoration: underline;
    &:hover {
        cursor: pointer;
    }
`;

export const AuthContainerRight = styled.div`
    display: flex;
    flex-direction: column;
    width: 70%;
    min-height: 100%;
`;

export const AuthContainerRightImage = styled.img`
    width: 100%;
    min-height: 100%;
`;
