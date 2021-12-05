const redis = require("redis");
const {promisify} = require("util");

const client = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});

try {
  // Promisify redis client to work with Async-Await
  client.getAsync = promisify(client.get).bind(client);
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
