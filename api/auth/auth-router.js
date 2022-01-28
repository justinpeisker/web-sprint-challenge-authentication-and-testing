const router = require('express').Router();
const bcrypt = require('bcryptjs')
const User = require('../users/users-model')
const { checkUsernameExists, unAndPassRequired  } = require('./auth-middleware')
const { JWT_SECRET } = require("../../secrets");
const jwt = require('jsonwebtoken')

router.post('/register', unAndPassRequired,checkUsernameExists, (req, res, next) => {
  let user = req.body
  const hash = bcrypt.hashSync(user.password, 8)
  user.password = hash
  User.add(user)
    .then(newUser => {
      res.status(201).json(newUser)
    })
    .catch(next)

  // res.end('implement register, please!');
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.
    DO NOT EXCEED 2^8 ROUNDS OF HASHING!

    1- In order to register a new account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel", // must not exist already in the `users` table
        "password": "foobar"          // needs to be hashed before it's saved
      }

    2- On SUCCESSFUL registration,
      the response body should have `id`, `username` and `password`:
      {
        "id": 1,
        "username": "Captain Marvel",
        "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
      }

    3- On FAILED registration due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED registration due to the `username` being taken,
      the response body should include a string exactly as follows: "username taken".
  */

  
    // const { username, password } = req.body
    // const hash = bcrypt.hashSync(password, 8)
    
    // if(!username || !password) {
    //   next({message: "username and password required"})
    // } else {
    //   const newUser = User.add({username, password: hash} )
    //   res.status(201).json(newUser)
    // }

  // const {username, password} = req.body
  // if(username && password) {
  //   const hash = bcrypt.hashSync(password, 8)
  //   User.add({username, password: hash})
  //   .then(newUser => {
  //     res.status(201).json(newUser)
  //     } 
  //   ).catch(next)
  // } else {
  //   next({message: "username and password required"})
  // }
  


  // const {username, password} = req.body
  // if(!username || !password) {
  //   next({message: "username and password required"})
  //   }
  //   const hash = bcrypt.hashSync(password, 8)
  //   User.add({username, password: hash})
  //   .then(newUser => {
  //     res.status(201).json(newUser)
  //     } 
  //   )
  //   .catch(next)
    
});

router.post('/login', unAndPassRequired, (req, res, next) => {

let { username, password } = req.body

  User.findBy({ username })
    .then(([user]) => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = buildToken(user)
        res.status(200).json({ message: `welcome ${user.username}`, token })
      } else {
        next({ status: 401, message: 'invalid Credentials' })
      }
    })
    .catch(next)

});



function buildToken(user) {
  const payload = {
    username: user.username,
    password: user.password
  }
  const options = {
    expiresIn: '1d',
  }
  return jwt.sign(payload, JWT_SECRET, options)
}
module.exports = router;
