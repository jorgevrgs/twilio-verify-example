import sensible, { SensibleOptions } from '@fastify/sensible';
import { FastifyPluginAsync } from 'fastify';

export const sensiblePlugin: FastifyPluginAsync = async (
  fastify,
  opts: SensibleOptions
) => {
  fastify.register(sensible, opts);
};
