import type { FastifyReply, FastifyRequest } from 'fastify';
import type { AuthService } from '../../application/services';
import { LoginBody, RegisterBody } from '../../domain/schemas';

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  login = async (
    request: FastifyRequest<{
      Body: LoginBody;
    }>,
    reply: FastifyReply
  ) => {
    const user = await this.authService.login(request.body);
    request.session.user = user;
    request.session.verification = undefined;

    return user;
  };

  logout = async (request: FastifyRequest, reply: FastifyReply) => {
    request.session.user = undefined;
    request.session.verification = undefined;

    return this.authService.logout();
  };

  register = async (
    request: FastifyRequest<{
      Body: RegisterBody;
    }>,
    reply: FastifyReply
  ) => {
    const user = await this.authService.register(request.body);

    request.session.user = user;
    request.session.verification = undefined;

    return user;
  };
}
