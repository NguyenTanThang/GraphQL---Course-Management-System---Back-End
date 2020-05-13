const { ApolloServer, gql } = require('apollo-server');
const typeDefs = require("./schema/schema");
const resolvers = require("./resolver/resolver");
require("dotenv").config({path:"./config/config.env"});
require("./config/db")();

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});