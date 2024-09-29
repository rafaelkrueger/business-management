/* eslint-disable operator-linebreak */
/* eslint-disable implicit-arrow-linebreak */
import React from 'react'

import ReactDOMServer from 'react-dom/server'
import styled from 'styled-components'
import Swal from 'sweetalert2'
import './index.css'

export const Icon = styled.img`
    position: absolute;
    height: auto;
`

type ToastMessageProps = {
    type: 'success' | 'error' | 'info' | 'warning'
    text: string
}

export const ToastMessage: React.FC<ToastMessageProps> = ({ type, text }) => {
    let icon = null
    switch (type) {
        case 'success':
            break
        case 'error':
            break
        case 'info':
            break
        case 'warning':
            break
        default:
            icon = null
            break
    }
    return (
        <div className="toast">
            <div className={`toastLeftBorder ${type}`} />
            <div className="toastMainText">
                <p>{text}</p>
            </div>
            <div className="toastRightBorder">X</div>
        </div>
    )
}
const SwalToast = Swal.mixin({
    toast: true,
    position: 'top-end',
    background:'rgba(255,255,255,0)',
})

export const AlertAdapter = async (
    text: string,
    type: 'success' | 'error' | 'warning' | 'info'
) => {
    const htmlString = ReactDOMServer.renderToStaticMarkup(
        <ToastMessage text={text} type={type} />
    )

    SwalToast.fire({
        position: 'top-right',
        html: htmlString,
        showConfirmButton: false,
    })
}
