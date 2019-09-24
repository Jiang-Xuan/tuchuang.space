/**
 * @constant
 */
const errors = {
  /** @type {'Mimetype not support'} */
  MIMETYPE_NOT_SUPPORT: 'Mimetype not support'
}

class TuChuangSpaceError extends Error {
  /**
   * @param {'MIMETYPE_NOT_SUPPORT'} code 错误代码
   */
  constructor (code) {
    super()
    this.code = code
  }
}

TuChuangSpaceError.errors = errors

module.exports.TuChuangSpaceError = TuChuangSpaceError
