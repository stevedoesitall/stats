const path = require("path");
const fs = require("fs");
const dir = __dirname;

const reports_folder = path.join(dir, "../../../../Reports/List/");

const creds = path.join(dir, "../creds.json");

const api_key = require(creds).api_key;
const api_secret = require(creds).api_secret;
const sailthru = require("sailthru-client").createSailthruClient(api_key, api_secret);

const list_var = "status";
const list_value = "active";
const fields = { vars: 1 };
const stat = "list";
const primary = true;

const date_path = path.join(dir, "../dates.js");
const dates_array = require(date_path).dates_array;

sailthru.apiGet("list", {
    primary: primary,
    fields: fields
 }, 
function(err, response) {
    if (err) {
        console.log(err);
    }
    else {
        const all_lists = response.lists;
        all_lists.forEach(list => {
            if (list.vars && list.vars[list_var] == list_value) {
                const list_data = [];
                dates_array.forEach(date => {
                    sailthru.apiGet("stats", {
                        stat: stat,
                        list: list.name,
                        date: date
                     }, 
                    function(err, response) {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            response.date = date;
                            list_data.push(response);
                        }   
                    });
                });
                
                setTimeout(() => {
                    function compare(a, b) {
                        if (a.date < b.date)
                          return -1;
                        if (a.date > b.date)
                          return 1;
                        return 0;
                      }
                
                    list_data.sort(compare);
                      
                    const Json2csvParser = require("json2csv").Parser;
                    const fields = ["date", "email_count", "engaged_count", "active_count", "passive_count", "disengaged_count", "dormant_count", "new_count", "optout_count", "hardbounce_count", "spam_count", "lists_count"];
                    const file_name = `${require(date_path).today} ${list.name} list stats.csv`;
                
                    const json2csvParser = new Json2csvParser({ fields });
                    const csv = json2csvParser.parse(list_data);
                    console.log(csv);
                    fs.writeFile(reports_folder + file_name, csv, (err) => {
                        if (err) throw err;
                        console.log(`${file_name} was saved.`);
                    }); 
                }, 5000);
            }
        });
    }
});