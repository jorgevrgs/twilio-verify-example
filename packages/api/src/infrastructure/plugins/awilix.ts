import { FastifyAwilixOptions, fastifyAwilixPlugin } from '@fastify/awilix';
import { FastifyMongoObject } from '@fastify/mongodb';
import { HttpErrors } from '@fastify/sensible/lib/httpError';
import { asClass, asFunction } from 'awilix';
import { FastifyPluginAsync } from 'fastify';
import { Twilio } from 'twilio';
import {
  ChallengeManager,
  DeviceManager,
  VerifyManager,
} from '../../application/managers';
import {
  AuthService,
  UsersService,
  VerificationService,
} from '../../application/services';
import {
  AuthController,
  UsersController,
  VerificationController,
} from '../controllers';

declare module '@fastify/awilix' {
  interface Cradle {
    authController: AuthController;
    authService: AuthService;
    challengeManager: ChallengeManager;
    dbClient: FastifyMongoObject['db'];
    deviceManager: DeviceManager;
    httpErrorsService: HttpErrors;
    twilioClient: Twilio;
    usersController: UsersController;
    usersService: UsersService;
    verificationController: VerificationController;
    verificationService: VerificationService;
    verifyManager: VerifyManager;
  }
  // interface RequestCradle {
  //   user: User;
  // }
}

export const awilixPlugin: FastifyPluginAsync = async (
  fastify,
  opts: FastifyAwilixOptions
) => {
  fastify
    .register(
      fastifyAwilixPlugin,
      Object.assign(
        {
          disposeOnClose: true,
          disposeOnResponse: true,
        },
        opts
      )
    )
    .ready(() => {
      fastify.diContainer.register({
        authController: asClass(AuthController).singleton(),
        authService: asClass(AuthService).singleton(),
        challengeManager: asClass(ChallengeManager).singleton(),
        dbClient: asFunction(() => fastify.mongo.db).singleton(),
        deviceManager: asClass(DeviceManager).singleton(),
        httpErrorsService: asFunction(() => fastify.httpErrors).singleton(),
        twilioClient: asFunction(
          () =>
            new Twilio(
              process.env.TWILIO_ACCOUNT_SID,
              process.env.TWILIO_AUTH_TOKEN
            )
        ).singleton(),
        usersController: asClass(UsersController).singleton(),
        usersService: asClass(UsersService).singleton(),
        verificationController: asClass(VerificationController).singleton(),
        verificationService: asClass(VerificationService).singleton(),
        verifyManager: asClass(VerifyManager).singleton(),
      });
    });
};
