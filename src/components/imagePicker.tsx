import './css/imagePicker.css'
import { TagsInput } from './tagsInput'
import { useState, useEffect, useRef, FunctionComponent } from 'react'
import { appGlobals } from '../system/appGlobals';
import { Image } from './image';

type Props = {
    managerVersion: number;
    imageToEdit: string;
    setImageToEdit: (imageName: string) => void;
}

export const ImagePicker: FunctionComponent<Props> = ({managerVersion, imageToEdit, setImageToEdit}) => {
    const [imageList, setImageList] = useState<string[]>([])
    const [tagsListState, setTagsListState] = useState<string[]>([]);

    const imageTagList = useRef<string[]>([]);
    const imageEmptyTagList = useRef<string[]>([]);

    function getAllImagesWithTags(imageList: string[]) {
        imageTagList.current = imageList;
        setImageList( [...imageEmptyTagList.current, ...imageTagList.current] );
    }

    function getEmptyTagList(imageList: string[]) {
        imageEmptyTagList.current = imageList;
        setImageList( [...imageEmptyTagList.current, ...imageTagList.current] );
    }

    function onTagSelect(_tagName: string, tagsList: string[] ) {
        setTagsListState( tagsList );
    }

    function onTagDeselect(_tagName: string, tagsList: string[] ) {
        setTagsListState( tagsList );
    }

    useEffect(() => {
        setImageList([]);
        imageEmptyTagList.current = [];
        imageTagList.current = [];

        if (tagsListState.length == 0) {
            appGlobals.idbTagsImages.getAllImagesWithTags( [""], getAllImagesWithTags );
        } else {
            appGlobals.idbTagsImages.getImagesExclusiveTag( "", getEmptyTagList );
            appGlobals.idbTagsImages.getAllImagesWithTags( tagsListState, getAllImagesWithTags );
        }
    }, [managerVersion, tagsListState])

    function ImagesGrid() {
        let images: JSX.Element[] = [];
        
        for ( let image of imageList ) {
            images.push(
                <Image key={image} imageName={image} imageToEdit={imageToEdit} setImageToEdit={setImageToEdit}/>
            )
        }

        return images;
    }

    return (
        <div className='image-picker-container default-window-theme'>
            <TagsInput onTagSelect={onTagSelect} onTagDeselect={onTagDeselect} disabled={false}/>
            <div className='image-picker-grid'>
                <ImagesGrid/>
            </div>
        </div>
    )
}