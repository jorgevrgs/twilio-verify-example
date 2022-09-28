import fastify from 'fastify';
import fp from 'fastify-plugin';
import app from './app';

const envToLogger = {
  development: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
  production: true,
  test: false,
};

const server = fastify({
  logger:
    process.env.NODE_ENV === 'production' ? true : envToLogger['development'],
});

server.register(fp(app));

server.listen({
  port: process.env.PORT ? Number(process.env.PORT) : 1337,
  host: process.env.HOST || '::',
});
