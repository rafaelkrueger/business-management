import styled from "styled-components";



export const AuthContainer = styled.div`
    display: flex;
    flex-direction: row;
`;




export const AuthContainerLeft = styled.div`
    display: flex;
    flex-direction: column;
    width: 30%;
    border-right:0.5px #252525 solid ;
    @media (max-width:600px) {
        min-width: 250px;
        margin-right: 1000px;
        border-right:0px white solid ;
}
`;

export const AuthContainerLeftLogo = styled.img`
    width:35%;
    margin-left:35%;
    margin-top: 13%;
    margin-bottom: 10%;
    @media (max-width:600px) {
        margin-top: 20%;
        margin-bottom: 20%;
        border-radius: 20px;
        width: 100%;
        margin-left:0%;
    }
`;


export const AuthContainerElements = styled.div`
    display: flex;
    flex-direction: column;
    margin: 8%;
    @media (max-width:600px) {
        margin: 0%;
        margin-right: -40%;
        margin-left: 20%;
    }
`;


export const AuthContainerLeftLabelInput = styled.label`
    margin-top: 1%;
    margin-bottom: 3%;
`;


export const AuthContainerLeftInput = styled.input`
    padding: 8px;
    margin-bottom: 10%;
    border: 1px rgba(0,0,0,0.5) solid;
`;

export const AuthContainerLeftLabelPassword = styled.label`
    margin-bottom: 3%;
`;

export const AuthContainerLeftPassword = styled.input`
    padding: 8px;
    margin-bottom: 10%;
    border: 1px rgba(0,0,0,0.5) solid;

`;

export const AuthContainerLeftButton = styled.button`
    margin-top: 7%;
    padding: 8px;
    border: 1px rgba(0,0,0,0.5) solid;
    background-color: #252525;
    color:white;
    font-size: 13pt;
    @media (max-width:600px) {
        margin-top: 15%;
    }

    &:hover{
        cursor: pointer;
        background-color: rgba(0,0,0,0.77);
    }
`;

export const AuthContainerLeftForgotPassword = styled.p`
    color:blue;
    text-decoration: underline;
`;

export const AuthContainerLeftForgotSignup = styled.p`
    @media (max-width:600px) {
        margin-bottom: 10%;
    }

`;

export const AuthContainerLeftForgotSignupLink = styled.strong`
    color:back;
    text-decoration: underline;
    &:hover{
        cursor: pointer;
    }
`;



export const AuthContainerRight = styled.div`
    display: flex;
    flex-direction: column;
    width: 70%;
`;

export const AuthContainerRightImage = styled.img`
    width: 100%;
    @media (max-width:600px) {
        display: none;
    }
`;

