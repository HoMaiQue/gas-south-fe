import moment from "moment";
export const compareDate = (date) => {
    let momentPresent = moment();
    if (date > momentPresent) return 1;
    return -1;
};

export const handleShowDate = (date) => {
    if(!date){
        return ''
    }
    return date
        .slice(0, 10)
        .split("-")
        .reverse()
        .join("-");
};
