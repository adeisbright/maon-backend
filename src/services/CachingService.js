class CachingService {
    constructor(client) {
        this.client = client;
    }

    async cacheContent(key, content, ttl = 0) {
        return this.client.set(key, content);
    }

    async retrieveContent(key) {
        return this.client.getAsync(key);
    }
}

module.exports = CachingService;
