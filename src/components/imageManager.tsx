import { FunctionComponent, useState } from 'react';

import './css/imageManager.css';
import './css/common.css';

import { ImagePicker } from './imagePicker';
import { ImageEditor } from './imageEditor';

type Props = {
    onClose: () => void;
}

export const ImageManager: FunctionComponent<Props> = ({onClose }) => {
    const [imageToEdit, setImageToEdit] = useState<string>("");

    return ( 
        <div className='image-manager-container default-window-theme'>
            <div className='clearfix'>
                <label className='default-button-theme close-window-button' onClick={onClose}>X</label>
            </div>
            <div className='image-manager-view'>
                <ImagePicker setImageToEdit={setImageToEdit}/>
                <ImageEditor openImage={imageToEdit}/>
            </div>
        </div>
    )
}
