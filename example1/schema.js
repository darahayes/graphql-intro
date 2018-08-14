const { makeExecutableSchema } = require('graphql-tools')

const { channels } = require('./db')

let channelsNextId = channels.length + 1

const typeDefs = `
    type Channel {
      id: ID!                # "!" denotes a required field
      name: String
    }
    
    # This type specifies the entry points into our API. 
    type Query {
      channels: [Channel]    # "[]" means this is a list of channels
      channel(id: ID!): Channel
    }

    # The mutation root type, used to define all mutations.
    type Mutation {
      # A mutation to add a new channel to the list of channels
      addChannel(name: String!): Channel
    }
    `

const resolvers = {
  Query: {
    channels: () => {
      return channels;
    },
    channel: (root, args, context, info) => {
      return channels.find(channel => channel.id == args.id);
    },
  },
  Mutation: {
    addChannel: (root, args, context, info) => {
      const newChannel = { id: channelsNextId++, name: args.name };
      channels.push(newChannel);
      return newChannel;
    }
  }
}

const schema = makeExecutableSchema({ typeDefs, resolvers });

module.exports = schema