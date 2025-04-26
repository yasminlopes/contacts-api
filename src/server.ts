import fastify from 'fastify'
import { appPlugin } from './app'
import 'dotenv/config'

const httpsApp = fastify()

void httpsApp.register(appPlugin)

void httpsApp
  .listen({
    host: '0.0.0.0',
    port: 3333
  })
  .then(() => {
    console.log('🚀 server is running! ', 3333)
  })
