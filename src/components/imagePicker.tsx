import './css/imagePicker.css'
import { TagsInput } from './tagsInput'
import { useState, useEffect } from 'react'
import { appGlobals } from '../system/appGlobals';
import { Image } from './image';

export function ImagePicker() {
    const [imageList, setImageList] = useState<string[]>([])

    const [tagsListState, setTagsListState] = useState<string[]>([""]);

    function ImagesGrid() {
        let images: JSX.Element[] = [];
        
        for ( let image of imageList ) {
            images.push(
                <Image key={image} imageName={image}/>
            )
        }

        return images;
    }

    function getImageList(imageList: string[]) {
            setImageList( imageList );
    }

    function onTagSelect(_tagName: string, tagsList: string[] ) {
        tagsList.push("");
        setTagsListState( tagsList );
    }

    function onTagDeselect(_tagName: string, tagsList: string[] ) {
        tagsList.push("");
        setTagsListState( tagsList );
    }

    useEffect(() => {
        appGlobals.idbTagsImages.getAllImagesWithTags( tagsListState, getImageList );
    }, [tagsListState])

    return (
        <div className='image-picker-container default-window-theme'>
            <TagsInput onTagSelect={onTagSelect} onTagDeselect={onTagDeselect} disabled={false}/>
            <div className='image-picker-grid'>
                <ImagesGrid/>
            </div>
        </div>
    )
}