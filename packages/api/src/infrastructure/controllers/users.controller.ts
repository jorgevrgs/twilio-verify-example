import { FastifyReply, FastifyRequest } from 'fastify';
import { UsersService } from '../../application/services';
import { UsernameParams } from '../../domain/schemas';

export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  changePassword = async (
    request: FastifyRequest<{
      Body: {
        currentPassword: string;
        newPassword: string;
        confirmPassword: string;
      };
    }>,
    reply: FastifyReply
  ) => {
    return this.usersService.changePassword({
      currentPassword: request.body.currentPassword,
      newPassword: request.body.newPassword,
      confirmPassword: request.body.confirmPassword,
      userId: request.session.user?.id as string,
    });
  };

  getCurrentUser = async (request: FastifyRequest, reply: FastifyReply) => {
    return this.usersService.findUserById(request.session.user?.id as string);
  };

  getUserByUsername = async (
    request: FastifyRequest<{
      Params: UsernameParams;
    }>,
    reply: FastifyReply
  ) => {
    return this.usersService.findUserByUsername(request.params.username);
  };
}
