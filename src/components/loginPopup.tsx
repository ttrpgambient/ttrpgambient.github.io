import { FunctionComponent } from 'react';
import { DROPBOX_APP } from '../system/dropbox/dropbox_common';
import { SYSTEM_NAME } from '../system/authentication';

import './css/loginPopup.css';
import './css/common.css';

import { Dropbox } from '../system/dropbox/dropbox';

type Props = {
    onClose: () => void;
    isVisible: boolean;
}

export const LoginPopup: FunctionComponent<Props> = ({onClose, isVisible }) => {
    const visibility = isVisible ? "block" : "none";

    function DropboxLogIn() {
        window.localStorage.setItem(SYSTEM_NAME, DROPBOX_APP);
        const dropbox = new Dropbox();
        dropbox.auth.RequestLogin();
    }

    return (
        <div className="login-popup-container" style={{display: visibility}}>
            <button type="button" className='close-window-button' onClick={onClose}>X</button>
            <div className="login-popup-buttons-container">
                <button type="button" className='login-popup-button' onClick={DropboxLogIn}>Dropbox</button><br/>
                <button type="button" className='login-popup-button'>Google Drive</button>
            </div>
        </div>
    )
}