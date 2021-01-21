require('dotenv-defaults').config();
const { ApolloServer, PubSub } = require('apollo-server');
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const port = process.env.PORT || 80;

const wakeUpDyno = require('./wakeUpDyno')
const DYNO_URL = "https://farm-by-rdogs.herokuapp.com/";
app.listen(port, () => {
    wakeUpDyno(DYNO_URL);
})

const typeDefs = require('./graphql/typeDefs.js');
const resolvers = require('./graphql/resolvers')

const pubsub = new PubSub();
const PORT = process.env.PORT || 5000

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({req, res}) => ({req, res, pubsub}),
    cors: {
        origin: '*',
        credentials: true
    }
});

if(!process.env.MONGO_URL)
{
    console.error('Missing MONGO_URL');
    process.exit(1);
}

mongoose.connect(process.env.MONGO_URL, { 
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(() => {
    console.log('MongoDB Connected');
    return server.listen({ port: PORT });
}).then((res) => {
    console.log(`Server running at ${res.url}`);  
});