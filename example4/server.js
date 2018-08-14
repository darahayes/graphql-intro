const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const http = require('http')

const { graphqlExpress, graphiqlExpress } = require('apollo-server-express')

// subscriptions stuff
const { subscribe, execute } = require('graphql')
const { SubscriptionServer } = require('subscriptions-transport-ws')

const schema = require('./schema')

const PORT = 7700
const app = express()
const server = http.createServer(app)

app.use('*', cors())

app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));

app.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
  subscriptionsEndpoint: `ws://localhost:${PORT}/subscriptions`
}))

server.listen(PORT, () => {
  console.log(`GraphiQL can be accessed on http://localhost:${PORT}/graphiql`)
  newSubscriptionServer(server, schema)
})

function newSubscriptionServer (server, schema) {
  /* eslint-disable no-new */
  return new SubscriptionServer({
    execute: execute,
    subscribe: subscribe,
    schema
  }, {
    server: server,
    path: '/subscriptions'
  })
}