/* eslint-env jest */
const { aes192Crypto, aes192Decrypto } = require('./utils')

describe('utils 工具函数', () => {
  describe('aes192 算法加解密', () => {
    const CRYPTO_KEY = 'foo'
    const notCryptoed = '2e425e7fb41bb392b0a6c7245673c4cd'
    const cryptoed = 'd593492065ff2885cf2d702184954621da99eec3f49fff5a0caa6d661262cf84e9b3638de6c24a222735ed17fa54371c'
    it('aes192Crypto 加密', () => {
      expect(aes192Crypto(notCryptoed, CRYPTO_KEY)).toEqual(cryptoed)
    })
    it('aes192Decrypto 解密', () => {
      expect(aes192Decrypto(cryptoed, CRYPTO_KEY)).toEqual(notCryptoed)
    })
  })
})
