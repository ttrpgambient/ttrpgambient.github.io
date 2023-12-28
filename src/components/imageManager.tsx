import { FunctionComponent } from 'react';

import './css/imageManager.css';
import './css/common.css';

import { ImagePicker } from './imagePicker';
import { ImageEditor } from './imageEditor';

type Props = {
    onClose: () => void;
    isVisible: boolean;
}

export const ImageManager: FunctionComponent<Props> = ({onClose, isVisible }) => {
    const visibility = isVisible ? "block" : "none";

    return ( 
        <div className='image-manager-container default-window-theme' style={{display: visibility}}>
            <div className='clearfix'>
                <label className='default-button-theme close-window-button' onClick={onClose}>X</label>
            </div>
            <div className='image-manager-view'>
                <ImagePicker/>
                <ImageEditor/>
            </div>
        </div>
    )
}
