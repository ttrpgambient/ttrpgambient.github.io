//https://dev.to/0shuvo0/lets-create-an-add-tags-input-with-react-js-d29
//https://www.digitalocean.com/community/tutorials/react-react-autocomplete

import {useState, useRef, FunctionComponent} from 'react';
import './css/tagsInput.css';

class TagsInputProps {}

const allTags: string[] = ['test0', 'test1', 'test2'];
const selectedTags: number[] = [0, 2];
const currentSuggestions: number[] = [];

export const TagsInput: FunctionComponent<TagsInputProps> = (props: TagsInputProps) => {
  const [tagsVersion, setTagsVersion] = useState(0);
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1);
  const [suggestionsVersion, setSuggestionsVersion] = useState(0);

  const suggestionsFocusedRef = useRef<boolean>(false);
  const inputElement = useRef<HTMLInputElement>(null);
  const suggestionsElement = useRef<HTMLUListElement>(null);

  const updateTagsVersion = () => {
    setTagsVersion(tagsVersion+1);
  };

  const updateSuggestionsVersion = () => {
    setSuggestionsVersion(suggestionsVersion+1);
  };

  const addTag = (value: string): boolean => {
    if (!value.trim()) return false;

    value = value.toLowerCase();

    let tagID = allTags.indexOf(value);
    if (tagID === -1) {
      // new tag
      tagID = allTags.push(value) - 1;
    } else {
      if (selectedTags.includes(tagID)) return false;
    }

    selectedTags.push(tagID);
    updateTagsVersion();

    return true;
  };

  const selectSuggestion = (suggestionID: number) => {
    setSelectedSuggestion(suggestionID);
  };

  const handleSuggestionsOnKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const currentSuggestionsCount = currentSuggestions.length;
    if (currentSuggestionsCount === 0) return;

    let currentSelectedSuggestion = selectedSuggestion;
    if (event.key === 'ArrowDown') {
      currentSelectedSuggestion += 1;
      event.preventDefault();
    } else if (event.key === 'ArrowUp') {
      currentSelectedSuggestion -= 1;
      event.preventDefault();
    }

    if (currentSelectedSuggestion < 0) {
      currentSelectedSuggestion = currentSuggestionsCount - 1;
    }

    if (currentSelectedSuggestion === currentSuggestionsCount) {
      currentSelectedSuggestion = 0;
    }

    suggestionsFocusedRef.current = true;

    selectSuggestion(currentSelectedSuggestion);
  };

  const updateCurrentSuggestions = (element: HTMLInputElement) => {
    suggestionsFocusedRef.current = false;
    currentSuggestions.length = 0;

    if (element.value === '') return;

    const value = element.value.toLowerCase();

    const tagsCount = allTags.length;
    for (let tagID = 0; tagID < tagsCount; ++tagID) {
      if (!selectedTags.includes(tagID)) {
        if (allTags[tagID].includes(value)) {
          currentSuggestions.push(tagID);
        }
      }
    }

    updateSuggestionsVersion();
    selectSuggestion(-1);
  };

  // Events
  const eventRemoveTag = (index: number) => {
    selectedTags.splice(index, 1);
    updateTagsVersion();
  };

  const eventOnKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const element = event.currentTarget;

    // Filter out keys
    if (event.key === ' ' || event.key === 'Spacebar') {
      event.preventDefault();
      return;
    } else if (event.key === 'Enter') {
      if (suggestionsFocusedRef.current) {
        element.value = allTags[currentSuggestions[selectedSuggestion]];
        updateCurrentSuggestions(element);
      } else {
        if (addTag(element.value)) {
          element.value = '';
          updateCurrentSuggestions(element);
        }
      }
      return;
    }

    handleSuggestionsOnKeyDown(event);
  };

  const eventOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const element = event.currentTarget;
    updateCurrentSuggestions(element);
  };

  const findSuggestionID = (element: HTMLLIElement): number => {
    const suggestionsChildren = suggestionsElement.current?.children;
    const suggestionsCount = currentSuggestions.length;
    for (let suggestionID = 0; suggestionID < suggestionsCount; ++suggestionID) {
      if (suggestionsChildren?.item(suggestionID) === element) return suggestionID;
    }

    return -1;
  };

  const eventSuggestionOnClick = (event: React.MouseEvent<HTMLLIElement>) => {
    const element = inputElement.current;
    if (!element) return;

    let currentSelectedSuggestion = selectedSuggestion;
    if (currentSelectedSuggestion === -1) {
        currentSelectedSuggestion = findSuggestionID(event.currentTarget);
    }

    element.value = allTags[currentSuggestions[currentSelectedSuggestion]];
    updateCurrentSuggestions(element);
    element.focus();
  };

  const eventSuggestionMouseEnter = (event: React.MouseEvent<HTMLLIElement>) => {
    const suggestionID = findSuggestionID(event.currentTarget);
    if (suggestionID !== -1) {
      selectSuggestion(suggestionID);
    }
  };

  // Render
  const renderSuggestions = (): React.ReactNode => (
    <ul ref={suggestionsElement} className="tags-suggestions">
      {currentSuggestions.map((suggestionID, index) => {
        let className;
        // Flag the active suggestion with a class
        if (index === selectedSuggestion) {
          className = 'tags-suggestion-active';
        }

        const tag = allTags[suggestionID];
        return (
          <li
            className={className}
            key={tag}
            onClick={eventSuggestionOnClick}
            onMouseEnter={eventSuggestionMouseEnter}
          >
            {tag}
          </li>
        );
      })}
    </ul>
  );

  return (
    <div>
      <div className="tags-input-container">
        {selectedTags.map((tagID, index) => (
          <div className="tag-item" key={index}>
            <span className="text">{allTags[tagID]}</span>
            <span className="close" onClick={() => eventRemoveTag(index)}>
              &times;
            </span>
          </div>
        ))}
        <input
          ref={inputElement}
          type="text"
          className="tags-input"
          placeholder="Type something"
          onKeyDown={eventOnKeyDown}
          onChange={eventOnChange}
        />
      </div>
      {renderSuggestions()}
    </div>
  );
};
