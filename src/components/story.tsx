import { FunctionComponent, KeyboardEvent, useRef } from 'react';
import './css/story.css';
type Props = {
    storyKey: number;
    title: string;
    titleChanged: ( titleOld: string, titleNew: string ) => string;
    removeStory: (key: number, title: string) => void;
}
export const Story: FunctionComponent<Props> = ({storyKey, title, titleChanged, removeStory}) => {
    const titleRef = useRef<HTMLInputElement>(null);

    function onKeyDown(e: KeyboardEvent<HTMLInputElement>){
        if ( titleRef.current && e.key === 'Enter') {
            title = titleChanged(title, e.currentTarget.value);
            titleRef.current.value = title;
        }
    }

    function onBlur() {
        if ( titleRef.current && title !== titleRef.current.value) {
            title = titleChanged(title, titleRef.current.value);
            titleRef.current.value = title;
        }
    }

    return (
        <div className="story-container">
            <input autoFocus ref={titleRef} className="story-title" type="text" id="title" name="title" placeholder='Title' defaultValue={title} onKeyDown={onKeyDown} onBlur={onBlur}/>
            <button type='button' onClick={()=>removeStory(storyKey, title)}>Remove</button>
        </div>
    )
}
