const Router = require('koa-router')
const jsonwebtoken = require('jsonwebtoken')

const router = new Router({ prefix: '/users' })
const {
  find,
  findById,
  create,
  update,
  deleteById,
  login
} = require('../controllers/users')

const auth = async (ctx, next) => {
  const { authorization = '' } = ctx.request.header
  const token = authorization.replace('Bearer ', '')
  try {
    const user = jsonwebtoken.verify(token, secret)
    ctx.state.user = user
  } catch (err) {
    ctx.throw(401, err.message)
  }
  await next()
}

router.get('/', find)

router.get('/:id', findById)

router.patch('/:id', update)

router.delete('/:id', deleteById)

router.post('/', create)

router.post('/login', login)

module.exports = router
