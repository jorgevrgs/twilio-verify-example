import {
  FastifyAwilixOptions,
  fastifyAwilixPlugin,
} from '@fastify/awilix/lib/classic';
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
import { UserRepository } from '../../application/repositories';
import {
  AuthService,
  HelpersService,
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
    helpersService: HelpersService;
    httpErrorsService: HttpErrors;
    twilioClient: Twilio;
    usersController: UsersController;
    usersService: UsersService;
    userRepository: UserRepository;
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
  fastify.register(
    fastifyAwilixPlugin,
    Object.assign(
      {
        disposeOnClose: true,
        disposeOnResponse: true,
      },
      opts
    )
  );

  fastify.addHook('onRegister', (instance) => {
    instance.diContainer
      .register('authController', asClass(AuthController).singleton())
      .register('authService', asClass(AuthService).singleton())
      .register('challengeManager', asClass(ChallengeManager).singleton())
      .register(
        'dbClient',
        asFunction(() => fastify.mongo.db)
      )
      .register('deviceManager', asClass(DeviceManager).singleton())
      .register('helpersService', asClass(HelpersService).singleton())
      .register(
        'httpErrorsService',
        asFunction(() => fastify.httpErrors)
      )
      .register(
        'twilioClient',
        asFunction(
          () =>
            new Twilio(
              process.env.TWILIO_ACCOUNT_SID,
              process.env.TWILIO_AUTH_TOKEN
            )
        ).singleton()
      )
      .register('usersController', asClass(UsersController).singleton())
      .register('usersService', asClass(UsersService).singleton())
      .register('userRepository', asClass(UserRepository).singleton())
      .register(
        'verificationController',
        asClass(VerificationController).singleton()
      )
      .register('verificationService', asClass(VerificationService).singleton())
      .register('verifyManager', asClass(VerifyManager).singleton());
  });
};
