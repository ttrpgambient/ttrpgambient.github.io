import {useState, FunctionComponent} from 'react';
import './css/loginPopup.css';

type Props = {
    isVisible: boolean;
}

export const LoginPopup: FunctionComponent<Props> = ({ isVisible }) => {
    var visibility = isVisible ? "block" : "none";
    return (
        <div className="login-popup-container" style={{display: visibility}}>
            <div className="login-popup-buttons-container">
                <button type="button" className='login-popup-button'>Dropbox</button><br/>
                <button type="button" className='login-popup-button'>Google Drive</button>
            </div>
        </div>
    )
}