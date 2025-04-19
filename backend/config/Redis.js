const redis = require("redis");

const redis_port = process.env.REDIS_PORT || 6379;

// Creating redis client
// const client = redis.createClient({
//   legacyMode: true,
//   PORT: redis_port,
// });

const client = redis.createClient({
  legacyMode: true,
  url: process.env.REDIS_URL,
  tls: {
    rejectUnauthorized: false,
  },
});

client.on("error", (error) => {
  console.log("Redis Error: ", error);
});

// Connecting redis client
client.connect();
client.on("connect", () => {
  console.log("Redis Client Connected");
});

module.exports = client;
