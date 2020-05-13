const { ApolloServer, gql } = require('apollo-server');
const typeDefs = require("./schema/schema");
const resolvers = require("./resolver/resolver");
require("dotenv").config({path:"./config/config.env"});
require("./config/db")();

const server = new ApolloServer({ typeDefs, resolvers, engine: {
  apiKey: "service:cms-graph:L9yUKrF2CSzILFpz1n7pyg",
} });

server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});