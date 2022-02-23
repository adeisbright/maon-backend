const { CronJob } = require("cron");
const sum = require("./sum");
let a = (b = 1);
let i = 0;
const runFunction = () => {
    console.log("I am running this function");
    i++;
    console.log(i);
};

// const job = new CronJob(
//     "* * * * * *",
//     () => {
//         if (a === 1) {
//             console.log("I know we just started this but ....");
//         }

//         a = sum(a, b);
//         console.log(`My love for you will last till: ${a}`);
//     },
//     null,
//     true,
//     "America/Los_Angeles"
// );

const anotherJob = new CronJob("* * * * * *", runFunction, null, true, "UTC");
//job.start();
anotherJob.start();

if (i == 3) {
    anotherJob.stop();
}
