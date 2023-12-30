import './css/imagePicker.css'
import { TagsInput } from './tagsInput'
import { useState, useEffect } from 'react'
import { appGlobals } from '../system/appGlobals';

export function ImagePicker() {
    const [tagsVersion, setTagsVersion] = useState(0);
    const [imageList, setImageList] = useState<string[]>([])

    const [tagsListState, setTagsListState] = useState<string[]>([""]);

    function ImagesGrid() {

    }

    function getImageList(imageList: string[]) {
        setImageList( imageList );
        console.log(imageList);
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
        <div className='default-window-theme'>
            <TagsInput onTagSelect={onTagSelect} onTagDeselect={onTagDeselect} disabled={false}/>
            <div className='image-picker-grid'>

            </div>
        </div>
    )
}