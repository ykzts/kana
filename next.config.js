const { URL } = require('url')
const withTypescript = require('@zeit/next-typescript')
const WorkerPlugin = require('worker-plugin')

global.URL = URL

module.exports = withTypescript({
  env: {
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY
  },
  webpack(config) {
    config.plugins.push(new WorkerPlugin())

    return config
  }
})
