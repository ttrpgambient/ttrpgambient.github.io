import './css/image.css'
import { FunctionComponent, useEffect, useRef, useState } from 'react'
import { appGlobals, SUPPORTED_FORMATS } from '../system/appGlobals'

type Props = {
    imageName: string;
    imageToEdit: string;
    setImageToEdit: (imageName: string) => void;
    imagesToDelete?: string[]
    markEditorToDelete?: (willDelete: boolean) => void;
}

export const Image: FunctionComponent<Props> = ({ imageName, imageToEdit, setImageToEdit, imagesToDelete, markEditorToDelete }) => {
    const imgRef = useRef<HTMLImageElement>(null);
    const canBeSelected = useRef<boolean>(false)
    const [markedForDelete, setMarkedForDelete] = useState<boolean>(false)

    function setImage(imageURL: string) {
        (imgRef.current as HTMLImageElement).src = imageURL;
    }

    function imageOnClick() {
        if (canBeSelected.current) {
            setImageToEdit(imageName)
            if ( imagesToDelete && markEditorToDelete ){
                const imageToDeleteIndex = imagesToDelete.indexOf(imageName);
                if ( imageToDeleteIndex != -1 ) {
                    markEditorToDelete( true );
                } else {
                    markEditorToDelete( false );
                }
            }
        }
    }
    
    function deleteOnClick( e: React.MouseEvent<HTMLLabelElement> ) {
        e.stopPropagation();
        if ( !imagesToDelete ) return;

        const imageToDeleteIndex = imagesToDelete.indexOf(imageName);
        if ( imageToDeleteIndex == -1 ) {
            setMarkedForDelete( true );
            imagesToDelete.push(imageName);

            if ( imageName === imageToEdit && markEditorToDelete ) {
                markEditorToDelete(true);
            }

        } else {
            setMarkedForDelete( false );
            imagesToDelete[imageToDeleteIndex] = imagesToDelete[imagesToDelete.length-1];
            imagesToDelete.length -= 1;

            if ( imageName === imageToEdit && markEditorToDelete ) {
                markEditorToDelete(false);
            }
        }

    }
    
    // Logic
    useEffect(() => {
        if ( imagesToDelete ){
            const imageToDeleteIndex = imagesToDelete.indexOf(imageName);
            if ( imageToDeleteIndex != -1 ) {
                setMarkedForDelete( true );
            } 
        }

        if (appGlobals.imagesCache.has(imageName)) {
            setImage(appGlobals.imagesCache.get(imageName) as string);
            canBeSelected.current = true;
        } else {
            appGlobals.system?.getFileSystem().downloadFile(imageName)
                .then((result) => {
                    if (!!!imgRef.current || !!!result.file || !!!result.file.content) {
                        return;
                    }

                    if (!SUPPORTED_FORMATS.has(result.file.content.type)) {
                        throw Error('Unknown file type for reaction: ' + result.file.content.type);
                    }

                    const urlObject = URL.createObjectURL(result.file.content);
                    setImage(urlObject);
                    appGlobals.imagesCache.set(imageName, urlObject);
                    canBeSelected.current = true;
                }
                )
        }
    }, []);

    let imageClass = "image-container image-container-not-selected";
    if ( imageToEdit === imageName ) {
        imageClass = "image-container image-container-selected"
    } else if ( markedForDelete ) {
        imageClass = "image-container image-container-delete"
    }

    return (
        <div className={imageClass} onClick={imageOnClick}>
            <label className='default-button-theme close-window-button' onClick={deleteOnClick}>X</label>
            <img ref={imgRef} src="tmp_image.svg" className='image-main' style={{ fill: 'white' }} />
        </div>
    )
}
