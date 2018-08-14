const { makeExecutableSchema } = require('graphql-tools')

const { PubSub, withFilter } = require('graphql-subscriptions')
const pubsub = new PubSub()

const { messages, channels, users } = require('./db')

let messagesNextId = messages.length + 1
let channelsNextId = channels.length + 1
let usersNextId = users.length + 1

const typeDefs = `
    type Channel {
      id: ID!                # "!" denotes a required field
      name: String
      messages: [Message]!
    }

    type Message {
      id: ID!
      text: String
      sender: User!
    }

    type User {
      id: ID!
      name: String!
      address: String!
      messages: [Message]!
    }
    
    # This type specifies the entry points into our API. 
    type Query {
      channels: [Channel]    # "[]" means this is a list of channels
      channel(id: ID!): Channel
      user(id: ID!): User
    }

    # The mutation root type, used to define all mutations.
    type Mutation {
      # A mutation to add a new channel to the list of channels
      addChannel(name: String!): Channel
      addMessage(text: String! channelId: ID! userId: ID!): Message
      addUser(name: String! address: String!): User
    }

    type Subscription {
      messageAdded: Message
      messageAddedToChannel(channelId: ID!): Message
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
    user: (root, args, context, info) => {
      return users.find(user => user.id == args.id)
    }
  },
  Mutation: {
    addChannel: (root, args, context, info) => {
      const newChannel = { id: channelsNextId++, name: args.name };
      channels.push(newChannel);
      return newChannel;
    },
    addMessage: (root, args, context, info) => {
      const newMessage = { id: messagesNextId++, text: args.text, channelId: args.channelId, userId: args.userId }
      messages.push(newMessage)
      console.log('publishing to topic', newMessage)
      pubsub.publish('newMessageCreated', { messageAdded: newMessage, messageAddedToChannel: newMessage })
      return newMessage
    },
    addUser: (root, args, context, info) => {
      const newUser = {
        id: usersNextId++,
        name: args.name,
        address: args.address
      }
      users.push(newUser)
      return newUser
    }
  },
  Channel: {
    messages: (root, args, context, info) => {
      const result = messages.filter((message => message.channelId == root.id))
      return result
    }
  },
  User: {
    messages: (root, args, context, info) => {
      const result = messages.filter(message => message.userId == root.id)
      return result
    }
  },
  Message: {
    sender: (root, args, context, info) => {
      const sender = users.find(user => user.id == root.userId)
      return sender
    }
  },
  Subscription: {
    messageAdded: {
      subscribe: () => {
        return pubsub.asyncIterator('newMessageCreated')
      }
    },
    messageAddedToChannel: {
      subscribe: withFilter(
        () => pubsub.asyncIterator('newMessageCreated'),
        (payload, variables) => {
          return payload.messageAddedToChannel.channelId == variables.channelId
        }
      )
    }
  }
}


const schema = makeExecutableSchema({ typeDefs, resolvers });

module.exports = schema