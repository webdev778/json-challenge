const tape = require('tape')
const jsonist = require('jsonist')
const fs = require('fs')

const port = (process.env.PORT = process.env.PORT || require('get-port-sync')())
const endpoint = `http://localhost:${port}`

const server = require('./server')
const uuid = new Date().getTime()

tape('health', async function (t) {
  const url = `${endpoint}/health`
  jsonist.get(url, (err, body) => {
    if (err) t.error(err)
    t.ok(body.success, 'should have successful healthcheck')
    t.end()
  })
})

tape('create', async function (t) {
  const url = `${endpoint}/${uuid}/property1/property2`
  jsonist.put(url, { 'score': 100, 'type': 'test' }, (err, body) => {
    if (err) t.error(err)
    t.deepEqual(body,
      {
        property1: {
          property2:
          {
            'score': 100,
            'type': 'test'
          }
        }
      })
    t.end()
  })
})

tape('update-existing-value', async function (t) {
  const url = `${endpoint}/${uuid}/property1/property2`
  jsonist.put(url, { 'score': 50, 'type': 'test' }, (err, body) => {
    if (err) t.error(err)
    t.deepEqual(body,
      {
        property1: {
          property2:
          {
            'score': 50,
            'type': 'test'
          }
        }
      })
    t.end()
  })
})


tape('update-add-new-property(leaf)', async function (t) {
  const url = `${endpoint}/${uuid}/property1/property2`
  jsonist.put(url, { 'newProperty': 'test' }, (err, body) => {
    if (err) t.error(err)
    t.deepEqual(body,
      {
        property1: {
          property2:
          {
            'score': 50,
            'type': 'test',
            'newProperty': 'test'
          }
        }
      })
    t.end()
  })
})

tape('update-add-new-property(node)', async function (t) {
  const url = `${endpoint}/${uuid}/property1/property3`
  jsonist.put(url, { 'key': 'value' }, (err, body) => {
    if (err) t.error(err)
    t.deepEqual(body,
      {
        property1: {
          property2:
          {
            'score': 50,
            'type': 'test',
            'newProperty': 'test'
          },
          property3:
          {
            'key': 'value'
          }
        }
      })
    t.end()
  })
})

tape('get-success', async function (t) {
  const url = `${endpoint}/${uuid}/property1/property2`
  jsonist.get(url, { 'key': 'value' }, (err, body) => {
    if (err) t.error(err)
    t.deepEqual(body,
      {
        score: 50,
        type: 'test',
        newProperty: 'test'
      })
    t.end()
  })
})

tape('get-fail', async function (t) {
  const url = `${endpoint}/${uuid}/property1/property4`
  jsonist.get(url, { 'key': 'value' }, (err, body, resp) => {
    if (err) t.error(err)
    t.ok(resp.statusCode === 404, 'should be not found 404 response')
    t.end()
  })
})

tape('delete-ok', async function (t) {
  const url = `${endpoint}/${uuid}/property1/property2`
  jsonist.delete(url, (err, body) => {
    if (err) t.error(err)
    t.deepEqual(body, {"property1":{"property3":{"key":"value"}}})
    t.end()
  })
})

tape('delete-fail', async function (t) {
  const url = `${endpoint}/${uuid}/property1/property4`
  jsonist.delete(url, (err, body, resp) => {
    if (err) t.error(err)
    t.ok(resp.statusCode === 404, 'should be not found 404 response')
    t.end()
  })
})


tape('cleanup', function (t) {
  server.close()

  // remove temp files for test
  // fs.readdir('./data/', (error, files) => {
  //   if (error) t.error(err)

  //   files.filter(name => /\d+\.json$/.test(name)).forEach(fs.unlink);
  // });
  t.end()
})
