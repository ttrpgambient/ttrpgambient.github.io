import {useState, FunctionComponent} from 'react';
import './css/welcomeScreen.css';

import { LoginPopup } from './loginPopup';


type Props = {
    isLogInDisabled: boolean;
}

export const WelcomeScreen: FunctionComponent<Props> = ({isLogInDisabled}) => {
    const [showLoginPopup, setShowLoginPopup] = useState(false);

    const handleLogInClick = () => {
        setShowLoginPopup(!showLoginPopup)
      }

    return (
        <div>
            <button type='button' onClick={handleLogInClick} disabled = {isLogInDisabled}>Log In</button>
            <div className="welcome-screen-container">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.<br/>
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.<br/>
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.<br/>
                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </div>
            <LoginPopup onClose={handleLogInClick} isVisible={showLoginPopup}/>
        </div>
    );
}