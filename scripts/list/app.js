const path = require("path");
const fs = require("fs");
const dir = __dirname;

const creds = path.join(dir, "../creds.json");

const api_key = require(creds).api_key;
const api_secret = require(creds).api_secret;
const sailthru = require("sailthru-client").createSailthruClient(api_key, api_secret);

const list_var = "status";
const list_value = "active";
const fields = { vars: 1 };
const stat = "list";
const primary = true;

const date_path = path.join(dir, "../modules/dates.js");
const generator_path = path.join(dir, "../modules/folder_gen.js");

const dates_array = require(date_path).dates_array;
const today = require(date_path).today;

const folder_month = require(date_path).folder_month;
const folder_year = require(date_path).folder_year;

const reports_folder = path.join(dir, "../../../../Reports/List/");
const top_folder = `${reports_folder}${folder_year}`
const sub_folder = `${reports_folder}${folder_year}/${folder_month}`;

const generator = require(generator_path).generator;

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
            const list_name = list.name;
            if (list.vars && list.vars[list_var] == list_value) {
                const list_data = [];
                dates_array.forEach(date => {
                    sailthru.apiGet("stats", {
                        stat: stat,
                        list: list_name,
                        date: date
                     }, 
                    function(err, response) {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            response.date = date;
                            response.avg_lists = (response.lists_count / response.email_count).toFixed(0);
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
                    const fields = ["date", "email_count", "engaged_count", "active_count", "passive_count", "disengaged_count", "dormant_count", "new_count", "optout_count", "hardbounce_count", "spam_count", "avg_lists"];
                    const file_name = `${today} ${list.name} list stats.csv`;
                
                    const json2csvParser = new Json2csvParser({ fields });
                    const csv = json2csvParser.parse(list_data);
                    console.log(csv);
                        generator(reports_folder + file_name, csv);
                }, 5000);
            }
        });
    }
});