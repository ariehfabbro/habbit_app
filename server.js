const fastify = require('fastify')({
  logger: true
})
const path = require('path')
const fs = require('fs')

const dbPath = path.join(__dirname, 'db.json')

fastify.get('/', (request, reply) => {
  reply.send({ message: 'Welcome to our CRUD API' })
})

fastify.get('/items', (request, reply) => {
  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) return reply.send(err)
    reply.send(JSON.parse(data))
  })
})

fastify.post('/items', (request, reply) => {
  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) return reply.send(err)
    let items = JSON.parse(data)
    if (!Array.isArray(items)) items = [];
    items.push(request.body)
    fs.writeFile(dbPath, JSON.stringify(items), (err) => {
      if (err) return reply.send(err)
      reply.send({ message: 'Item created' })
    })
  })
})

fastify.put('/items/:id', (request, reply) => {
  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) return reply.send(err)
    let items = JSON.parse(data)
    items = items.map(item => {
      if (parseInt(item.id,10) === parseInt(request.params.id,10)) {
        return { ...item.id, ...request.body }
      }
      return item
    })
    fs.writeFile(dbPath, JSON.stringify(items), (err) => {
      if (err) return reply.send(err)
      reply.send({ message: 'Item updated' })
    })
  })
})

fastify.delete('/items/:id', (request, reply) => {
  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) return reply.send(err)
    const items = JSON.parse(data).filter(item => parseInt(item.id,10) !== parseInt(request.params.id,10))
    fs.writeFile(dbPath, JSON.stringify(items), (err) => {
      if (err) return reply.send(err)
      reply.send({ message: 'Item deleted' })
    })
  })
})

const start = async () => {
  try {
    await fastify.listen(3000)
    fastify.log.info(`server listening on ${fastify.server.address().port}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()