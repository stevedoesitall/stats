const path = require("path");
const fs = require("fs");
const https = require("https");

const dir = __dirname;

const creds = path.join(dir, "../creds.json");

const api_key = require(creds).api_key;
const api_secret = require(creds).api_secret;
const sailthru = require("sailthru-client").createSailthruClient(api_key, api_secret);

const stat = "blast";
const sub_type = "detail";

const job = "blast_query";
const status = "sent";
const limit = 0;

const date_path = path.join(dir, "../modules/dates.js");
const generator_path = path.join(dir, "../modules/folder_gen.js");

const start_date = require(date_path).yesterday;
const end_date = require(date_path).today;

const folder_month = require(date_path).folder_month;
const folder_year = require(date_path).folder_year;

const reports_folder = path.join(dir, `../../../../Reports/${stat.toUpperCase()}/${sub_type.toUpperCase()}/`);const top_folder = `${reports_folder}${folder_year}`;
const sub_folder = `${reports_folder}${folder_year}/${folder_month}`;

const generator = require(generator_path).generator;

const downloader = (job_id, name) => {
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
                downloader(job_id, name);
            }, 10000);
        }
        else if (response.status == "completed") {
            const export_url = response.export_url;
            const file_name = `${name} - ${response.filename}`;
            const file_path = reports_folder + file_name;
            const writeable_file = fs.createWriteStream(file_path); //Creates a writable CSV file
            https.get(export_url, (response) => {
            console.log("Downloading file...", file_name);
            response.pipe(writeable_file); //Pipes in the job response data (i.e. the blast info) in the CSV
                fs.readFile(file_path, function(err, response) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        const data = [];
                        const read_response = response;
                        const parse = require("csv-parse");
                        parse(read_response, { delimiter: ",", columns: true, trim: true }, function(err, response) { 
                            if (err) {
                                console.log(err);
                            }
                            else {
                                let counter = 1;
                                const all_users = response;
                                all_users.forEach(user => {
                                    const id = user["profile_id"];
                                    const key = "sid";
                                    sailthru.apiGet("user", {
                                        id: id,
                                        key: key
                                    }, function(err, response) {
                                        if (err) {
                                            console.log(err);
                                        }
                                        else {
                                            user.email = response.keys.email;
                                            data.push(user);
                                        }
                                        
                                        if (counter == all_users.length) {
                                            const fields = Object.keys(data[0]);
                                            const Json2csvParser = require("json2csv").Parser;
                                            const json2csvParser = new Json2csvParser({ fields });
                                            const csv = json2csvParser.parse(data);
                                                generator(top_folder, sub_folder, file_name, csv);
                                                fs.unlinkSync(reports_folder + file_name, function(response) {
                                                    console.log(response);
                                                });
                                        }
                                        counter++;
                                    });
                                });
                            }
                        });
                    }
                });
            }).on("error", (err) => {
                console.log("Download error", err);
            });
        }
    });
};

sailthru.apiGet("blast", {
    status: status,
    limit: limit,
    start_date: start_date,
    end_date: end_date
}, 
function(err, response) {
    if (err) {
        console.log(err);
    }
    else {
        const all_blasts = response.blasts;
        all_blasts.forEach(blast => {
            const blast_id = blast.blast_id;
            const name = blast.name;
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
                        downloader(job_id, name);
                    }, 10000)
                }
            });
        });
    }   
});