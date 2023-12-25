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
        <div className='image-manager-container default-theme' style={{display: visibility}}>
            <button type="button" className='close-window-button' onClick={onClose}>X</button>
            <div className='image-manager-view'>
                <ImagePicker/>
                <ImageEditor/>
            </div>
        </div>
    )
}
