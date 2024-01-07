import {useState, FunctionComponent, useRef} from 'react';

import './css/stories.css';
import { SceneView } from './sceneView'
import { ImageManager } from './imageManager';

import { authGlobal, AUTH_DISABLED } from '../system/authentication';
import { appGlobals } from '../system/appGlobals';

type Props = {
    changeAuthButtonState: (state: number) => void;
}

export const Stories: FunctionComponent<Props> = ({changeAuthButtonState}) => {
    const [showImageManager, setShowImageManager] = useState(false);
    const [sceneList, setSceneList] = useState<JSX.Element[]>([]);

    const imagesToDelete = useRef<string[]>([]);


    const handleLogOutClick = () => {
          authGlobal.logout().then( () => { changeAuthButtonState(AUTH_DISABLED) } );
      };
    
      const handleImageManagerClick = () => {
        if ( showImageManager && imagesToDelete ) {
        for ( let image of imagesToDelete.current ) {
                appGlobals.idbTagsImages.removeImage(image);
                appGlobals.imagesCache.delete(image);
                appGlobals.system?.getFileSystem().deleteFile(image);
            }

            imagesToDelete.current.length = 0;
        }

        setShowImageManager(!showImageManager)
      }

    function RenderImageManager() {
        if ( showImageManager )
            return <ImageManager imagesToDelete={imagesToDelete.current} onClose={handleImageManagerClick}/>
    }

    function addScene() {
        setSceneList(sceneList.concat(<SceneView key={sceneList.length}/>))
    }

    return (
        <div style={{height:"100%"}}>
            <div className='stories-settings-bar'>
                <button type='button' className='stories-settings-button' onClick={handleLogOutClick}>Log Out</button> 
                <button type='button' className='stories-settings-button' onClick={handleImageManagerClick}>Image Manager</button>
            </div>
            <div className='stories-main-container'>
                <div className='stories-display-container'>Display</div>
                <div className='stories-controls-container'>
                    {sceneList}
                    <button type='button' onClick={addScene}>Add Scene</button>
                </div>
            </div>
            <RenderImageManager/>
        </div>
    );
}