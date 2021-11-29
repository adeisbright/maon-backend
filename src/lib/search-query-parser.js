/**
 * @description parses the params that are part of the search query
 * @param {Object} obj query params
 * @returns {Object}
 */
exports.parseQuery = function (obj) {
    const { page_no, limit, q, filter } = obj;
    const pageNumber = Math.abs(parseInt(page_no)) || 1;
    const docLimit = parseInt(limit) || 10;
    const skip = docLimit * (pageNumber - 1);
    const options = {};
    if (filter) {
        let filters = filter.replace(" ", "").split(",");
        filters.map((e) => (options[e.trim()] = 1));
    }
    return {
        query: q,
        skip: skip,
        limit: docLimit,
        filters: options,
    };
};
