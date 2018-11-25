const converter = (ts) => {
    let date = new Date(ts);
    let day = date.getDate();
    let month = date.getMonth() + 1; //Tick up 1 since January is 0
    const year = date.getFullYear();
    
    if (day < 10) {
        day = "0" + day;
    } 
    
    if (month < 10) {
        month = "0" + month;
    } 

    return year + "-" + month + "-" + day;
}

let current_time = Math.floor(Date.now());
let annyong = 86400000;
let days_ago = 30;
let end_date = current_time - annyong;
let start_date = current_time - (annyong * days_ago);

today = converter(current_time);
start_date = converter(start_date);
end_date = converter(end_date);

module.exports = {
    today,
    start_date,
    end_date
}
