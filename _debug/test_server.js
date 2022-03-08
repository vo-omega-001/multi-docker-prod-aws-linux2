//----------------------------------------------------
//----------------------------------------------------
//For debug in Node prompt
//1. Open a shell on the container [sudo docker exec -it ${containerId} /bin/sh]
//2. Open a node prompt [ /app # => enter node]
//3. Enter you JS line code [> "enter a JS command"]
//----------------------------------------------------
const keys = require('./keys');

//----------------------------------------------------
const { Pool } = require('pg');
const pgClient = new Pool({user: keys.pgUser, host: keys.pgHost, database: keys.pgDatabase, password: keys.pgPassword, port: keys.pgPort});

//----------------------------------------------------
const redis = require('redis');
const redisClient = redis.createClient({ host: keys.redisHost, port: keys.redisPort, retry_strategy: () => 1000});

//----------------------------------------------------
let pgValues = [];
function pgSelect(values){ pgClient.query('SELECT * from values').then( val => {values[0] = val;}); };
pgSelect(pgValues);
pgVvalues[0].rows;

//----------------------------------------------------
let redisValues = [];
function redisSelect(values) { redisClient.hgetall('values', (err, values) => {values[0] = values; }); };
redisSelect(redisValues);
redisValues[0];

