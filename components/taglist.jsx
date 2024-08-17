import Tag from './tagbox.jsx';

export function parseTagIds(tagsString) {
    if (!tagsString) {
        return [];
    }

    return tagsString.split(',').map(Number);
}

export function createTagMap(tags) {
    const tagMap = {};
    tags.forEach(tag => {
        tagMap[tag.id] = { name: tag.tag, color: tag.color };
    });
    return tagMap;
}

export function translateTags(tagIds, tagMap) {
    if (tagIds.length === 0 || !tagMap) {
        return [];
    }

    return tagIds.map(id => tagMap[id]);
}

export default function TagList({ tagsString, tags }) {
    if (tagsString === null) {
        return null;
    }

    const tagIds = parseTagIds(tagsString);
    const tagMap = createTagMap(tags);
    const translatedTags = translateTags(tagIds, tagMap);

    return (
        <div className="tag_list">
            {translatedTags.length !== 0 && translatedTags.map((tag) => (
                <Tag key={tag.id} color={tag.color}>{tag.name}</Tag>
            ))}
        </div>
    );
}