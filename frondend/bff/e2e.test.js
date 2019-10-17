/* eslint-env jest */

const fs = require('fs')
const path = require('path')
const supertest = require('supertest')
const app = require('./app')

describe('正确的响应 index.html', () => {
  it('没有 index.html 的时候响应 404', () => {
    app._indexFilePath = path.resolve(__dirname, './test2.html')
    if (fs.existsSync(path.resolve(__dirname, './test2.html'))) {
      fs.unlinkSync(path.resolve(__dirname, './test2.html'))
    }

    return supertest(app)
      .get('/')
      .then(res => {
        expect(res.status).toEqual(404)
      })
  })

  it('响应 index.html', () => {
    app._indexFilePath = path.resolve(__dirname, './test.html')
    return supertest(app)
      .get('/')
      .then((res) => {
        expect(res.status).toEqual(200)
        expect(res.header['content-type']).toEqual('text/html; charset=UTF-8')
        expect(res.text).toEqual(fs.readFileSync(path.resolve(__dirname, './test.html')).toString())
      })
  })
})
