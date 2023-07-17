const express = require('express');
const jwt = require('jsonwebtoken');

const { getAllUsers, getUserByUsername, createUser, findingUsername } = require('../db');

const usersRouter = express.Router();


// Middleware
usersRouter.use((req, res, next) => {
  console.log("A request is being made to /users");

  next(); // THIS IS DIFFERENT
});

// GET
usersRouter.get('/', async (req, res) => {
  const users = await getAllUsers();

  res.send({
    users
  });
});

// POST///////

// LOGIN ////
usersRouter.post('/login', async (req, res, next) => {
  const { username, password } = req.body;

  // request must have both
  if (!username || !password) {
    next({
      name: "MissingCredentialsError",
      message: "Please supply both a username and password"
    });
  }

  try {
    const user = await getUserByUsername(username);

    if (user && user.password == password) {
      const token = jwt.sign({ 
        id: user.id, 
        username
      }, process.env.JWT_SECRET, {
        expiresIn: '1w'
      });

      res.send({ 
        message: "you're logged in!",
        token 
      });
    } else {
      next({ 
        name: 'IncorrectCredentialsError', 
        message: 'Username or password is incorrect'
      });
    }
  } catch(error) {
    console.log(error);
    next(error);
  }
});

// EDITED REGISTER ROUTE /// 
usersRouter.post('/register', async (req, res, next) => {
  const { username, password, name, location } = req.body;

  try {
    const userExists = await findingUsername(username);

    if (userExists !== null) {
      next({
        name: 'UserExistsError',
        message: 'A user with that username already exists'
      });
    } else {
      const user = await createUser({ username, password, name, location });

      const token = jwt.sign(
        {
          id: user.id,
          username
        },
        process.env.JWT_SECRET,
        {
          expiresIn: '1w'
        }
      );

      res.send({
        message: 'Thank you for signing up',
        token
      });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});



module.exports = usersRouter;

// http://localhost:3000/api/users