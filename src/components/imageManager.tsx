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
    const [managerVersion, setManagerVersion] = useState<number>(0);

    function updateManagerVersion() {
        setManagerVersion(current => current + 1);
    }

    return ( 
        <div className='image-manager-container default-window-theme'>
            <div className='clearfix'>
                <label className='default-button-theme close-window-button' onClick={onClose}>X</label>
            </div>
            <div className='image-manager-view'>
                <ImagePicker managerVersion={managerVersion} setImageToEdit={setImageToEdit}/>
                <ImageEditor updateManagerVersion={updateManagerVersion} setImageToEdit={setImageToEdit} openImageName={imageToEdit}/>
            </div>
        </div>
    )
}
