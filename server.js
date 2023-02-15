import fastify from 'fastify';
import fs from'fs';

const api = fastify({ logger: true });
const dbPath = './database/db.json';

api.get('/', (request, reply) => {
  reply.send({ message: 'Welcome to our CRUD API' })
})

api.get('/items', (request, reply) => {
  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) return reply.send(err)
    reply.send(JSON.parse(data))
  })
})

api.post('/items', (request, reply) => {
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

api.put('/items/:id', (request, reply) => {
  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) return reply.send(err)
    let items = JSON.parse(data)
    items = items.map(item => {
      if (parseInt(item.id, 10) === parseInt(request.params.id, 10)) {
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

api.delete('/items/:id', (request, reply) => {
  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) return reply.send(err)
    const items = JSON.parse(data).filter(item => parseInt(item.id, 10) !== parseInt(request.params.id, 10))
    fs.writeFile(dbPath, JSON.stringify(items), (err) => {
      if (err) return reply.send(err)
      reply.send({ message: 'Item deleted' })
    })
  })
})

const start = async () => {
  try {
    await api.listen(3000)
    api.log.info(`server listening on ${api.server.address().port}`)
  } catch (err) {
    api.log.error(err)
    process.exit(1)
  }
}

start()
