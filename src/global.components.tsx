import React from 'react';
import ReactDOMServer from 'react-dom/server';
import styled from 'styled-components';
import Swal from 'sweetalert2';
import './index.css';
import { FaCheckCircle, FaTimesCircle, FaInfoCircle, FaExclamationCircle } from 'react-icons/fa';

export const Icon = styled.img`
    position: absolute;
    height: auto;
`;

type ToastMessageProps = {
    type: 'success' | 'error' | 'info' | 'warning';
    text: string;
};

export const ToastMessage: React.FC<ToastMessageProps> = ({ type, text }) => {
    let icon = null;

    switch (type) {
        case 'success':
            icon = <FaCheckCircle color="#0B9500" size={20} />;
            break;
        case 'error':
            icon = <FaTimesCircle color="#FF0000" size={20} />;
            break;
        case 'info':
            icon = <FaInfoCircle color="#2DCAFC" size={20} />;
            break;
        case 'warning':
            icon = <FaExclamationCircle color="#FCC42D" size={20} />;
            break;
        default:
            icon = null;
            break;
    }

    return (
        <div className={`toast ${type}`}>
            <div className={`toastLeftBorder ${type}`} />
            <div className="toastIcon">{icon}</div>
            <div className="toastMainText">
                <p>{text}</p>
            </div>
            <div className="toastRightBorder">X</div>
        </div>
    );
};

const SwalToast = Swal.mixin({
    toast: true,
    position: 'top-end',
    background: 'rgba(255, 255, 255, 0.9)',
    border: 'none',
    showConfirmButton: false,
    timerProgressBar: true,
    customClass: {
        popup: 'custom-toast',
    },
});

export const AlertAdapter = async (text: string, type: 'success' | 'error' | 'warning' | 'info') => {
    const htmlString = ReactDOMServer.renderToStaticMarkup(<ToastMessage text={text} type={type} />);

    SwalToast.fire({
        html: htmlString,
    });
};