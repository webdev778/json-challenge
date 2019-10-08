module.exports = {
  getHealth,
  updateProperty,
  getProperty,
  deleteProperty
}

const db = require('./db')
const utils = require('./utils')

async function getHealth (req, res, next) {
  res.json({ success: true })
}

async function getProperty (req, res, next) {
  console.log('getProperty')
  const { studentId, propertyName } = req.params;
  const route = propertyName+req.params[0]

  try{
    const ret = await db.filterJson(studentId, route)
    if(!ret) {
      return res.status(404).send(null)
    }
    res.json(ret)
  }catch(err){
    next(err)
  }
}

async function updateProperty (req, res, next) {
  console.log('updateProperty')
  const { studentId, propertyName } = req.params;
  const route = propertyName + req.params[0]
  const pJson = utils.buildObj(route, req.body)

  try{
    const response = await db.updateJson(studentId, pJson)
    res.json(response)
  }catch(err){
    next(err)
  }
}

async function deleteProperty (req, res, next) {
  console.log('deleteProperty')

  const { studentId, propertyName } = req.params;
  try{
    const route = propertyName + req.params[0]
    const ret = await db.removeJson(studentId, route)
    if(!ret){
      return res.status(404).send(null)
    }
    console.log('Deleted successfully')
    res.json(ret)
  }catch(err){
    next(err)
  }
}


