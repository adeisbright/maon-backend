class SearchEngine {
  constructor(client) {
    this.client = client;
  }

  async index(index, type, id, doc) {
    return await this.client.transport.request({
      method: "PUT",
      path: `/${index}/${type}/${id}/_create`,
      body: doc,
    });
  }

  async search(index, type, matchObj, size = 5, from = 0) {
    return await this.client.transport.request({
      method: "POST",
      path: `/${index}/${type}/_search?filter_path=_id`,
      from: from,
      size: size,
      body: {
        query: {
          match: matchObj,
        },
      },
    });
  }
}

module.exports = SearchEngine;
