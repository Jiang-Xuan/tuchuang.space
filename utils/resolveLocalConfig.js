module.exports = (localConfig) => {
  if (Object.prototype.toString.call(localConfig) !== '[object Object]') {
    throw new TypeError('localConfig 必须是 object')
  }

  const { path } = localConfig

  if (typeof path !== 'string') {
    throw new TypeError('path 参数必须是 string')
  }

  return Object.freeze({
    path
  })
}
