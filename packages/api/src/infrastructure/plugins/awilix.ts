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
    .ready((err) => {
      if (err) throw err;
      fastify.diContainer.register({
        authController: asClass(AuthController).singleton(),
        authService: asClass(AuthService).singleton(),
        challengeManager: asClass(ChallengeManager).singleton(),
        dbClient: asFunction(() => fastify.mongo.db),
        deviceManager: asClass(DeviceManager).singleton(),
        helpersService: asClass(HelpersService).singleton(),
        httpErrorsService: asFunction(() => fastify.httpErrors),
        twilioClient: asFunction(
          () =>
            new Twilio(
              process.env.TWILIO_ACCOUNT_SID,
              process.env.TWILIO_AUTH_TOKEN
            )
        ).singleton(),
        usersController: asClass(UsersController).singleton(),
        usersService: asClass(UsersService).singleton(),
        userRepository: asClass(UserRepository).singleton(),
        verificationController: asClass(VerificationController).singleton(),
        verificationService: asClass(VerificationService).singleton(),
        verifyManager: asClass(VerifyManager).singleton(),
      });
    });
};
