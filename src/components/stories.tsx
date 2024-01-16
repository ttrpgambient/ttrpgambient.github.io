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
    const sceneKey = useRef<number>(0);
    const sceneKeys = useRef<number[]>([]);

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

    function removeStory(key: number, title: string) {
        const keyIndex = sceneKeys.current.indexOf(key);
        if ( keyIndex === -1 ){
            throw Error('Remove Story invalid Key!');
        }

        sceneKeys.current = [...sceneKeys.current.slice(0, keyIndex), ...sceneKeys.current.slice(keyIndex+1)];
        setSceneList((current) => [...current.slice(0, keyIndex), ...current.slice(keyIndex+1)]);
        storiesTitles.current.delete(title);
    }

    function addStory() {
        const title = checkTitle("Story");
        sceneKeys.current.push(sceneKey.current);
        setSceneList(sceneList.concat(<Story key={sceneKey.current} storyKey={sceneKey.current} title={title} titleChanged={titleChanged} removeStory={removeStory}/>))
        sceneKey.current += 1;
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