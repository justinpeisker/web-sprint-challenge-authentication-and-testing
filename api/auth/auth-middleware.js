
const { findBy } = require('../../users/users-model')

const checkUsernameExists = async (req, res, next) => {
 
    try {
      const [user] = await findBy({username: req.body.username})
      if(!user) {
        next({status: 401, message: 'Invalid credentials'})
      } else {
        req.user = user
        next()
      }
    } catch (err) {
      next(err)
    }
  }