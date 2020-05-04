exports.formatDates = list => {
    return list.map(item => {
        const newItem = {...item};
        newItem.created_at = new Date(newItem.created_at);
        return newItem;
    });
};

exports.makeRefObj = list => {
    const ref = list.reduce((newRef, article) => {
        newRef[article['title']] = article['article_id'];
        return newRef
    }, {});
    return ref;
};

exports.formatComments = (comments, articleRef) => {};

