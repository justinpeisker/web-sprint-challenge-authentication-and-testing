const db = require('../../data/dbConfig')



function findBy(filter) { // { username: 'foo' }
  return db('users').where(filter)
} // returns [users]

async function add(user) {
  const [id] = await db('users').insert(user)

  return findById(id)
}


module.exports = {
    add,
    findBy,
  }