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
}

module.exports = CachingService;
