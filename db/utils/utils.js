exports.formatDates = list => {
    return list.map(item => {
        const newItem = {...item};
        newItem.created_at = new Date(newItem.created_at);
        console.log(newItem)
        return newItem;
    });
};

exports.makeRefObj = list => {};

exports.formatComments = (comments, articleRef) => {};

