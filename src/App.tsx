import {useState, useEffect} from 'react';
import './css/App.css'
import { TagsInput } from './components/tagsInput'
import { SceneView } from './components/sceneView'
import { LoginPopup } from './components/loginPopup';

import { authGlobal } from './system/authentication';

const AUTH_DISABLED = 0;
const AUTH_LOGIN = 1;
const AUTH_LOGOUT = 2;

function App() {
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [authButtonState, setAuthButtonState] = useState(AUTH_DISABLED);

  const handleClick = () => {
    if ( authButtonState == AUTH_LOGOUT ) {
      authGlobal.logout().then( () => { setAuthButtonState(AUTH_LOGIN) } );
    } else {
      setShowLoginPopup(true)
    }
  };

  useEffect(() => {
    if (authButtonState === AUTH_DISABLED) {
      authGlobal.tryAuthentication().then((loggedIn) => {
        setAuthButtonState(loggedIn ? AUTH_LOGOUT : AUTH_LOGIN);
      });
    }
  }, [/*authButtonState*/]); 

  return (
    <div className="main-container">
      <div> Display </div>
      <div className='main-controls'>
        <button type='button' onClick={handleClick} disabled = {authButtonState == AUTH_DISABLED}>Log {authButtonState == AUTH_LOGOUT ? "Out" : "In"} </button>
        <LoginPopup isVisible={showLoginPopup}/>
      </div>
    </div>
  )
}

export default App
