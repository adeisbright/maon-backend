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

    async update(index, type, id, doc) {
        return await this.client.transport.request({
            method: "PUT",
            path: `/${index}/${type}/${id}/_doc`,
            body: doc,
        });
    }

    async search(index, type, matchObj, size = 5, from = 0) {
        return await this.client.transport.request(
            {
                method: "POST",
                path: `/${index}/${type}/_search`,
                from: 0,
                size: 20,
                body: {
                    query: {
                        match: matchObj,
                    },
                },
            },
            {
                requestTimeout: 10,
                timeout: 10,
            }
        );
    }
}

module.exports = SearchEngine;
