const express = require('express');
const postsRouter = express.Router();
const { getAllPosts } = require('../db');

// postsRouter.use((req, res, next) => {
//   console.log("A request is being made to /posts");

//   res.send({ message: 'hello from /posts!' });
// });

// module.exports = postsRouter;

postsRouter.use((req, res, next) => {
  console.log("A request is being made to /posts");

  next(); 
});

postsRouter.get('/', async (req, res) => {
  const posts = await getAllPosts();

  res.send({
    posts
  });
});

module.exports = postsRouter;