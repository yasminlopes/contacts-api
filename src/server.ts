import { app } from './app'
import 'dotenv/config'

void app
  .listen({
    host: '0.0.0.0',
    port: 3333
  })
  .then(() => {
    console.log('🚀 server is running! ', 3333)
  })
