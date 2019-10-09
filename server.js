const express = require('express')
const bodyParser = require('body-parser')

const api = require('./api')
const middleware = require('./middleware')

const PORT = process.env.PORT || 1337

const app = express()

app.use(bodyParser.json())

const asyncHandler = fn => (req, res, next) =>
  Promise
    .resolve(fn(req, res, next))
    .catch(next)

app.get('/health', asyncHandler(api.getHealth))
app.get('/:studentId/:propertyName*', asyncHandler(api.getProperty))
app.put('/:studentId/:propertyName*', asyncHandler(api.updateProperty))
app.delete('/:studentId/:propertyName*', asyncHandler(api.deleteProperty))

app.use(middleware.handleError)
app.use(middleware.notFound)

const server = app.listen(PORT, () =>
  console.log(`Server listening on port ${PORT}`)
)

if (require.main !== module) {
  module.exports = server
}
