import './css/stories.css';
import { SceneView } from './sceneView'

export function Stories() {

    return (
        <div className='stories-main-container'>
            <div className='stories-display-container'>Display</div>
            <div className='stories-controls-container'>
                <SceneView/>
                <SceneView/>
            </div>
        </div>
    );
}