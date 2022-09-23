import { join } from 'path';
import AutoLoad, { AutoloadPluginOptions } from '@fastify/autoload';
import { FastifyPluginAsync } from 'fastify';

export type AppOptions = {
  prefix: string;
} & Partial<AutoloadPluginOptions>;

export const options: AppOptions = {
  prefix: '/api',
};

const app: FastifyPluginAsync<AppOptions> = async (
  fastify,
  opts
): Promise<void> => {
  // Place here your custom code!
  console.log({ opts });

  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  void fastify
    .register(AutoLoad, {
      dir: join(__dirname, 'plugins'),
      options: opts,
    })
    .ready((err) => {
      if (err) throw err;
      fastify.log.info(fastify.printPlugins());
    });

  // This loads all plugins defined in routes
  // define your routes in one of these
  void fastify
    .register(AutoLoad, {
      dir: join(__dirname, 'routes'),
      options: { opts, prefix: '/api/v1' },
    })
    .ready((err) => {
      if (err) throw err;
      fastify.log.info(fastify.printRoutes());
    });
};

export default app;
