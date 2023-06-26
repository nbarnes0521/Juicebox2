const express = require('express');
const apiRouter = express.Router();


// USERS //
const usersRouter = require('./users');
apiRouter.use('/users', usersRouter);

// POSTS //
const postsRouter = require('./posts');
apiRouter.use('/posts', postsRouter);

// TAGS //
const tagsRouter = require('./tags');
apiRouter.use('/tags', tagsRouter);

module.exports = apiRouter;

// npm run start:dev