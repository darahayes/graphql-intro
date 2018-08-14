const channels = [
  {
    id: 1,
    name: 'soccer',
  },
  {
    id: 2,
    name: 'baseball',
  }
]

const messages = [
  {
    id: 1,
    channelId: 1,
    text: 'soccer is awesome!',
    userId: 1
  },
  {
    id: 2,
    channelId: 1,
    text: 'did you see that ludicrous display last night?',
    userId: 2
  },
  {
    id: 3,
    channelId: 2,
    text: 'baseball is awesome',
    userId: 2
  }
]

const users = [
  {
    id: 1,
    name: "Dara",
    address: "Waterford"
  },
  {
    id: 2,
    name: "Peter",
    address: "Germany"
  }
]

module.exports = {
  messages,
  channels,
  users
}