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
import * as dotenv from 'dotenv';
dotenv.config();

const main = async () => {
  if (!process.env.APP_PORT) {
    throw new Error('APP_PORT missing');
  }

  if (!process.env.SESSION_NAME) {
    throw new Error('SESSION_NAME missing');
  }

  if (!process.env.SESSION_SECRET) {
    throw new Error('SESSION_SECRET missing');
  }

  if (!process.env.REDIS_HOST) {
    throw new Error('REDIS_HOST missing');
  }

  if (!process.env.REDIS_PORT) {
    throw new Error('REDIS_PORT missing');
  }

  if (!process.env.REDIS_PASSWORD) {
    throw new Error('REDIS_PASSWORD missing');
  }

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
      name: process.env.SESSION_NAME,
      secret: process.env.SESSION_SECRET,
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
    introspection: true,
    playground: true,
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

  app.listen(parseInt(process.env.APP_PORT), () => {
    console.log(`Server is listening on port ${process.env.APP_PORT}`);
    if (__prod__) {
      console.log('GraphQL Service is running in production ...');
    }
  });
};

main().catch((err) => console.log(err));
