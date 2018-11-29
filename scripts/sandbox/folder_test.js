const path = require("path");
const fs = require("fs");
const dir = __dirname;

const date_path = path.join(dir, "../modules/dates.js");

const folder_month = require(date_path).folder_month;
const folder_year = require(date_path).folder_year;

const list_folder = path.join(dir, "../../../../Reports/List/");
const blast_folder = path.join(dir, "../../../../Reports/Blast/");
const send_folder = path.join(dir, "../../../../Reports/Send/");

const list_generator = (file, content) => {
    const top_folder = `${list_folder}${folder_year}`;
    const sub_folder = `${list_folder}${folder_year}/${folder_month}`;
    if (!fs.existsSync(top_folder)) {
        fs.mkdirSync(top_folder);
        setTimeout(() => {
            fs.mkdir(sub_folder, function(response) {
                console.log("Folder exists", response.code);
            });
        }, 1000);

        setTimeout(() => {
            fs.writeFile(sub_folder + "/" + file, content, function(err) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log(`${file} saved.`);
                }
            });
        }, 2000);
    }

    else if (!fs.existsSync(sub_folder)) {
        fs.mkdirSync(sub_folder);
        
        setTimeout(() => {
            fs.writeFile(sub_folder + "/" + file, content, function(err) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log(`${file} saved.`);
                }
            });
        }, 1000);
    }
    
    else {
        fs.writeFile(sub_folder + "/" + file, content, function(err) {
            if (err) {
                console.log(err);
            }
            else  {
                console.log(`${file} saved.`);
            }
        });
    }
};

module.exports = {
    list_generator
};