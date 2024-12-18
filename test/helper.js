import buildApp from '../app.js'
import Fastify from 'fastify'

async function build(t) {
  const fastify = Fastify({
    logger: false
  })
  const app = await buildApp(fastify, {})
  
  t.teardown(async () => {
    await app.close()
  })
  
  return app
}

export { build }