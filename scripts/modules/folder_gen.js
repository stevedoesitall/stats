const fs = require("fs");

const generator = (top_folder, sub_folder, file, content) => {
    if (!fs.existsSync(top_folder)) {
        fs.mkdirSync(top_folder);
        setTimeout(() => {
            fs.mkdir(sub_folder, function(response) {
                if (response && response.code) {
                    console.log("Folder exists", response.code);
                }
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
    generator
};