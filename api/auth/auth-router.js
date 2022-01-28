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
