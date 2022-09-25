import { ObjectId } from '@fastify/mongodb';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { FastifyPluginAsync } from 'fastify';
import { UserDto } from '../../dtos';
import { CreateUserVerification } from '../../dtos/create-user-verification.dto';
import { CreateUserDto } from '../../dtos/create-user.dto';
import { UpdateUserDto } from '../../dtos/update-user.dto';
import {
  loginSchema,
  registerSchema,
  verifyCodeSchema,
} from '../../schemas/auth.schema';

const authRoute: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.withTypeProvider<TypeBoxTypeProvider>().post(
    '/register',
    {
      schema: registerSchema,
    },
    async function (request, reply) {
      const existingUser = await request.db
        ?.collection('users')
        .findOne({ username: request.body.username });

      if (existingUser) {
        throw reply.conflict('Username already exists');
      }

      const hashedPassword = await request.helpers.hashPassword(
        request.body.password
      );

      // Create user in database
      const usertToCreate = new CreateUserDto({
        username: request.body.username,
        password: hashedPassword,
        phoneNumber: request.body.phoneNumber,
        isPhoneNumberVerified: false,
        enableMFA: request.body.enableMFA,
      });

      if (request.body.enableMFA) {
        const createdVerification =
          await request.twilioVerify.verifications.create({
            to: request.body.phoneNumber,
            channel: 'sms',
          });

        request.log.info({ createdVerification });

        const verification = new CreateUserVerification({
          sid: createdVerification.sid,
          status: createdVerification.status,
          createdAt: createdVerification.dateCreated,
          updatedAt: createdVerification.dateUpdated,
        });

        usertToCreate.verification = verification;
      }

      const createdUser = await request.db
        ?.collection('users')
        .insertOne(usertToCreate);

      if (!createdUser?.insertedId.toString()) {
        throw reply.internalServerError('Failed to create user');
      }

      request.log.info({ createdUser });

      const response = new UserDto({
        ...usertToCreate,
        _id: createdUser.insertedId,
      });

      request.session.set('user', response);

      request.log.info({ response });

      reply.status(201);
      return response;
    }
  );

  fastify.withTypeProvider<TypeBoxTypeProvider>().post(
    '/verify-code',
    {
      schema: verifyCodeSchema,
    },
    async function (request, reply) {
      const currentUser = request.session.get<UserDto>('user');

      if (!currentUser) {
        await request.session.destroy();

        throw reply.unauthorized('Current user is not authenticated');
      }

      const result = await request.twilioVerify.verificationChecks.create({
        to: currentUser.phoneNumber,
        code: request.body.verificationCode,
      });

      if (result.status !== 'approved') {
        throw reply.badRequest('Invalid verification code');
      }

      const updatedUser = await request.db
        ?.collection('users')
        .findOneAndUpdate(
          { _id: new ObjectId(currentUser.id) },
          {
            $set: {
              isPhoneNumberVerified: true,
              'verification.status': result.status,
              'verification.updatedAt': result.dateUpdated,
            },
          },
          { returnDocument: 'after' }
        );

      if (!updatedUser?.value) {
        throw reply.internalServerError('Failed to update user');
      }

      request.session.set('user', updatedUser);

      return new UserDto(updatedUser.value);
    }
  );

  fastify.withTypeProvider<TypeBoxTypeProvider>().post(
    '/login',
    {
      schema: loginSchema,
    },
    async function (request, reply) {
      const existingUser = await request.db
        ?.collection('users')
        .findOne({ username: request.body.username });

      if (!existingUser) {
        // Not clue what is going on here
        throw reply.notFound('Username or password is incorrect');
      }

      const isPasswordValid = await request.helpers.checkPassword(
        request.body.password,
        existingUser.password
      );

      if (!isPasswordValid) {
        throw reply.notFound('Username or password is incorrect');
      }

      const usertToUpdate = new UpdateUserDto();

      if (existingUser.enableMFA) {
        const createdVerification =
          await request.twilioVerify.verifications.create({
            to: existingUser.phoneNumber,
            channel: 'sms',
          });

        request.log.info({ createdVerification });

        const verification = new CreateUserVerification({
          sid: createdVerification.sid,
          status: createdVerification.status,
          createdAt: createdVerification.dateCreated,
          updatedAt: createdVerification.dateUpdated,
        });

        usertToUpdate.verification = verification;
      }

      const updatedUser = await request.db
        ?.collection('users')
        .findOneAndUpdate(
          { _id: new ObjectId(existingUser._id) },
          {
            $set: {
              verification: usertToUpdate.verification,
            },
          },
          { returnDocument: 'after' }
        );

      if (!updatedUser?.value?._id.toString()) {
        throw reply.internalServerError('Failed to update user');
      }

      request.log.info({ updatedUser });

      const response = new UserDto(updatedUser.value);

      request.session.set('user', response);

      request.log.info({ response });

      return response;
    }
  );

  fastify.post('/logout', async function (request, reply) {
    await request.session.destroy();

    return 'OK';
  });
};

export default authRoute;
