const keys = require('./keys');

// Express App Setup
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

console.log("POSTGRES_PARAMS:\nuser: "+keys.pgUser+"\nhost: "+keys.pgHost+"\nport: "+keys.pgPort+"\ndb: "+keys.pgDatabase+"\npwd: "+keys.pgPassword );
console.log("REDIS_PARAMS:\nhost: "+keys.redisHost+"\nport: "+keys.redisPort+"\n");

// Postgres Client Setup
const { Pool } = require('pg');
const pgClient = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDatabase,
  password: keys.pgPassword,
  port: keys.pgPort,
});

pgClient.on('connect', () => {
  console.log("#########################> try to connect to Postgres");
  pgClient
    .query('CREATE TABLE IF NOT EXISTS values (number INT)')
    .catch((err) => console.log(err));
});

// Redis Client Setup
const redis = require('redis');
const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000,
});
const redisPublisher = redisClient.duplicate();

// Express route handlers

app.get('/', (req, res) => {
  console.log("#########################> Send Hi by request /");
  res.send('Hi');
});

app.get('/values/all', async (req, res) => {
  console.log("#########################> PGSQL: SELECT * from values by request /values/all");
  const values = await pgClient.query('SELECT * from values');

  res.send(values.rows);
});

app.get('/values/current', async (req, res) => {
  console.log("#########################> REDIS: GET ALL by request /values/current");
  redisClient.hgetall('values', (err, values) => {
    res.send(values);
  });
});

app.post('/values', async (req, res) => {
  console.log("#########################> Post by request /values");
  const index = req.body.index;
  console.log("#########################> index= "+index);
  
  if (parseInt(index) > 40) {
    return res.status(422).send('Index too high');
  }
  try {
    console.log("#########################> Build for Redis");
    redisClient.hset('values', index, 'Nothing yet!');
    console.log("#########################> REDIS: Insert in cache");
    redisPublisher.publish('insert', index);
    console.log("#########################> PGSQL: Insert in DB");
    pgClient.query('INSERT INTO values(number) VALUES($1)', [index]);
    
  } catch (err) {
    console.log(err);
  }

  res.send({ working: true });
});

app.listen(5000, (err) => {
  console.log('Listening on 5000');
});
