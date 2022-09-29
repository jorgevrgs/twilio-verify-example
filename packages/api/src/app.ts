import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import {
  awilixPlugin,
  corsPlugin,
  helpersPlugin,
  mongoPlugin,
  sensiblePlugin,
  sessionPlugin,
  twilioPlugin,
  websocketPlugin,
} from './infrastructure/plugins';
import {
  authRoute,
  usersRoute,
  verificationRoute,
  webhooksRoute,
} from './infrastructure/routes';

export type AppOptions = {
  prefix: string;
};

export const options: AppOptions = {
  prefix: '/api',
};

const app: FastifyPluginAsync<AppOptions> = async (
  fastify,
  opts
): Promise<void> => {
  // Place here your custom code!

  fastify
    // Plugins
    .register(
      fp(corsPlugin, {
        name: 'corsPlugin',
      })
    )
    .register(
      fp(helpersPlugin, {
        name: 'helpersPlugin',
      })
    )
    .register(
      fp(mongoPlugin, {
        name: 'mongoPlugin',
      })
    )
    .register(
      fp(sensiblePlugin, {
        name: 'sensiblePlugin',
      })
    )
    .register(fp(sessionPlugin))
    .register(
      fp(twilioPlugin, {
        name: 'twilioPlugin',
      })
    )
    .register(
      fp(websocketPlugin, {
        name: 'websocketPlugin',
      })
    )
    .register(
      fp(awilixPlugin, {
        name: 'awilixPlugin',
        dependencies: [
          'mongoPlugin',
          'twilioPlugin',
          'sensiblePlugin',
          'helpersPlugin',
        ],
        decorators: {
          fastify: ['mongo', 'httpErrors'],
        },
      })
    )
    // Routes
    .register(authRoute, { prefix: '/api/v1/auth' })
    .register(usersRoute, { prefix: '/api/v1/users' })
    .register(verificationRoute, { prefix: '/api/v1/verification' })
    .register(webhooksRoute, { prefix: '/api/v1/webhooks' })
    .ready((err) => {
      if (err) {
        console.log(err);
        throw err;
      }
      fastify.log.info(fastify.printPlugins());
      fastify.log.info(fastify.printRoutes());
    });
};

export default app;
