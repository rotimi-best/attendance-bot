

/**
 * @param {Object} params This should be an Object with fields you need in order to manipulate the date.
 * Currently there are 2 fields used which is: `monthInText` and `dayInText`
 * `monthInText`: if true then the name of the month will be returned instead of its index
 * e.g 2018-Nov-02 not 2018-12-02 
 */
const date = (params) => {
    const today = new Date();
    const daysInTextArr = CONSTANTS.DAYS.LONG;
    const { monthInText, dayInText } = params || false;
    const day = today.getDate();
    const dayText = today.getDay();
    const month = monthInText ? today.getMonth() : today.getMonth() + 1;
    const year = today.getFullYear();
    const monthArr = CONSTANTS.MONTHS.SHORT;

    let returnVal;

    if (dayInText) return daysInTextArr[dayText];

    if (monthInText) {
        returnVal = `${year}-${monthArr[month]}-${(day<10) ? '0'+day : day}`;
    } else {
        returnVal = `${year}-${month<10 ? '0'+month : month}-${(day<10) ? '0'+day : day}`;
    }
    
    return returnVal;
}

/**
 * Get the current time
 * @param {Number} value A number either to add or subtract from the hours in a day
 * @param {String} arithmeticOption This would be either "+" or "-". It determines if we want to add or subtract from time
 */
const time = (value, arithmeticOption) => {
    const today = new Date();
    let seconds = today.getSeconds();
    let minutes = today.getMinutes();
    let hour = today.getHours();

    if (value) {
        if (arithmeticOption === "+") {
            hour = today.getHours() + value;

            if (hour === 24) {
                hour = 0;
            } else if (hour > 24) {
                hour = hour - 24;
            }
        } else {
            if (hour < value) {
                let midnight = value - hour;
                if (midnight === 0) hour = 0;
                else hour = 24 - midnight;
            } else {
                hour = today.getHours() - value;
            }
        }
    }

    if (seconds < 10) seconds = '0' + seconds; 
    if (minutes < 10) minutes = '0' + minutes;
    if (hour < 10) hour = '0'+ hour;

    let returnVal = hour + ':' + minutes + ':' + seconds;
    return returnVal;
}

/**
 * Increase todays todate by any number of your choice or by a particular date
 * 
 * @param {Number} value The number by which you want to increase the date
 * @param {Date} date (optional) The date you want to begin increasing from.
 */
const increaseDay = (value, date) => {
    const today = new Date();
    // if the date is undefined then I use the date of that day
    // if the date is defined e.g 2018-01-10, I want only the day which is 10 so I use regex to get it.
    date === undefined ? today.setDate(today.getDate() + value) : today.setDate(parseInt(date.replace(/\d+(-)\d+(-)(0)/g, '')) + value)
    const increasedDay = today.getDate();
    const increasedMonth = today.getMonth()+1;
    const increasedYear = today.getFullYear(); 
    const future = `${increasedYear}-${increasedMonth<10 ? '0'+increasedMonth : increasedMonth}-${increasedDay<10 ? '0'+increasedDay : increasedDay}`;
    
    //Reseting the date back to todays date
    date === undefined ? today.setDate(today.getDate() - value) : today.setDate(parseInt(date.replace(/\d+(-)\d+(-)(0)/g, '')) - value)
    return future;
}

/**
 * Reduce todays todate by any number of your choice or by a particular date
 * 
 * @param {Number} value The number by which you want to reduce the date
 * @param {Date} date (optional) The date you want to begin reducing from.
 */
const reduceDay = (value, date) => {
    const today = new Date();
    //if the date is undefined then I use todays date
    //else if the date is defined e.g 2018-01-10, I want only the day which is 10 so I use regex to get it.
    date === undefined ? today.setDate(today.getDate() - value) : today.setDate(parseInt(date.replace(/\d+(-)\d+(-)(0)/g, '')) - value)
    const reducedDay = today.getDate();
    const reducedMonth = today.getMonth()+1;
    const reducedYear = today.getFullYear(); 
    const past = `${reducedYear}-${reducedMonth<10 ? '0'+reducedMonth : reducedMonth}-${reducedDay<10 ? '0'+reducedDay : reducedDay}`;
    
    date === undefined ? today.setDate(today.getDate() + value) : today.setDate(parseInt(date.replace(/\d+(-)\d+(-)(0)/g, '')) + value)
    return past;
}
const emojis = {
    'smile' : '🙂',
    'sad' : '😞',
    'coolGlasses' : '😎',
    'oneEye' : '😉',
    'typing' : '📝',
    'help' : '🔑',
    'byAlphabet' : '🔤',
    'search' : '🔎',
    chat : '🗣👂',
    fingerRight : '👉',
    save : '💾',
    fingerDown : '👇',
    byNumber : '🔢',
    wave: '👋',
    thumbsUp: '👍',
    thumbsDown: '👎',
    ok: '👌'
};

module.exports = {
    date,
    time,
    emojis,
    reduceDay,
    increaseDay
}