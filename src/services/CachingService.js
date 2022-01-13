class CachingService {
    constructor(client) {
        this.client = client;
    }

    /**
     *
     * @param {String} hashKey key to identify
     * @param {String} key key of saved hash document
     * @param {String} value value of document been hashed
     * @param {Number} ttl duration before the document expires resulting in a cache miss
     * @returns
     */
    async cacheQuestion(hashKey, content, ttl = 30000) {
        this.client.set(hashKey, content);
        this.client.expire(hashKey, ttl);
        return this.client;
    }

    async getQuestion(key) {
        return this.client.getAsync(key);
    }

    async addStringData(hashKey, content, ttl = 30000) {
        this.client.set(hashKey, content);
        this.client.expire(hashKey, ttl);
        return this.client;
    }

    async getStringData(key) {
        return this.client.getAsync(key);
    }

    async incrStringData(key, value) {
        return this.client.incrbyAsync(key, value);
    }

    async addHashData(key, ...rest) {
        if (client.hexistsAsync(key)) {
            console.log("E dey");
        }
        return this.client.hmset(key, "email", "adeleke", "name", "Baho");
    }

    async getHashData(key, param) {
        return this.client.hgetAsync(key, param);
    }
}

module.exports = CachingService;
