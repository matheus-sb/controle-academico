const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const { apolloExpress, graphiqlExpress } = require('apollo-server');
const { makeExecutableSchema } = require('graphql-tools');

const { server } = require('./config');
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');
const { Users, Alunos } = require('./models');

const { getTokenFromRequest } = require('./utils/auth');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

const schema = makeExecutableSchema({ typeDefs, resolvers });

if(process.env.NODE_ENV === 'development') {

  var corsOptions = { origin: 'http://localhost:8080' };

  app.use(cors(corsOptions));
}

app.use('/graphql', bodyParser.json(), apolloExpress(request => ({
  schema,
  context: { 
    token: getTokenFromRequest(request),
    Users: new Users(),
    Alunos: new Alunos()
  }
})));
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

app.listen(server.port, () => console.log(`Now browse to ${server.host}:${server.port}/graphiql`));

module.exports = app;
