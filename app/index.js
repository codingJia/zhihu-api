const Koa = require('koa')
const app = new Koa()
const bodyparser = require('koa-bodyparser')
const parameter = require('koa-parameter')
const error = require('koa-json-error')
const routing = require('./routes')
const mongoose = require('mongoose')
const { connectionStr } = require('./config')

mongoose.connect(
  connectionStr,
  { useUnifiedTopology: true, useNewUrlParser: true },
  () => console.log('连接成功了')
)
mongoose.connection.on('error', () => console.log('连接失败'))

app.use(
  error({
    postFormat: (e, { stack, ...rest }) =>
      process.env.NODE_ENV === 'production' ? rest : { stack, ...rest },
  })
)
app.use(bodyparser())
app.use(parameter(app))
routing(app)

app.listen(3000, (ctx) => {
  console.log('程序跑起来了')
})
