const {Client} = require("elasticsearch");
const client = new Client({
  node: process.env.ELASTICSEARCH_CONNECTION,
});

module.exports = client;
