import { FastifyPluginAsync } from 'fastify';

export const webhooksRoute: FastifyPluginAsync = async (
  fastify,
  opts
): Promise<void> => {
  fastify.get('/', { websocket: true }, async (connection, req) => {
    connection.socket.on('message', (message) => {
      connection.socket.send(message);
    });
  });
};
