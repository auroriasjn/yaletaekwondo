'use client'

import { useState } from 'react';
import { createTagMap, translateTags, parseTagIds } from './taglist';
import Tag from "./tagbox";
import TagCreate from "./tagcreate";

export default function TagSelect({ tagsString, tags }) {
    const [tagMap, setTagMap] = useState(createTagMap(tags));
    const [tagIds, setTagIds] = useState(parseTagIds(tagsString));
    const [translatedTags, setTranslatedTags] = useState(translateTags(tagIds, tagMap));
    const [createTag, setCreateTag] = useState(null);

    const resetTag = (name, color, id) => {
        const newTag = { name: name, color: color };

        setCreateTag(null);
        setTranslatedTags([...translatedTags, newTag]);
        setTagIds([...tagIds, id]);
        setTagMap({
            ...tagMap,
            [newTag.id]: newTag
        });

        const tagsInput = document.getElementById("tags-input");
        tagsInput.value = '';
    };

    function handleKeyDown(e) {
        if (e.key !== 'Enter') {
            return;
        }

        const value = e.target.value.trim();
        if (!value) {
            return;
        }

        const tagEntry = Object.entries(tagMap).find(
            ([key, tag]) => tag.name === value
        );

        // Adding a tag
        if (!tagEntry) {
            setCreateTag(value);
            return;
        }

        const tagKey = tagEntry[0];

        // Checking for duplicates
        if (translatedTags.some(tag => tag.name === value)) {
            return;
        }

        setTranslatedTags([...translatedTags, tagMap[tagKey]]);
        setTagIds([...tagIds, tagKey]);
        e.target.value = '';
    }

    function removeTag(index) {
        const newTags = translatedTags.filter((_, i) => i !== index);
        const newTagIds = tagIds.filter((_, i) => i !== index);

        setTranslatedTags(newTags);
        setTagIds(newTagIds);
    }

    return (
        <div className="tag_class_container">
            {translatedTags.length !== 0 && translatedTags.map((tag, index) => (
                <div key={tag.name} className="tag-item">
                    <Tag color={tag.color}>{tag.name}</Tag>
                    <span className="close" onClick={() => removeTag(index)}>&times;</span>
                </div>
            ))}
            {createTag &&
                <>
                    <button className="cancel" onClick={() => setCreateTag(null)}>&times;</button>
                    <TagCreate name={createTag} onFinished={resetTag} />
                </>
            }
            <input onKeyDown={handleKeyDown} type="text" className="tags-input" id="tags-input" placeholder="Enter tags..." />
            <input name="tags" type="hidden" value={tagIds.join(",")} />
        </div>
    )
}
