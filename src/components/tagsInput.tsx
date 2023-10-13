//https://dev.to/0shuvo0/lets-create-an-add-tags-input-with-react-js-d29
//https://www.digitalocean.com/community/tutorials/react-react-autocomplete

import React from 'react';
import './css/tagsInput.css';

class TagsInputProps {

}

class TagsInputState {
    tagsVersion: number = 0;
    selectedSuggestion: number = -1;
    suggestionsVersion: number = 0;
}

export class TagsInput extends React.Component<TagsInputProps, TagsInputState> {
    allTags: string[] = [];
    selectedTags: number[] = [];

    currentSuggestions: number[] = [];
    suggestionsFocused: boolean = false;

    inputElement: React.RefObject<HTMLInputElement>;
    suggestionsElement: React.RefObject<HTMLUListElement>;

    constructor(props: TagsInputProps) {
        super(props);
        this.state = new TagsInputState();

        this.allTags.push('test0', 'test1', 'test2');
        this.selectedTags.push(0,2);
        
        this.inputElement               = React.createRef();
        this.suggestionsElement         = React.createRef();

        this.eventOnKeyDown            = this.eventOnKeyDown.bind(this); 
        this.eventRemoveTag            = this.eventRemoveTag.bind(this); 
        this.eventOnChange             = this.eventOnChange.bind(this); 
        this.eventSuggestionOnClick    = this.eventSuggestionOnClick.bind(this); 
        this.eventSuggestionMouseEnter = this.eventSuggestionMouseEnter.bind(this); 
    }

    updateTagsVersion() {
        this.setState((state: TagsInputState) => {
            return {tagsVersion: state.tagsVersion + 1};
        });
    }

    updateSuggestionsVersion() {
        this.setState((state: TagsInputState) => {
            return {suggestionsVersion: state.suggestionsVersion + 1};
        });
    }

    addTag(value: string) : boolean {
        if (!value.trim()) 
            return false;

        value = value.toLowerCase();

        let tagID = this.allTags.indexOf(value);
        if ( tagID === -1 ) { //new tag
            tagID = this.allTags.push(value) - 1;
        } else {
            if ( this.selectedTags.includes(tagID)) 
                return false;
        }

        this.selectedTags.push(tagID);
        this.updateTagsVersion();

        return true;
    }

    selectSuggestion(suggestionID: number) {
        this.setState(() => {
            return {selectedSuggestion: suggestionID};
        });
    }

    handleSuggestionsOnKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
        let currentSuggestionsCount = this.currentSuggestions.length;
        if ( currentSuggestionsCount === 0 ) return;

        let currentSelectedSugestion = this.state.selectedSuggestion;
        if ( event.key === "ArrowDown" ) {
            currentSelectedSugestion += 1;
            event.preventDefault();
        } else if (event.key === "ArrowUp" ) {
            currentSelectedSugestion -= 1;
            event.preventDefault();
        }

        if ( currentSelectedSugestion < 0 ) {
            currentSelectedSugestion = currentSuggestionsCount - 1;
        }

        if ( currentSelectedSugestion === currentSuggestionsCount ) {
            currentSelectedSugestion = 0;
        }
        
        this.suggestionsFocused = true;

        this.selectSuggestion(currentSelectedSugestion);
    }

    updateCurrentSuggestions( element: HTMLInputElement ) {
        this.suggestionsFocused = false;
        this.currentSuggestions.length = 0;

        if ( element.value === "" ) 
            return;

        let tagsCount = this.allTags.length;
        for ( let tagID = 0; tagID < tagsCount; ++tagID ) {
            if ( !this.selectedTags.includes(tagID) ) {
                if ( this.allTags[tagID].includes(element.value) ) {
                    this.currentSuggestions.push(tagID);
                }
            }
        }

        this.updateSuggestionsVersion();
        this.selectSuggestion(-1);
    }

    // Events
    eventRemoveTag(index: number){
        this.selectedTags.splice(index,1);
        this.updateTagsVersion();
    }

    eventOnKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
        let element = event.currentTarget;
        
        // Filter out keys
        if ( event.key === " " ||
             event.key === "Spacebar") {
                event.preventDefault();
                return;
        } else if ( event.key === "Enter" ) {
            if ( this.suggestionsFocused ) {
                element.value = this.allTags[this.currentSuggestions[this.state.selectedSuggestion]];
                this.updateCurrentSuggestions(element);
            } else {
                if ( this.addTag(element.value) ) {
                    element.value = '';
                    this.updateCurrentSuggestions(element);
                }
            }
            return;
        }        

        this.handleSuggestionsOnKeyDown(event);
    }

    eventOnChange(event: React.ChangeEvent<HTMLInputElement>) {
        let element = event.currentTarget;
        this.updateCurrentSuggestions(element);
    }

    eventSuggestionOnClick() {
        let element = this.inputElement.current;
        if (!element) 
            return;
        
        element.value = this.allTags[this.currentSuggestions[this.state.selectedSuggestion]];
        this.updateCurrentSuggestions(element);
        element.focus();
    }

    eventSuggestionMouseEnter(event: React.MouseEvent<HTMLLIElement>) {
        let suggestionsChildren = this.suggestionsElement.current?.children;
        let suggestionsCount = this.currentSuggestions.length;
        for ( let suggestionID = 0; suggestionID < suggestionsCount; ++suggestionID) {
            if ( suggestionsChildren?.item(suggestionID) === event.currentTarget )
                this.selectSuggestion(suggestionID);
        }
    }

    // Render
    renderSuggestions(): React.ReactNode {
        return  (
            <ul ref={this.suggestionsElement} className="tags-suggestions">
            {
                this.currentSuggestions.map((suggestionID, index) => {
                    let className;
                    // Flag the active suggestion with a class
                    if (index === this.state.selectedSuggestion) {
                        className = "tags-suggestion-active";
                    }

                    let tag = this.allTags[suggestionID];
                    return (
                        <li className={className} key={tag} onClick={this.eventSuggestionOnClick} onMouseEnter={this.eventSuggestionMouseEnter}>
                        {tag}
                        </li>
                    );
                }
            )}
          </ul>
        )
    }

    render(): React.ReactNode {
        return (
            <div>
                <div className="tags-input-container">
                    { 
                        this.selectedTags.map((tagID, index) => (
                        <div className="tag-item" key={index}>
                            <span className="text">{this.allTags[tagID]}</span>
                            <span className="close" onClick={() => this.eventRemoveTag(index)}>&times;</span>
                        </div>
                        )) 
                    }
                    <input ref={this.inputElement} type="text" className="tags-input" placeholder="Type somthing" onKeyDown={this.eventOnKeyDown} onChange={this.eventOnChange}/>                
                </div>
                {this.renderSuggestions()}
            </div>
        )
    }
}