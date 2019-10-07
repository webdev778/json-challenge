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

async function writeJson(name, jsonObj) {

  var jsonContent = JSON.stringify(jsonObj)
  console.log(jsonContent)
  try {
    await writeFileAsync(getPath(name), jsonContent, 'utf8')
    console.log("JSON file has been saved")
  } catch (err) {
    console.log("An error occured while writing JSON Object to File.");
    throw (err)
  }
}

async function readJson(name) {
  const path = getPath(name)
  try {
    if(!existFileSync(path))
      return null

    const jsonContent = await readFileAsync(path)
    console.log("JSON file opened successfully")
    const jsonObj = JSON.parse(jsonContent.toString())
    return jsonObj

    //return require(path)
  } catch (err) {
    console.log("An error occured while reading JSON Object to File.");
    throw (err)
  }
}

async function filterJson(name, route) {
  console.log('filterJson')
  const path = utils.getKeyPath(route)

  try{
    let cur =  await readJson(name)
    if(!cur) return null
    let ret = _.at(cur, path)
    console.log(ret)
    return ret[0]
  }catch(err) {
    console.log("An error occured while filtering JSON File.");
  }
}

async function updateJson(name, jsonObj) {
  console.log('updateJson')

  try{
    let cur =  await readJson(name)
    if(!cur) cur = {}
    // let newOne = {...cur, ...jsonObj}
    let newOne = _.merge(cur, jsonObj)
    await writeJson(name, newOne)
    return newOne
  }catch(err) {
    console.log("An error occured while updating JSON File.");
  }
}

async function removeJson(name, route) {
  const path = utils.getKeyPath(route)
  try{
    let cur =  await readJson(name)

    if(!cur || !_.hasIn(cur, path))
      return null

    _.omit(cur, path)

    await writeJson(name, cur)
    return cur
  }catch(err) {
    console.log("An error occured while removing objects in JSON File.");
  }
}
