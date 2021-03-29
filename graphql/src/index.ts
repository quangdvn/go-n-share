import { CurrentUserMiddleware } from '@quangdvnnnn/go-n-share';
import { ApolloServer } from 'apollo-server-express';
import connectRedis from 'connect-redis';
import cors from 'cors';
import express from 'express';
import session from 'express-session';
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import { __prod__ } from './constants';
import { DriverService } from './datasources/driver.service';
import { StaffService } from './datasources/staff.service';
import { GraphContext } from './graphContext';
import { RedisClient } from './redis';
import { DriverResolver } from './resolvers/driver';
import { HelloResolver } from './resolvers/hello';
import { StaffResolver } from './resolvers/staff';

const main = async () => {
  const app = express();
  app.set('trust proxy', 1);
  app.use(
    cors({
      origin: '*',
      credentials: true,
    })
  );

  const RedisStore = connectRedis(session);
  RedisClient.on('error', function (err) {
    console.error('Could not establish a connection with redis. ' + err);
  });
  RedisClient.on('connect', function () {
    console.log('Connected to redis successfully ...');
  });

  app.use(
    session({
      store: new RedisStore({
        client: RedisClient,
      }),
      name: 'qid',
      secret: 'quangdvn',
      resave: false,
      saveUninitialized: false,
      cookie: {
        signed: false,
        httpOnly: true,
        secure: __prod__, //* Over HTTPS
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, //* 10 years,
        sameSite: 'lax', //* csrf,
      },
    })
  );

  app.use(CurrentUserMiddleware);

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, DriverResolver, StaffResolver],
      validate: false,
    }),
    dataSources: () => {
      return {
        driverService: new DriverService(),
        staffService: new StaffService(),
      };
    },
    context: ({ req, res }): GraphContext => ({
      req,
      res,
    }),
  });

  apolloServer.applyMiddleware({ app, cors: true });

  app.listen(4000, () => {
    console.log('Server is listening on port 4000');
  });
};

main().catch((err) => console.log(err));
