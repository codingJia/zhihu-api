const jsonwebtoken = require('jsonwebtoken')
const User = require('../models/users')
const { secret } = require('../config')

class UserCtl {
  async find(ctx) {
    ctx.body = await User.find()
  }
  async findById(ctx) {
    const user = await User.findById(ctx.params.id)
    if (!user) {
      ctx.throw(404, '用户不存在')
    }
    ctx.body = user
  }
  async create(ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: true },
      password: { type: 'string', required: true }
    })
    const { name } = ctx.request.body
    const repeatedName = User.findOne({ name })
    if (repeatedName) {
      ctx.throw(409, '用户已经被占用')
    }
    const user = await new User(ctx.request.body).save()
    ctx.body = user
  }
  async deleteById(ctx) {
    await User.findByIdAndRemove(ctx.params.id)
    ctx.status = 204
  }
  async update(ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: false },
      password: { type: 'string', required: false }
    })
    const user = await User.findByIdAndUpdate(ctx.params.id, ctx.request.body)
    if (!user) {
      ctx.throw(404)
    }
    ctx.body = user
  }
  async login(ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: true },
      password: { type: 'string', required: true }
    })
    const user = await User.findOne(ctx.request.body)
    if (!user) {
      ctx.throw(401, '用户或密码错误')
    }
    const { _id, name } = user
    const token = jsonwebtoken.sign({ _id, name }, secret, { expiresIn: '1d' })
    ctx.body = { token }
  }
}

module.exports = new UserCtl()
