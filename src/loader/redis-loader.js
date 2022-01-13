const redis = require("redis");
const { promisify } = require("util");

// Connecting to local cluster
const client = redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
});
// Connecting to a remote redis cluster
// const client = redis.createClient({
//     host: process.env.SCALEGRID_REDIS_HOST,
//     port: process.env.SCALEGRID_REDIS_PORT,
//     password: process.env.SCALEGRID_REDIS_PASSWORD,
// });

try {
    // Promisify redis client to work with Async-Await
    client.getAsync = promisify(client.get).bind(client);
    client.incrbyAsync = promisify(client.incrby).bind(client);
    client.hgetAsync = promisify(client.hget).bind(client);
    client.hgetallAsync = promisify(client.hgetall).bind(client);
    client.hexistsAsync = promisify(client.hexists).bind(client);
    client.hkeysAsync = promisify(client.hkeys).bind(client);
    client.hvalsAsync = promisify(client.hvals).bind(client);
    client.existsAsync = promisify(client.exists).bind(client);
} catch (error) {
    console.error(error);
}

client.on("connected", (e) => {
    console.log("Connected to Redis Server");
});
client.on("error", (e) => console.error(e));
module.exports = client;
