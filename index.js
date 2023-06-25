
const PORT = 3000;
const express = require('express');
const server = express();

const { client } = require('./db');
client.connect();

const morgan = require('morgan');
server.use(morgan('dev'));

server.use(express.json())

const apiRouter = require('./api');
server.use('/api', apiRouter);




server.listen(PORT, () => {
  console.log('The server is up on port', PORT)
});


// npm run start:dev