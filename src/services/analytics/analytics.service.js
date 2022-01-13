const redisClient = require("../../loader/redis-loader");
const CachingService = require("../CachingService");
const cachingService = new CachingService(redisClient);

class AnalyticsService {
    static async incrVisit(url) {
        const key = `pages:${url}`;
        const count = await cachingService.getStringData(key);
        const myWork = await cachingService.getHashData("ade", "name");
        if (count) {
            await cachingService.incrStringData(key, 1);
            console.log(myWork);
        } else {
            await cachingService.addStringData(key, 1);
            await cachingService.addHashData(
                "ade",
                "name",
                "Adeleke",
                "age",
                27
            );
        }
        console.log(count);
        redisClient.hmset("ade", "name", "Adeleke Bright", "age", 27);

        return count;
    }

    static async pageCount(page) {
        return await cachingService.getStringData(page);
    }

    static createCSRFToken() {
        return String(Math.random() * 1000) + Date.now();
    }

    static async addCSRFToken(key) {
        const token = await cachingService.cacheQuestion(
            key,
            AnalyticsService.createCSRFToken()
        );

        console.log(token);
        return token;
    }

    // static async getCSRFToken(key) {
    //     return await cachingService.getQuestion(key);
    // }
}

module.exports = AnalyticsService;
