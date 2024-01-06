import {useState, useEffect} from 'react';
import './css/App.css'

import { WelcomeScreen } from './components/welcomeScreen';
import { Stories } from './components/stories';

import { authGlobal, AUTH_DISABLED, AUTH_LOGIN, AUTH_LOGOUT } from './system/authentication';
import { appGlobals } from './system/appGlobals';

function App() {
  const [authButtonState, setAuthButtonState] = useState(AUTH_DISABLED);

  function createTagsArray(tagsList: string[]) {
    appGlobals.tags = tagsList;
  }

  useEffect(() => {
    if (authButtonState === AUTH_DISABLED) {
      authGlobal.tryAuthentication().then((loggedIn) => {
        setAuthButtonState(loggedIn ? AUTH_LOGOUT : AUTH_LOGIN);
        if ( loggedIn ) {
          appGlobals.idbTagsImages.loadDB().then(() => {
            appGlobals.idbTagsImages.getAllTags(createTagsArray)
          })
        }
      });
    }
  }, [authButtonState]); 

  function Content() {
    if ( authButtonState === AUTH_LOGOUT ) {
      return <Stories changeAuthButtonState={setAuthButtonState}/>
    }
      return <WelcomeScreen isLogInDisabled={authButtonState == AUTH_DISABLED}/>
  }

  return (
    <div className="main-container">
      <Content/>
    </div>
  )
}

export default App
