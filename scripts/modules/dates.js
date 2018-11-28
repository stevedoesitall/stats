const converter = (ts) => {
    let date = new Date(ts);
    let day = date.getDate();
    let month = date.getMonth() + 1; //Tick up 1 since January is 0
    const year = date.getFullYear();
    
    //Add "0" if less than 10 to force a two-digit string

    if (day < 10) {
        day = "0" + day;
    }
    
    if (month < 10) {
        month = "0" + month;
    } 

    return year + "-" + month + "-" + day;
};

const file_gen = () => {
    let date = new Date();
    let month = date.getMonth() + 1; //Tick up 1 since January is 0
    const year = date.getFullYear();

    switch(month) {
        case 1:
            month = "January";
        break;

        case 2:
            month = "February";
        break;

        case 3:
            month = "March";
        break;
    
        case 4:
            month = "April";
        break;

        case 5:
            month = "May";
        break;

        case 6:
            month = "June";
        break;

        case 7:
            month = "July";
        break;

        case 8:
            month = "August";
        break;

        case 9:
            month = "September";
        break;

        case 10:
            month = "October";
        break;

        case 11:
            month = "November";
        break;

        case 12:
            month = "December";
        break;
    }

    const folder_object = {
        "month": month,
        "year": year
    };

    return folder_object;
};


let today = Math.floor(Date.now());
let annyong = 86400000;
let days_ago = 30;
let end_date = today - annyong;
let start_date = today - (annyong * days_ago);
const dates_array = [];
let ticker = 1;

while (ticker <= days_ago) {
    const date_item = today - (annyong * ticker);
    dates_array.push(converter(date_item));
    ticker++;
}

//Need to create vars for new file paths

module.exports = {
    converter,
    today: converter(today),
    yesterday: converter(today - annyong),
    start_date: converter(start_date),
    end_date: converter(end_date),
    dates_array,
    folder_month: file_gen().month,
    folder_year: file_gen().year
};