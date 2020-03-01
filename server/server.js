const fs = require('fs'); 
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
let aboutMessage = "Inventory Tracker API v1.0";

const productDB = [
  // {
  //   id: 1, category: 'Jeans', name: 'Zara', price: 250,
  //   image: 'https://www.zara.com',
  // },
  // {
  //   id: 2, category: 'Jackets', name: 'H&M', price: 500,
  //   image: 'https://www.hm.com',
  // },
]; 

const resolvers = {
  Query: {
    about: () => aboutMessage,
    productList,
  },
  Mutation: {
    setAboutMessage,
    productAdd
  },
};

function productAdd(_, { product }) {
  product.id = productDB.length + 1;
  productDB.push(product);
  return product;
} 

function setAboutMessage(_, { message }) {
  return aboutMessage = message;
}

function productList() {
  return productDB;
} 

const server = new ApolloServer({
  typeDefs: fs.readFileSync('./server/schema.graphql', 'utf-8'),
  resolvers,
});
const app = express();
app.use(express.static('public'));
server.applyMiddleware({ app, path: '/graphql' });
app.listen(3000, function () {
  console.log('App started on port 3000');
});