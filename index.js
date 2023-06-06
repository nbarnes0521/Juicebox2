const PORT = 3000;
const express = require('express');
const server = express();

const apiRouter = require('./api');
server.use('/api', apiRouter);

server.listen(PORT, () => {
  console.log('The server is up on port', PORT)
});


// npm run start:dev