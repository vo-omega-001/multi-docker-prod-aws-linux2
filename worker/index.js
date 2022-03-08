const keys = require('./keys');
const redis = require('redis');

console.log("\n\n###############################################################");
console.log("###] MULTI-DOCKER-WORKER Configuration:[###");
console.log("###########################################");
console.log("\nHost: "+keys.redisHost+"\nPort: "+keys.redisPort+"\n");
console.log("###############################################################\n\n");

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000,
});
const sub = redisClient.duplicate();

function fib(index) {
  if (index < 2) return 1;
  return fib(index - 1) + fib(index - 2);
}

sub.on('message', (channel, message) => {
  redisClient.hset('values', message, fib(parseInt(message)));
});
sub.subscribe('insert');
