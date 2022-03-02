//'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
     NODE_ENV: '"development"',
     // baseUrl: '"http://dev.schoolapi.anvdo.com/manage/server/v1"',
     // baseUrl: '"http://192.168.0.99:8001/manage/server"'
     baseUrl: '"http://127.0.0.1:8001/manage/server"'
})
