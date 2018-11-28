const path = require("path");
const fs = require("fs");
const dir = __dirname;

const date_path = path.join(dir, "../modules/dates.js");
const folder_month = require(date_path).folder_month;
const folder_year = require(date_path).folder_year;

const reports_folder = path.join(dir, "../../../../Reports/Blast/");
const top_folder = `${reports_folder}${folder_year}`
const sub_folder = `${reports_folder}${folder_year}/${folder_month}`;

const generator = (file, content) => {
    fs.readdir(top_folder, function(err) {
        if (err) {

            fs.mkdirSync(top_folder);
            setTimeout(() => {
                fs.mkdirSync(sub_folder);
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
            }, 1000);
        }

        else {
            fs.readdir(sub_folder, function(err) {
                if (err) {

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
                        else {
                            console.log(`${file} saved.`);
                        }
                    });
                }
            });
        }
    });
};

module.exports = {
    generator
};