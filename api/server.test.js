// Write your tests here
const request = require('supertest')
const server = require('./server.js')
const db = require('../data/dbConfig')


beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})
beforeEach(async () => {
  await db("users").truncate()
})
afterAll(async () => {
  await db.destroy()
})

it('correct env', () => {
  expect(process.env.NODE_ENV).toBe('testing')
})


describe('POST /register', () => {
  test('returns with status 201 Created', async () => {
    const res = await request(server)
      .post('/register')
      .send({username: 'Jude', password: '1234'})
    expect(res.status).toBe(201)
  })
})

describe('POST /register', () => {
  test('incomplete registration returns status: 401 ', async () => {
    const res = await request(server)
      .post('/register')
      .send({username: 'Jude', password: ''})
    expect(res.status).toBe(401)
  })
})

  describe('POST /login', () => {
    test('successfully logs in user', async () => {
      const res = await request(server)
        .post('/login')
        .send({ name: '', password: '1234' })
      expect(res.status).toBe(200)
    })
  })

  describe('POST /login', () => {
    test('failed login', async () => {
      const res = await request(server)
        .post('/login')
        .send({ name: '', password: '' })
      expect(res.status).toBe(404)
    })
  })


