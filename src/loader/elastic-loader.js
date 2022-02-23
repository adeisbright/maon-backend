const { Client } = require("elasticsearch");
const client = new Client({
    node: process.env.ELASTICSEARCH_CONNECTION,
    reqquestTimeout : 10000 , 
    disablePrototypePoisoningProtection : true , 
    compression : true  , 
    maxRetries : 10
});

//Using Elastic Cloud
// const { Client } = require("@elastic/elasticsearch");

// const client = new Client({
//     cloud: {
//         id: process.env.ELASTIC_CLOUD_ID,
//     },
//     auth: {
//         username: process.env.ELASTIC_CLOUD_USER,
//         password: process.env.ELASTIC_CLOUD_PASSWORD,
//     },
// });

//Events on client that can be used for observability 

// client.on("serialization" , (err , result) => console.log(err , result))

// //Emitted even before request reaches elasticsearch 
// client.on("request" , (err , result) => console.log(err , result))

// client.on("response" , (err , result) => console.log(err , result))

module.exports = client;
