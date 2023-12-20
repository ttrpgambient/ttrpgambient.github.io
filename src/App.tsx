import {useState} from 'react';
import './css/App.css'
import { TagsInput } from './components/tagsInput'
import { SceneView } from './components/sceneView'
import { LoginPopup } from './components/loginPopup';


function App() {
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  const handleClick = () => {
    // 👇️ toggle
    setShowLoginPopup(current => !current)
  };

  return (
    <div className="main-container">
      <div> Display </div>
      <div className='main-controls'>
        <button type='button' onClick={handleClick}>Log In</button>
        <LoginPopup isVisible={showLoginPopup}/>
      </div>
    </div>
  )
}

export default App
