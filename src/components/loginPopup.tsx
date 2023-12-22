import { FunctionComponent } from 'react';
import { DROPBOX_APP } from '../system/dropbox/dropbox_common';
import { SYSTEM_NAME } from '../system/authentication';

import './css/loginPopup.css';

import { Dropbox } from '../system/dropbox/dropbox';

type Props = {
    isVisible: boolean;
}

export const LoginPopup: FunctionComponent<Props> = ({ isVisible }) => {
    var visibility = isVisible ? "block" : "none";

    function DropboxLogIn() {
        window.localStorage.setItem(SYSTEM_NAME, DROPBOX_APP);
        var dropbox = new Dropbox();
        dropbox.auth.RequestLogin();
    }

    return (
        <div className="login-popup-container" style={{display: visibility}}>
            <div className="login-popup-buttons-container">
                <button type="button" className='login-popup-button' onClick={DropboxLogIn}>Dropbox</button><br/>
                <button type="button" className='login-popup-button'>Google Drive</button>
            </div>
        </div>
    )
}