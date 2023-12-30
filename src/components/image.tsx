import './css/image.css'
import { FunctionComponent, useEffect, useRef } from 'react'
import { appGlobals, SUPPORTED_FORMATS } from '../system/appGlobals'

type Props = {
    imageName: string
}

export const Image: FunctionComponent<Props> = ({ imageName }) => {
    const imgRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        if (appGlobals.imagesCache.has(imageName)) {
            (imgRef.current as HTMLImageElement).src = appGlobals.imagesCache.get(imageName) as string;
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
                    imgRef.current.src = urlObject;
                    appGlobals.imagesCache.set(imageName, urlObject);
                }
                )
        }
    }, []);
    return <img ref={imgRef} src="tmp_image.svg" className='image-main' />
}
