const path = require("path");
const fs = require("fs");
const dir = __dirname;

const reports_folder = path.join(dir, "../../../../Reports/Blast/");

const creds = path.join(dir, "../creds.json");

const api_key = require(creds).api_key;
const api_secret = require(creds).api_secret;
const sailthru = require("sailthru-client").createSailthruClient(api_key, api_secret);

const job = "blast_query";
const status = "sent";
const limit = 0;
const active_blasts = [];

const date_path = path.join(dir, "../dates.js");
const today = require(date_path).today;
const start_date = require(date_path).start_date;
const end_date = require(date_path).end_date;

const downloader = (job_id) => {
    sailthru.apiGet("job", {
        "job_id": job_id
        }, 
    function(err, response) {
        if (err || response.error) {
            console.log(err);
        }
        else if (response.status == "pending") {
            console.log("Retrying...");
            setTimeout(() => {
                downloader(job_id);
            }, 10000);
        }
        else {
            console.log(response.export_url);
        }
    });
};

sailthru.apiGet("blast", {
    status: status,
    limit: limit,
    start_date: "2018-11-22",
    end_date: "2018-11-26"
 }, 
function(err, response) {
    if (err) {
        console.log(err);
    }
    else {
        const all_blasts = response.blasts;
        all_blasts.forEach(blast => {
            const blast_id = blast.blast_id;
            sailthru.apiPost("job", {
                "job": job,
                "blast_id": blast_id
                }, 
            function(err, response) {
                if (err || response.error) {
                    console.log(`No stats for ${blast_id}.`);
                }
                else {
                    const job_id = response.job_id;
                    setTimeout(() => {
                        downloader(job_id);
                    }, 10000)
                }
            });
        });
    }   
});

// setTimeout(() => {
//     const Json2csvParser = require("json2csv").Parser;
//     const fields = ["name", "blast_id", "count", "delivered", "confirmed_opens", "open_total", "open_rate", "click_total", "click_multiple_urls", "cto_rate", "pv", "purchase", "purchase_rate", "rev", "optout", "optout_rate", "hardbounce", "hardbounce_rate", "softbounce", "softbounce_rate", "spam", "spam_rate"];
//     const file_name = `${today} blast stats.csv`;

//     const json2csvParser = new Json2csvParser({ fields });
//     const csv = json2csvParser.parse(active_blasts);
//     console.log(csv);
//     fs.writeFile(reports_folder + file_name, csv, (err) => {
//         if (err) throw err;
//         console.log(`${file_name} was saved.`);
//     }); 
// }, 5000);