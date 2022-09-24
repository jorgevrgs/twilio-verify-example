import { ObjectId } from '@fastify/mongodb';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { Type } from '@sinclair/typebox';
import { FastifyPluginAsync } from 'fastify';
import { UserDto } from '../../dtos';
import { User } from '../../types';

const authRoute: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.withTypeProvider<TypeBoxTypeProvider>().post(
    '/register',
    {
      schema: {
        body: Type.Object({
          username: Type.String(),
          password: Type.String({ minLength: 6 }),
          phoneNumber: Type.String({ minLength: 10 }),
          enableMFA: Type.Boolean({ default: true }),
        }),
      },
    },
    async function (request, reply) {
      const existingUser = await request.db
        ?.collection('users')
        .findOne({ username: request.body.username });

      if (existingUser) {
        throw reply.conflict('Username already exists');
      }

      const result = await request.twilioVerify.verifications.create({
        to: request.body.phoneNumber,
        channel: 'sms',
      });

      const hashedPassword = await request.helpers.hashPassword(
        request.body.password
      );

      const verification = {
        sid: result.sid,
        status: result.status,
        createdAt: result.dateCreated,
        updatedAt: result.dateUpdated,
      };

      // Create user in database
      const usertToCreate = {
        username: request.body.username,
        password: hashedPassword,
        phoneNumber: request.body.phoneNumber,
        isPhoneNumberVerified: false,
        enableMFA: request.body.enableMFA,
        verification,
      };

      const createdUser = await request.db
        ?.collection('users')
        .insertOne(usertToCreate);

      if (!createdUser?.insertedId.toString()) {
        throw reply.internalServerError('Failed to create user');
      }

      const user = new UserDto({
        ...usertToCreate,
        _id: createdUser.insertedId,
      });

      request.session.set('user', user);

      reply.status(201);
      return user;
    }
  );

  fastify.withTypeProvider<TypeBoxTypeProvider>().post(
    '/verify-code',
    {
      schema: {
        body: Type.Object({
          verificationCode: Type.String({
            minLength: 4,
            maxLength: 10,
            examples: ['123456'],
          }),
          phoneNumber: Type.String({
            minLength: 10,
            examples: ['+573214567890'],
          }),
          sid: Type.String(),
        }),
      },
    },
    async function (request, reply) {
      const currentUser = request.session.get<User>('user');

      if (!currentUser) {
        await request.session.destroy();
        throw reply.badRequest('Username already exists');
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
};

export default authRoute;
