const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const http = require('http')

const { graphqlExpress, graphiqlExpress } = require('apollo-server-express')

const schema = require('./schema')

const PORT = 7700
const app = express()
const server = http.createServer(app)

app.use('*', cors())

app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));

app.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql'
}))

server.listen(PORT, () => {
  console.log(`GraphiQL can be accessed on http://localhost:${PORT}/graphiql`)
})