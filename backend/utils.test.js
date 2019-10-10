/* eslint-env jest */
const { aes192Crypto, aes192Decrypto } = require('./utils')

describe('utils 工具函数', () => {
  describe('aes192 算法加解密', () => {
    const CRYPTO_KEY = 'foo'
    const iv = Buffer.from('39665eae8f612192c477d745df9fb08b', 'hex')
    const notCryptoed = '2e425e7fb41bb392b0a6c7245673c4cd'
    const cryptoed = '39665eae8f612192c477d745df9fb08b:0e74600c8c060d6bbc4c17370067e36aa774b67e8e428a45fd08fc75e878d93ac2a5951adfdb04b6b10a5454bbb396a9'
    it('aes192Crypto 加密', () => {
      expect(aes192Crypto(notCryptoed, CRYPTO_KEY, iv)).toEqual(cryptoed)
    })
    it('aes192Decrypto 解密', () => {
      expect(aes192Decrypto(cryptoed, CRYPTO_KEY)).toEqual(notCryptoed)
    })
  })
})
