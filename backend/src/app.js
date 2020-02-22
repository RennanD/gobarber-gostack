import 'dotenv/config';
import express from 'express';
import { resolve } from 'path';
import Youch from 'youch';
import cors from 'cors';
import * as Sentry from '@sentry/node';
import 'express-async-errors';

import routes from './routes';

import sentryConfig from './config/sentry';

import './database';

class App {
  constructor() {
    this.server = express();
    Sentry.init(sentryConfig);
    this.middlewares();
    this.routes();
    this.execptionHandler();
  }

  middlewares() {
    this.server.use(Sentry.Handlers.requestHandler());

    this.server.use(cors());
    this.server.use(express.json());
    this.server.use(
      '/files',
      express.static(resolve(__dirname, '..', 'tmp', 'uploads'))
    );
  }

  routes() {
    this.server.use(routes);
    this.server.use(Sentry.Handlers.errorHandler());
  }

  execptionHandler() {
    this.server.use(async (err, req, res, next) => {
      if (process.env.NODE_ENV === 'development') {
        const errors = await new Youch(err, req).toJSON();

        res.status(500).json(errors);
      }
      return res.status(500).json({ error: 'Internal serve error' });
    });
  }
}

export default new App().server;
