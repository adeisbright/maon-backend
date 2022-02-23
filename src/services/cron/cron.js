const { CronJob } = require("cron");
const axios = require("axios");
const messageExchange = require("../message-exchange");
const redisClient = require("../../loader/redis-loader");
const CachingService = require("../CachingService");
const cachingService = new CachingService(redisClient);

const usersAPI = "http://localhost:5500/users";
let runCron = true;

const job = (
    cb,
    interval = "* * * * * *",
    timezone = "America/Los_Angeles"
) => {
    j = new CronJob(interval, cb, null, true, timezone);
    if (!runCron) {
        j.stop();
    } else {
        j.start();
    }
};

/**
 * @description retrieves a list of users
 * @param {*} url
 * @returns
 */
const fetchUsers = async (url) => {
    let doc = await axios.get(url);
    if (doc) {
        return {
            body: doc.data.data,
        };
    }
    return false;
};

fetchUsers(usersAPI);

/**
 * @decription saves a marker as a point to where we are in retrieving users from the DB
 * @returns
 */
const checkAndSave = async () => {
    let readControl = JSON.parse(await cachingService.getQuestion("rc"));
    // Retrieve the last skip
    const pageNumber = readControl
        ? Math.abs(parseInt(readControl.page_no))
        : 1;
    const docLimit = readControl ? parseInt(readControl.limit) : 4;

    const url = `${usersAPI}?page_no=${pageNumber}&limit=${docLimit}`;
    let users = await fetchUsers(url);
   
    if (users.body.length > 0) {
        console.log(pageNumber);
        console.log(users);
        const rc = {
            limit: 4,
            page_no: pageNumber + 1 ,
        };
        const data = {
                index: "moanapp",
                type: "questions",
                format : "bulk",
                body: users.body,
        };
        await messageExchange(data, "es", "fanout", "esKey");
        await cachingService.cacheQuestion("rc", JSON.stringify(rc), 5000);
    } else {
        runCron = false;
        //Send an alert for the cron job to be paused
        console.log("No more record to fetch")
    }
    // Now fetch records use skip and limit
    

    //Message the data queue
    return users;
};

job(checkAndSave, "*/20 * * * * *");
