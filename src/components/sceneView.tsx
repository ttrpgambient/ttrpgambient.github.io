import React from 'react';
import './css/sceneView.css';

class SceneViewProps {
}

class SceneViewState {
}

export class SceneView  extends React.Component<SceneViewProps, SceneViewState> {
    
    constructor(props: SceneViewProps) {
        super(props);
        this.state = new SceneViewState();
    }

    render(): React.ReactNode {
        return (
            <div className="scene-view-container">
                <input className="scene-view-title" type="text" id="title" name="title" placeholder='Title'/><br/>
                <img className="scene-view-img" src="tmp_img/img0.jpg" alt="Girl in a jacket"></img>
                <img className="scene-view-img" src="tmp_img/img1.jpg" alt="Girl in a jacket"></img>
                <img className="scene-view-img" src="tmp_img/img2.JPG" alt="Girl in a jacket"></img>
            </div>
        )
    }
}