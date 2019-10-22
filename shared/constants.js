module.exports.FILE_MAX_SIZE = 10 * 1024 * 1024
/** @type {['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp', 'image/gif']} 允许的文件 mimetype */
module.exports.FILE_TYPE_ALLOWED = ['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp', 'image/gif']
/**
 * @type {{'image/png': '.png', 'image/jpeg': '.jpeg', 'image/svg+xml': '.svg', 'image/webp': '.webp', 'image/gif': '.gif'}} 文件的 mimetype 转 文件后缀
 */
module.exports.MIMETYPE_2_EXT = {
  'image/png': '.png',
  'image/jpeg': '.jpeg',
  'image/svg+xml': '.svg',
  'image/webp': '.webp',
  'image/gif': '.gif'
}
/** @type {10} 允许一次上传的文件的最大数量 */
module.exports.MAX_FILES = 10

/** @type {'i.tuchuang.space'} cdn 的域名 */
module.exports.CDN_DOMAIN = 'i.tuchuang.space'
