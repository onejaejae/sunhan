import { createClient } from "redis";

let client;

// if (process.env.NODE_ENV === "dev") {
//   (async () => {
//     client = createClient();

//     client.on("error", (err) => console.log("Redis Client Error", err));

//     await client.connect();
//   })();
// } else {
//   (async () => {
//     client = createClient({
//       url: `redis://alice:foobared@awesome.redis.server:6380redis-server`,
//     });

//     client.on("error", (err) => console.log("Redis Client Error", err));

//     await client.connect();
//   })();
// }

if (process.env.NODE_ENV === "production") {
  client = createClient({
    host: "redis-server",
    port: process.env.REDIS_PORT_PRO,
  });
} else {
  client = createClient();

  client.auth(process.env.REDIS_PASSWORD, (err, reply) => {
    if (err) throw err;
  });
}

export default client;
