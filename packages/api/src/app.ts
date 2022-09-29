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
  cancelVerifyRoute,
  changePasswordRoute,
  checkVerifyRoute,
  createVerifyRoute,
  loginRoute,
  logoutRoute,
  meRoute,
  registerRoute,
  usernameRoute,
  webhookRoute,
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
    .register(fp(awilixPlugin))
    .register(fp(corsPlugin))
    .register(fp(helpersPlugin))
    .register(fp(mongoPlugin))
    .register(fp(sensiblePlugin))
    .register(fp(sessionPlugin))
    .register(fp(twilioPlugin))
    .register(fp(websocketPlugin))
    // Routes
    .register(loginRoute, { prefix: '/api/v1/auth' })
    .register(logoutRoute, { prefix: '/api/v1/auth' })
    .register(registerRoute, { prefix: '/api/v1/auth' })
    .register(changePasswordRoute, { prefix: '/api/v1/users' })
    .register(meRoute, { prefix: '/api/v1/users' })
    .register(usernameRoute, { prefix: '/api/v1/users' })
    .register(cancelVerifyRoute, { prefix: '/api/v1/verification' })
    .register(createVerifyRoute, { prefix: '/api/v1/verification' })
    .register(checkVerifyRoute, { prefix: '/api/v1/verification' })
    .register(webhookRoute, { prefix: '/api/v1/webhooks' })
    .ready((err) => {
      if (err) throw err;
      fastify.log.info(fastify.printPlugins());
      fastify.log.info(fastify.printRoutes());
    });
};

export default app;
