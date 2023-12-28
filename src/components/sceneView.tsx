import './css/sceneView.css';

export function SceneView() {
    return (
        <div className="scene-view-container">
            <input className="scene-view-title" type="text" id="title" name="title" placeholder='Title'/><br/>
            <img className="scene-view-img" src="tmp_img/img0.jpg" alt="Girl in a jacket"></img>
            <img className="scene-view-img" src="tmp_img/img1.jpg" alt="Girl in a jacket"></img>
            <img className="scene-view-img" src="tmp_img/img2.JPG" alt="Girl in a jacket"></img>
        </div>
    )
}
