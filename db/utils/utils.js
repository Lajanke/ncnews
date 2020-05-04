const formatDates = (list) => {
    return list.map(item => {
        const newItem = { ...item };
        newItem.created_at = new Date(newItem.created_at);
        return newItem;
    });
};

const makeRefObj = (list, param1, param2) => {
    const ref = list.reduce((newRef, article) => {
        newRef[article[param1]] = article[param2];
        return newRef
    }, {});
    return ref;
};

const formatComments = (comments, articleRef) => {
    const newComments = comments.map((comment) => {
        const { belongs_to: key1, created_by: key2, ...restOfKeys } = comment;
        return { article_id: articleRef[key1], author: key2, ...restOfKeys };
    });
    const formatTimestamp = formatDates(newComments)
    return formatTimestamp;
}

module.exports = { formatDates, makeRefObj, formatComments, }

