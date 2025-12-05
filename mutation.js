import express from "express";
import { createHandler } from "graphql-http/lib/use/express";
import { buildSchema } from "graphql";
import { ruruHTML } from "ruru/server";

const schema = buildSchema(`
  type Message {
    id: ID!
    content: String!
    author: String!
    createdAt: String!
  }

  input MessageInput {
    content: String!
    author: String!
  }

  type Query {
    getMessage(id: ID!): Message
    getAllMessages: [Message]
  }

  type Mutation {
    createMessage(input: MessageInput!): Message
    updateMessage(id: ID!, input: MessageInput!): Message
    deleteMessage(id: ID!): String
  }
`);

let messages = [];
let messageIdCounter = 1;

const root = {
  getMessage: ({ id }) => {
    return messages.find(msg => msg.id === id);
  },
  
  getAllMessages: () => {
    return messages;
  },

  createMessage: ({ input }) => {
    const newMessage = {
      id: String(messageIdCounter++),
      content: input.content,
      author: input.author,
      createdAt: new Date().toISOString()
    };
    messages.push(newMessage);
    return newMessage;
  },

  updateMessage: ({ id, input }) => {
    const messageIndex = messages.findIndex(msg => msg.id === id);
    if (messageIndex === -1) {
      throw new Error(`Mesaj bulunamadı: ${id}`);
    }
    
    messages[messageIndex] = {
      ...messages[messageIndex],
      content: input.content,
      author: input.author
    };
    
    return messages[messageIndex];
  },

  deleteMessage: ({ id }) => {
    const messageIndex = messages.findIndex(msg => msg.id === id);
    if (messageIndex === -1) {
      throw new Error(`Mesaj bulunamadı: ${id}`);
    }
    
    messages.splice(messageIndex, 1);
    return `Mesaj silindi: ${id}`;
  }
};

const app = express();

app.get("/", (_req, res) => {
  res.type("html");
  res.end(ruruHTML({ endpoint: "/graphql" }));
});

app.all(
  "/graphql",
  createHandler({
    schema,
    rootValue: root,
  })
);

app.listen(4000, () => {
  console.log("GraphQL: http://localhost:4000");
  console.log("Ruru: http://localhost:4000/");
});