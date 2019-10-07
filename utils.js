module.exports = {
  buildObj,
  getKeyPath
}

const _trimProps = (props) => {
  if (!props.length) return
  if (props[0] === '') props.shift()
  if (props.length > 0 && props[props.length - 1] === '') props.pop()
}

const _generateJsonWithKeys = (keys, jsonObj = {}) => {
  if (keys.length === 0) return _body
  const key = keys[0];
  keys.shift()
  jsonObj[key] = _generateJsonWithKeys(keys, jsonObj[key])
  return jsonObj
}

let _body = {}
function buildObj (params, body) {
  let result = null
  _body = body

  if (params) {
    const props = params.split("/")
    _trimProps(props)
    result = _generateJsonWithKeys(props, {})
    console.log(result)
  }

  return result
}

function getKeyPath ( params ) {
  let result = null

  if (params) {
    const props = params.split("/")
    _trimProps(props)
    result = props.join('.')
    console.log(result)
  }

  return result
}