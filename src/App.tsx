import {useState, useEffect} from 'react';
import './css/App.css'
import { TagsInput } from './components/tagsInput'
import { SceneView } from './components/sceneView'
import { LoginPopup } from './components/loginPopup';
import { WelcomeScreen } from './components/welcomeScreen';

import { authGlobal } from './system/authentication';

const AUTH_DISABLED = 0;
const AUTH_LOGIN = 1;
const AUTH_LOGOUT = 2;

function App() {
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [authButtonState, setAuthButtonState] = useState(AUTH_DISABLED);

  const handleLogInClick = () => {
    setShowLoginPopup(!showLoginPopup)
  }

  const handleLotOutClick = () => {
    if ( authButtonState == AUTH_LOGOUT ) {
      authGlobal.logout().then( () => { setAuthButtonState(AUTH_LOGIN) } );
    }
  };

  useEffect(() => {
    if (authButtonState === AUTH_DISABLED) {
      authGlobal.tryAuthentication().then((loggedIn) => {
        setAuthButtonState(loggedIn ? AUTH_LOGOUT : AUTH_LOGIN);
      });
    }
  }, [authButtonState]); 

  function LogButton() {
    if ( authButtonState !== AUTH_LOGOUT ) {
      return <button type='button' onClick={handleLogInClick} disabled = {authButtonState == AUTH_DISABLED}>Log In</button>
    }
      return <button type='button' onClick={handleLotOutClick}>Log Out </button>
  }

  return (
    <div className="main-container">
      <div className='main-controls'>
        <LogButton/>
        <LoginPopup onClose={handleLogInClick} isVisible={showLoginPopup}/>
      </div>
      <WelcomeScreen/>
    </div>
  )
}

export default App
