module.exports = {
  readJson,
  writeJson,
  filterJson,
  updateJson,
  removeJson
}

const _ = require('lodash')
const fs = require('fs')
const { promisify } = require('util')
const utils = require('./utils')

const readFileAsync = promisify(fs.readFile)
const writeFileAsync = promisify(fs.writeFile)
const existFileSync = fs.existsSync
const getPath = (name) => `./data/${name}.json`

async function writeJson (name, jsonObj) {
  return writeFileAsync(getPath(name), JSON.stringify(jsonObj), 'utf8')
}

async function readJson (name) {
  const path = getPath(name)

  if (!existFileSync(path)) { return null }

  const jsonContent = await readFileAsync(path)

  return JSON.parse(jsonContent.toString())
}

async function filterJson (name, route) {
  const path = utils.getKeyPath(route)

  const cur = await readJson(name)

  if (!cur) { return null }

  return _.at(cur, path)[0]
}

async function updateJson (name, jsonObj) {
  let cur = await readJson(name)

  const ret = _.merge(cur || {}, jsonObj)
  await writeJson(name, ret)

  return ret
}

async function removeJson (name, route) {
  const path = utils.getKeyPath(route)

  const cur = await readJson(name)

  if (!cur || !_.hasIn(cur, path)) { return null }

  const ret = _.omit(cur, path)
  await writeJson(name, ret)

  return ret
}
