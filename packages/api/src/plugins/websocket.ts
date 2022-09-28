import fastifyWebsocket, { WebsocketPluginOptions } from '@fastify/websocket';
import { FastifyPluginAsync } from 'fastify';

export const websocketPlugin: FastifyPluginAsync = async (
  fastify,
  opts: WebsocketPluginOptions
) => {
  fastify.register(fastifyWebsocket, opts);
};
