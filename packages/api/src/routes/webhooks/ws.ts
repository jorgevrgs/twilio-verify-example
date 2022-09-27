import { FastifyPluginAsync } from 'fastify';

const wsRoutes: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get('/', { websocket: true }, async (connection, req) => {
    connection.socket.on('message', (message) => {
      connection.socket.send(message);
    });
  });
};

export default wsRoutes;
