import './css/image.css'
import { FunctionComponent, useEffect, useRef } from 'react'
import { appGlobals, SUPPORTED_FORMATS } from '../system/appGlobals'

type Props = {
    imageName: string
    setImageToEdit: (imageName: string) => void;
}

export const Image: FunctionComponent<Props> = ({ imageName, setImageToEdit }) => {
    const imgRef = useRef<HTMLImageElement>(null);
    const canBeSelected = useRef<boolean>(false)

    function setImage( imageURL: string ) {
        (imgRef.current as HTMLImageElement).src = imageURL;
    }

    function imageOnClick() {
        if ( canBeSelected.current )
            setImageToEdit(imageName)
    }

    useEffect(() => {
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
                    setImage( urlObject );
                    appGlobals.imagesCache.set(imageName, urlObject);
                    canBeSelected.current = true;
                }
                )
        }
    }, []);
    return ( 
    <div className='image-container' onClick={imageOnClick}>
        <img ref={imgRef} src="tmp_image.svg" className='image-main' style={{fill: 'white'}}/>
    </div>
    )
}
