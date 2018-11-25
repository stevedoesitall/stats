const path = require("path");
const fs = require("fs");
const dir = __dirname;

const reports_folder = path.join(dir, "../../../../Reports/Send/");

const creds = path.join(dir, "../creds.json");

const api_key = require(creds).api_key;
const api_secret = require(creds).api_secret;
const sailthru = require("sailthru-client").createSailthruClient(api_key, api_secret);

const label = "active";
const stat = "send";
const active_templates = [];

const date_path = path.join(dir, "../dates.js");
const start_date = require(date_path).start_date;
const end_date = require(date_path).end_date;

sailthru.apiGet("template", { }, 
function(err, response) {
    if (err) {
        console.log(err);
    }
    else {
        const all_templates = response.templates;
        all_templates.forEach(template => {
            if (template.labels && template.labels.includes(label)) {
                sailthru.apiGet("stats", {
                    "stat": stat,
                    "template": template.name,
                    "start_date": start_date,
                    "end_date": end_date
                    }, 
                function(err, response) {
                    if (err || response.error) {
                        console.log(`No stats for ${template.name}.`);
                    }
                    else {
                        response.template = template.name;
                        active_templates.push(response);
                        if (!response.confirmed_opens) {
                            response.confirmed_opens = 0;
                            response.open_rate = 0
                        }
                        else {
                            response.open_rate = ((response.confirmed_opens / response.count) * 100).toFixed(2);
                        }

                        if (!response.click) {
                            response.click = 0;
                            response.cto_rate = 0;
                        }
                        else {
                            response.cto_rate = ((response.click / response.confirmed_opens) * 100).toFixed(2);
                        }

                        if (!response.pv) {
                            response.pv = 0;
                        }

                        if (!response.rev) {
                            response.rev = 0;
                        }

                        else {
                            response.rev = response.rev / 100;
                        }
                    }
                });
            }
        });
    }   
});

setTimeout(() => {
    const Json2csvParser = require('json2csv').Parser;
    const fields = ["template", "count", "confirmed_opens", "open_rate", "click", "cto_rate", "pv", "rev"];
    const file_name = require(date_path).today + " send stats.csv";

    const json2csvParser = new Json2csvParser({ fields });
    const csv = json2csvParser.parse(active_templates);
    console.log(csv);
    fs.writeFile(reports_folder + file_name, csv, (err) => {
        if (err) throw err;
        console.log(`${file_name} was saved.`);
    }); 
}, 1000);