/*
|--------------------------------------------------------------------------
| AdonisJS Server
|--------------------------------------------------------------------------
|
| The contents in this file is meant to bootstrap the AdonisJS application
| and start the HTTP server to accept incoming connections
|
*/

require('reflect-metadata')
require('source-map-support').install({ handleUncaughtExceptions: false })

const { Ignitor } = require('@adonisjs/core/build/standalone')
new Ignitor(__dirname)
  .httpServer()
  .start()
  .catch((error) => {
    process.exitCode = 1
    console.error(error)
  })
