export const sortDateAsc = (arr) => {
    return arr.sort((a,b) => {return a.date_published - b.date_published})
};
export const sortDateDsc = (arr) => {
    return arr.sort((a,b) => {return b.date_published - a.date_published})
};
export const sortTitleAsc = (arr) => {
    return arr.sort((a,b) => {
        let x = a.title.toLowerCase(), y = b.title.toLowerCase();
        return x < y ? 1 : -1
    })
};
export const sortTitleDsc = (arr) => {
    return arr.sort((a,b) => {
        let x = a.title.toLowerCase(), y = b.title.toLowerCase();
        return x > y ? -1 : 1
    })
};
export const sortNameAsc = (arr) => {
    return arr.sort((a,b) => {
        let x = a.name.toLowerCase(), y = b.name.toLowerCase();
        return x > y ? 1 : -1
    })
};
export const sortNameDsc = (arr) => {
    return arr.sort((a,b) => {
        let x = a.name.toLowerCase(), y = b.name.toLowerCase();
        return x > y ? -1 : 1
    })
}