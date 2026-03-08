import fs from 'node:fs'
import path from 'node:path'
import Fastify from 'fastify'
import middie from '@fastify/middie'
import sirv from 'sirv'
import { createServer as createViteServer } from 'vite'

const isDev = process.env.NODE_ENV === 'development'

async function createServer() {
  const fastify = Fastify({
    logger: true
  })
  await fastify.register(middie)

  let vite: any
  if (isDev) {
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom'
    })

    fastify.use(vite.middlewares)
  } else {
    // https://github.com/bluwy/create-vite-extra/blob/master/template-ssr-react/server.js
    fastify.use(sirv(path.resolve('dist/client'), {
      extensions: ['html']
    }))
  }


  fastify.use('*all', async (req, res, next) => {
    const url = req.originalUrl

    if (isDev) {
      try {
        const template = fs.readFileSync(
          path.resolve('index.html'),
          'utf-8',
        )

        const html = await vite.transformIndexHtml(url, template)

        res.statusCode = 200
        res.setHeader('Content-Type', 'text/html')
        res.end(html)
      } catch (e: any) {
        vite.ssrFixStacktrace(e)
        next(e)
      }
    } else {
      try {
        const template = fs.readFileSync(
          path.resolve('dist/client/index.html'),
          'utf-8',
        )

        res.statusCode = 200
        res.setHeader('Content-Type', 'text/html')
        res.end(template)
      } catch (e: any) {
        next(e)
      }
    }
  })

  fastify.listen({ port: 5173 })
}

export {
  createServer
}