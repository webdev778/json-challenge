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
  console.log(route)
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
  const pJson = utils.buildObj(req.params[0], req.body)

  try{
    const response = await db.updateJson(studentId, {
      [propertyName]: pJson
    })
    res.status(200).json(response)
  }catch(e){
    next(e)
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
    res.json(ret)
  }catch(err){
    next(e)
  }
}


