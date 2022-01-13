//const { Client } = require("elasticsearch");
// const client = new Client({
//   node: process.env.ELASTICSEARCH_CONNECTION,
// });

//Using Elastic Cloud
const { Client } = require("@elastic/elasticsearch");

const client = new Client({
    cloud: {
        id: process.env.ELASTIC_CLOUD_ID,
    },
    auth: {
        username: process.env.ELASTIC_CLOUD_USER,
        password: process.env.ELASTIC_CLOUD_PASSWORD,
    },
});
module.exports = client;
