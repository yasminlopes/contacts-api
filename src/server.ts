import fs from 'fs'
import path from 'path'
import fastify from 'fastify'
import { appPlugin } from './app'
import 'dotenv/config'

const httpsApp = fastify({
  https: {
    key: fs.readFileSync(path.join(__dirname, 'selfsigned.key')),
    cert: fs.readFileSync(path.join(__dirname, 'selfsigned.crt'))
  }
})

void httpsApp.register(appPlugin)

void httpsApp
  .listen({
    host: '0.0.0.0',
    port: 3333
  })
  .then(() => {
    console.log('🚀 server is running! ', 3333)
  })
