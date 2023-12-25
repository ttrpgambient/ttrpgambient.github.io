import {useState, FunctionComponent} from 'react';

import './css/stories.css';
import { SceneView } from './sceneView'
import { ImageManager } from './imageManager';

import { authGlobal, AUTH_DISABLED } from '../system/authentication';

type Props = {
    changeAuthButtonState: (state: number) => void;
}

export const Stories: FunctionComponent<Props> = ({changeAuthButtonState}) => {
    const [showImageManager, setShowImageManager] = useState(false);


    const handleLogOutClick = () => {
          authGlobal.logout().then( () => { changeAuthButtonState(AUTH_DISABLED) } );
      };
    
      const handleImageManagerClick = () => {
        setShowImageManager(!showImageManager)
      }

    return (
        <div>
            <div className='settings-bar'>
                <button type='button' className='settings-button' onClick={handleLogOutClick}>Log Out</button> 
                <button type='button' className='settings-button' onClick={handleImageManagerClick}>Image Manager</button>
            </div>
            <div className='stories-main-container'>
                <div className='stories-display-container'>Display</div>
                <div className='stories-controls-container'>
                    <SceneView/>
                    <SceneView/>
                </div>
            </div>
            <ImageManager onClose={handleImageManagerClick} isVisible={showImageManager}/>
        </div>
    );
}