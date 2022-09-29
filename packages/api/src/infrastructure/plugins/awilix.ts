import { FastifyAwilixOptions, fastifyAwilixPlugin } from '@fastify/awilix';
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
import { AuthController } from '../controllers/auth.controller';
import { UsersController } from '../controllers/users.controller';
import { VerificationController } from '../controllers/verification.controller';

declare module '@fastify/awilix' {
  interface Cradle {
    twilioClient: Twilio;
    challengeManager: ChallengeManager;
    deviceManager: DeviceManager;
    verifyManager: VerifyManager;
    authController: AuthController;
    authService: AuthService;
    usersController: UsersController;
    usersService: UsersService;
    verificationController: VerificationController;
    verificationService: VerificationService;
    httpErrorsService: HttpErrors;
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
        twilioClient: asFunction(
          () =>
            new Twilio(
              process.env.TWILIO_ACCOUNT_SID,
              process.env.TWILIO_AUTH_TOKEN
            )
        ).singleton(),
        challengeManager: asClass(ChallengeManager).singleton(),
        deviceManager: asClass(DeviceManager).singleton(),
        verifyManager: asClass(VerifyManager).singleton(),
        authController: asClass(AuthController).singleton(),
        authService: asClass(AuthService).singleton(),
        usersController: asClass(UsersController).singleton(),
        usersService: asClass(UsersService).singleton(),
        verificationController: asClass(VerificationController).singleton(),
        verificationService: asClass(VerificationService).singleton(),
        httpErrorsService: asFunction(() => fastify.httpErrors).singleton(),
      });
    });
};
