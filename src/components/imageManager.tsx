import { FunctionComponent } from 'react';

import './css/imageManager.css';
import './css/common.css';

type Props = {
    onClose: () => void;
    isVisible: boolean;
}

export const ImageManager: FunctionComponent<Props> = ({onClose, isVisible }) => {
    const visibility = isVisible ? "block" : "none";

    return ( 
        <div className='image-manager-container' style={{display: visibility}}>
            <button type="button" className='close-window-button' onClick={onClose}>X</button>
        </div>
    )
}
