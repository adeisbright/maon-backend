const redis = require("redis");
const {promisify} = require("util");

const client = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});

try {
  client.getAsync = promisify(client.get).bind(client);
  client.scardAsync = promisify(client.scard).bind(client);
  client.smembersAsync = promisify(client.smembers).bind(client);
  client.sismemberAsync = promisify(client.sismember).bind(client);
  client.srandmemberAsync = promisify(client.srandmember).bind(client);
  client.sremAsync = promisify(client.srem).bind(client);
  client.lrangeAsync = promisify(client.lrange).bind(client);
  client.ltrimAsync = promisify(client.ltrim).bind(client);
  client.hgetAsync = promisify(client.hget).bind(client);
  client.hgetallAsync = promisify(client.hgetall).bind(client);
  client.hexistsAsync = promisify(client.hexists).bind(client);
  client.hkeysAsync = promisify(client.hkeys).bind(client);
  client.hvalsAsync = promisify(client.hvals).bind(client);
  client.zcardAsync = promisify(client.zcard).bind(client);
  client.zcountAsync = promisify(client.zcount).bind(client);
  client.zrangeAsync = promisify(client.zrange).bind(client);
  client.zrankAsync = promisify(client.zrank).bind(client);
  client.existsAsync = promisify(client.exists).bind(client);
} catch (error) {
  console.error("Redis Error" + error);
}

client.on("connected", (e) => {
  console.log("Connected to the Redis Server");
});
client.on("error", (e) => {
  console.error("Redis Error ", e.message);
});

module.exports = client;
