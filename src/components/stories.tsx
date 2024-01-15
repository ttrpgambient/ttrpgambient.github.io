import {useState, FunctionComponent, useRef} from 'react';

import './css/stories.css';
import { SceneView } from './sceneView'
import { ImageManager } from './imageManager';

import { authGlobal, AUTH_DISABLED } from '../system/authentication';
import { appGlobals } from '../system/appGlobals';
import { Story } from './story';

type Props = {
    changeAuthButtonState: (state: number) => void;
}

export const Stories: FunctionComponent<Props> = ({changeAuthButtonState}) => {
    const [showImageManager, setShowImageManager] = useState(false);
    const [sceneList, setSceneList] = useState<JSX.Element[]>([]);

    const imagesToDelete = useRef<string[]>([]);
    const storiesTitles = useRef<Set<string>>(new Set<string>())

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

    function checkTitle(title: string): string {
        if ( storiesTitles.current.has(title) ) {
            title = title + " new";
            return checkTitle(title);
        }

        storiesTitles.current.add(title);
        return title;
    }

    function titleChanged( titleOld: string, titleNew: string ): string {
        storiesTitles.current.delete(titleOld);
        return checkTitle(titleNew);
    }

    function addStory() {
        const title = checkTitle("Story");
        setSceneList(sceneList.concat(<Story key={sceneList.length} title={title} titleChanged={titleChanged}/>))
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
                    <button type='button' onClick={addStory}>Add Story</button>
                </div>
            </div>
            <RenderImageManager/>
        </div>
    );
}