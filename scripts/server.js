//Scheduler File
const dir = __dirname;

const blast_det_path = `${dir}/blast/app_det.js`;
const blast_sum_path = `${dir}/blast/app_sum.js`;
const list_path = `${dir}/list/app.js`;
const send_path = `${dir}/send/app.js`;

const cron = require("node-cron");

const scheduler_obj = {
    minute: ["18", "19", "20", "21"],
    hour: "12",
    dom: "*",
    month: "*",
    dow: "*"
};

const list_scheduler = `${scheduler_obj.minute[0]} ${scheduler_obj.hour} ${scheduler_obj.dom} ${scheduler_obj.month} ${scheduler_obj.dow}`;

const send_scheduler = `${scheduler_obj.minute[1]} ${scheduler_obj.hour} ${scheduler_obj.dom} ${scheduler_obj.month} ${scheduler_obj.dow}`;

const blast_sum_scheduler = `${scheduler_obj.minute[2]} ${scheduler_obj.hour} ${scheduler_obj.dom} ${scheduler_obj.month} ${scheduler_obj.dow}`;

const blast_det_scheduler = `${scheduler_obj.minute[3]} ${scheduler_obj.hour} ${scheduler_obj.dom} ${scheduler_obj.month} ${scheduler_obj.dow}`;


cron.schedule(list_scheduler, () => {
    require(list_path);
});

cron.schedule(send_scheduler, () => {
    require(send_path);
});

cron.schedule(blast_sum_scheduler, () => {
    require(blast_sum_path);
});

cron.schedule(blast_det_scheduler, () => {
    require(blast_det_path);
});