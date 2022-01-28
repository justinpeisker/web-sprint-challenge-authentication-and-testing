
const { findBy } = require('../users/users-model')

const checkUsernameExists = async (req, res, next) => {
 
    try {
      const [user] = await findBy({username: req.body.username})
      if(!user) {
        next({status: 401, message: 'username taken'})
      } else {
        req.user = user
        next()
      }
    } catch (err) {
      next(err)
    }
  }

  const unAndPassRequired = (req, res, next) => {
    const {username, password} = req.body
    if(!username || !password) {
        next({message: "username and password required"})
    } else {
        next()
    }
  }

  module.exports = {
    checkUsernameExists,
    unAndPassRequired,
  }