import { HttpErrors } from '@fastify/sensible/lib/httpError';
import { CreateUserDto, UserDto } from '../../domain/dtos';
import { LoginBody, RegisterBody } from '../../domain/schemas';
import { HelpersService } from './helpers.service';
import { UsersService } from './users.service';

export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly helpersService: HelpersService,
    private readonly httpErrorsService: HttpErrors
  ) {}

  login = async ({ username, password }: LoginBody) => {
    const existingUser = await this.usersService.findUserByUsername(username);

    if (!existingUser) {
      // Not clue what is going on here
      throw this.httpErrorsService.notFound(
        'Username or password is incorrect'
      );
    }

    const isPasswordValid = await this.helpersService.checkPassword(
      password,
      existingUser.password
    );

    if (!isPasswordValid) {
      throw this.httpErrorsService.notFound(
        'Username or password is incorrect'
      );
    }

    return new UserDto(existingUser);
  };

  logout = async () => {
    return 'OK';
  };

  register = async ({
    username,
    password,
    phoneNumber,
    enableMFA,
    channel,
  }: RegisterBody) => {
    const existingUser = await this.usersService.findUserByUsername(username);

    if (existingUser) {
      throw this.httpErrorsService.conflict('Username already exists');
    }

    const usertToCreate = new CreateUserDto({
      username,
      password,
      phoneNumber,
      enableMFA,
      channel,
    });

    const createdUser = await this.usersService.createUser(usertToCreate);

    if (!createdUser?.insertedId.toString()) {
      throw this.httpErrorsService.internalServerError('Failed to create user');
    }

    return new UserDto({
      ...usertToCreate,
      _id: createdUser.insertedId,
    });
  };
}
