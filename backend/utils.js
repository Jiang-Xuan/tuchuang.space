const crypto = require('crypto')

const IV_LENGTH = 16

/**
 * 采用 aes92 算法加密
 * @param {string} string 要加密的字符串
 * @param {string} key 秘钥
 * @param {string} _iv **只提供给测试用例使用, 🈲禁止用于其他目的**
 * @returns {string}
 */
const aes192Crypto = (string, key, _iv) => {
  const iv = _iv || crypto.randomBytes(IV_LENGTH)
  const expandedKey = crypto.pbkdf2Sync(key, '', 1000, 24, 'sha512')
  const cipher = crypto.createCipheriv('aes192', expandedKey, iv)
  let result = cipher.update(string, 'utf8', 'hex')
  result += cipher.final('hex')

  return `${iv.toString('hex')}:${result}`
}

/**
 * 采用 aes192 算法解密
 * @param {string} string 要解密的字符串
 * @param {string} key 秘钥
 * @returns {string}
 */
const aes192Decrypto = (string, key) => {
  const [iv, noIvString] = string.split(':')
  const expandedKey = crypto.pbkdf2Sync(key, '', 1000, 24, 'sha512')
  const decipher = crypto.createDecipheriv('aes192', expandedKey, Buffer.from(iv, 'hex'))
  let result = decipher.update(noIvString, 'hex', 'utf8')
  result += decipher.final('utf8')

  return result
}

module.exports.aes192Crypto = aes192Crypto
module.exports.aes192Decrypto = aes192Decrypto
