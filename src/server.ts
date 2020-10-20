import { ApolloServer } from 'apollo-server-express';
import express, { Application } from 'express';
import { createServer } from 'http';
import { graphqlUploadExpress } from 'graphql-upload';
import { createContext } from './context';

// schema
import schema from './schema';

const app: Application = express();
const PORT: number = 9090;

app.use(graphqlUploadExpress({maxFieldSize: 1000000000, maxFiles: 3 }))

const server = createServer(app);
const apollo = new ApolloServer({
  schema,
  context: createContext,
  uploads: false
})


apollo.applyMiddleware({ app });

server.listen({
  port: PORT
}, () => {
  console.log(`[SERVER] live at http://localhost:${PORT}${apollo.graphqlPath} `);
})