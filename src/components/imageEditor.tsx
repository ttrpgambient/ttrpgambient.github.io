import { ChangeEvent, useState, useRef, DragEvent, FunctionComponent, useEffect } from 'react';
import { appGlobals, IMAGES_PATH, SUPPORTED_FORMATS } from '../system/appGlobals';

import './css/imageEditor.css'

import { TagsInput } from './tagsInput'
import { FileSystemStatus, FileUploadMode } from '../interfaces/system/fs_interface';

const DROP_DEFAULT_COLOR = '#919191';
const DROP_HOVER_COLOR = '#FFFFFF';

type Props = {
    updateManagerVersion: () => void;
    setImageToEdit: (imageName: string) => void;
    openImageName?: string
    markedToDelete?: boolean;
    markToDelete?: (willDelete: boolean) => void;
}

export const ImageEditor: FunctionComponent<Props> = ({updateManagerVersion, setImageToEdit, openImageName, markedToDelete, markToDelete}) => {

    const imgElement = useRef<HTMLImageElement>(null);
    const [imgName, setImgName] = useState<string>("");
    const [tags, setTags] = useState<string[]>([]);

    function uploadImage( file: File, fileURL: string ) {
        if ( !!!file ) return;
        if ( !!!appGlobals.system ) return;

        if ( !SUPPORTED_FORMATS.has(file.type)) {
            throw Error('Wrong file type to upload: ' + file.type);
        }

        appGlobals.system.getFileSystem().uploadFile( IMAGES_PATH + file.name, {content: file}, FileUploadMode.Add )
        .then(
            (result) => {
                if (result.status !== FileSystemStatus.Success) {
                    throw Error('Couldnt upload image, status: ' + result.status);
                }
                if ( !!!result.fileInfo ) {
                    throw Error('Image upload has no fileInfo, status: ' + result.status);
                }
                const name = result.fileInfo.name as string;
                setImgName( name );
                setImageToEdit("")
                if ( markToDelete ) markToDelete(false);
                appGlobals.idbTagsImages.addRecord("", name, () => {
                    appGlobals.imagesCache.set(name, fileURL);
                    updateManagerVersion();
                })
                
            }
        )
    }

    function showAndUploadImageFile( image: File ) {
        const reader = new FileReader();
        reader.onload = function (e) {
            if (!imgElement.current || !e.target || !e.target.result) return;
            const imgURL = e.target.result as string;
            imgElement.current.src = imgURL;

            uploadImage(image, imgURL);
        }
        reader.readAsDataURL(image);
    }

    function readIMG(inputEvent: ChangeEvent<HTMLInputElement>) {
        if ( !imgElement.current ) return;
        
        setImgName( "" );

        const input = inputEvent.currentTarget;
        if ( input.files && input.files[0]) {
            showAndUploadImageFile(input.files[0]);
        }
    }

    function onTagSelect(tagName: string ) {
        if ( imgName === "") {
            throw Error('onTagSelect no Image!');
        }
        appGlobals.idbTagsImages.addRecord(tagName, imgName);
    }

    function onTagDeselect(tagName: string ) {
        if ( imgName === "") {
            throw Error('onTagSelect no Image!');
        }
        appGlobals.idbTagsImages.removeRecord(tagName, imgName);
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
                            showAndUploadImageFile(file);
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
                        showAndUploadImageFile(file);
                    }
                }
            }
        }
    }

    useEffect(() => {
        if (openImageName && openImageName !== "" && openImageName !== imgName) {
            if (!imgElement.current) {
                throw Error('No Image element');
            }

            if (!appGlobals.imagesCache.has(openImageName)) {
                throw Error('No Image in Cache: ' + openImageName);
            }

            setImgName(openImageName)

            appGlobals.idbTagsImages.getImageTags(openImageName, (tags) => {
                    setTags(tags)
            });

            imgElement.current.src = appGlobals.imagesCache.get(openImageName) as string;
        }
    }, [openImageName]);

    const imageClass = (markedToDelete === undefined || !markedToDelete)  ? "image-editor-img" : "image-editor-img image-editor-img-delete"

    return (
        <div className='image-editor-container default-window-theme'>
            <TagsInput onTagSelect={onTagSelect} onTagDeselect={onTagDeselect} disabled={imgName === ""} usedTags={tags}/>
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
                <img src="add_image.svg" className={imageClass} ref={imgElement} />
            </div>
        </div>
    )
}