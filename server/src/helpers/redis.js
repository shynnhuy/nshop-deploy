const redis = require("redis");
const { success, error } = require("consola");
const client = redis.createClient({
  port: 6379,
  host: "redis",
});

// client.on("connect", () => {
//   console.log("Client connected to redis...");
//   success({
//     message: `Connected to MongoDB`,
//     badge: true,
//   });
// });

client.on("ready", () => {
  success({
    message: `Client connected to redis and ready to use...`,
    badge: true,
  });
});

client.on("error", (err) => {
  error({
    message: err.message,
    badge: true,
  });
});

client.on("end", () => {
  error({
    message: `Client disconnected from redis`,
    badge: true,
  });
});

process.on("SIGINT", () => {
  client.quit();
});

module.exports = client;
