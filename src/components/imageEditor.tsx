import { ChangeEvent, useRef, DragEvent } from 'react';
import './css/imageEditor.css'

import { TagsInput } from './tagsInput'

const SUPPORTED_FORMATS = new Set(['image/png', 'image/jpeg']);
const DROP_DEFAULT_COLOR = '#919191';
const DROP_HOVER_COLOR = '#FFFFFF';

export function ImageEditor() {

    const imgElement = useRef<HTMLImageElement>(null);

    function loadImageFile( image: File ) {
        const reader = new FileReader();
        reader.onload = function (e) {
            if (!imgElement.current || !e.target || !e.target.result) return;
            imgElement.current.src = e.target.result as string;
        }
        reader.readAsDataURL(image);
    }

    function readIMG(inputEvent: ChangeEvent<HTMLInputElement>) {
        if ( !imgElement.current ) return;
        
        const input = inputEvent.currentTarget;
        if ( input.files && input.files[0]) {
            loadImageFile(input.files[0])
        }
    }

    function onDragEnter(e: DragEvent<HTMLDivElement>) {
        e.stopPropagation();
        e.preventDefault();
    }

    function onDragLeave(e: DragEvent<HTMLDivElement>) {
        e.stopPropagation();
        e.preventDefault();
        e.currentTarget.style.backgroundColor = DROP_DEFAULT_COLOR;
    }

    function onDragOver(e: DragEvent<HTMLDivElement>) {
        e.stopPropagation();
        e.preventDefault();
        e.currentTarget.style.backgroundColor = DROP_HOVER_COLOR;
    }

    function onDrop(e: DragEvent<HTMLDivElement>) {
        e.stopPropagation();
        e.preventDefault();
        e.currentTarget.style.backgroundColor = DROP_DEFAULT_COLOR;

        if ( e.dataTransfer.items ) {
            const items = e.dataTransfer.items;
            const itemsCount = items.length;
            for ( let i = 0; i < itemsCount; ++i ) {
                if (items[i].kind === 'file') {
                    const file = items[i].getAsFile();
                    if ( !!file ) {
                        if ( SUPPORTED_FORMATS.has(file.type) ) {
                            loadImageFile(file)
                        }
                    }
                }
            }
        } else {
            const files = e.dataTransfer.files;
            const filesCount = files.length;
            for ( let f = 0; f < filesCount; ++f ) {
                const file = files[f];
                if ( !!file ) {
                    if ( SUPPORTED_FORMATS.has(file.type) ) {
                        loadImageFile(file)
                    }
                }
            }
        }
    }

    return (
        <div className='image-editor-container default-window-theme'>
            <button type='button'>Remove</button>
            <button type='button'>Add</button>
            <TagsInput/>
            <label htmlFor='add_image' className='default-button-theme'>
                Load Image
            </label>
            <input 
                id='add_image' 
                type='file' 
                style={{visibility: 'hidden'}}
                accept={Array.from(SUPPORTED_FORMATS).join(',')}
                onChange={readIMG}
            />

            <div className='image-editor-drop' style={{backgroundColor: DROP_DEFAULT_COLOR}} onDragEnter={onDragEnter} onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}>
                <img src="add_image.svg" className='image-editor-img' ref={imgElement} />
            </div>
        </div>
    )
}