const crypto = require('crypto')

/**
 * 采用 aes92 算法加密
 * @param {string} string 要加密的字符串
 * @param {string} key 秘钥
 * @returns {string}
 */
const aes192Crypto = (string, key) => {
  const cipher = crypto.createCipher('aes192', key)
  let result = cipher.update(string, 'utf8', 'hex')
  result += cipher.final('hex')

  return result
}

/**
 * 采用 aes192 算法解密
 * @param {string} string 要解密的字符串
 * @param {string} key 秘钥
 * @returns {string}
 */
const aes192Decrypto = (string, key) => {
  const decipher = crypto.createDecipher('aes192', key)
  let result = decipher.update(string, 'hex', 'utf8')
  result += decipher.final('utf8')

  return result
}

module.exports.aes192Crypto = aes192Crypto
module.exports.aes192Decrypto = aes192Decrypto
