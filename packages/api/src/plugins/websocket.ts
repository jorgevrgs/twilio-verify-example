import fastifyWebsocket, { WebsocketPluginOptions } from '@fastify/websocket';
import fp from 'fastify-plugin';

/**
 * This plugins adds some utilities to handle http errors
 *
 * @see https://github.com/fastify/fastify-cors
 */
export default fp<WebsocketPluginOptions>(
  async (fastify, opts) => {
    fastify.register(fastifyWebsocket, opts);
  },
  { name: 'websocket' }
);
