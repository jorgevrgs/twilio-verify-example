import { FastifyReply, FastifyRequest } from 'fastify';
import { VerificationService } from '../../application/services';
import {
  CreateVerificationBody,
  CreateVerificationParams,
  VerifyCodeBody,
  VerifyCodeParams,
} from '../../domain/schemas';

export class VerificationController {
  constructor(private readonly verificationService: VerificationService) {}

  create = async (
    request: FastifyRequest<{
      Params: CreateVerificationParams;
      Body: CreateVerificationBody;
    }>,
    _reply: FastifyReply
  ) => {
    const verification =
      await this.verificationService.createVerificationByUsername(
        request.params.username,
        request.body
      );

    request.session.verification = verification;

    return verification;
  };

  verify = async (
    request: FastifyRequest<{
      Params: VerifyCodeParams;
      Body: VerifyCodeBody;
    }>,
    _reply: FastifyReply
  ) => {
    const verification = await this.verificationService.verifyCodeByUsername(
      request.params.username,
      request.body
    );

    request.session.verification = verification;

    return verification;
  };
}
