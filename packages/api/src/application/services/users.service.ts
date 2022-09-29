import { ObjectId } from '@fastify/mongodb';
import { HttpErrors } from '@fastify/sensible/lib/httpError';
import { CreateUserDto, UserDto } from '../../domain/dtos';
import { ChangePasswordBody } from '../../domain/schemas';
import { UserRepository } from '../repositories/user.repository';
import { HelpersService } from './helpers.service';

export class UsersService {
  constructor(
    private readonly httpErrorsService: HttpErrors,
    private readonly userRepository: UserRepository,
    private readonly helpersService: HelpersService
  ) {}

  async changePassword({
    newPassword,
    confirmPassword,
    currentPassword,
    userId,
  }: ChangePasswordBody & { userId: string }) {
    if (newPassword !== confirmPassword) {
      throw this.httpErrorsService.badRequest('Passwords do not match');
    }

    const existingUser = await this.userRepository.findOne({
      _id: new ObjectId(userId),
    });

    if (!existingUser) {
      throw this.httpErrorsService.notFound('User not found');
    }

    const isPasswordCorrect = await this.helpersService.checkPassword(
      currentPassword,
      existingUser.password
    );

    if (!isPasswordCorrect) {
      throw this.httpErrorsService.badRequest('Incorrect password');
    }

    const hashedPassword = await this.helpersService.hashPassword(newPassword);

    await this.userRepository.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { password: hashedPassword } }
    );

    return new UserDto({
      ...existingUser,
      password: hashedPassword,
    });
  }

  async findUserById(userId: string) {
    const user = await this.userRepository.findOne({
      _id: new ObjectId(userId),
    });

    if (!user) {
      throw this.httpErrorsService.notFound('User not found');
    }

    return new UserDto(user);
  }

  async findUserByUsername(username: string) {
    const user = await this.userRepository.findOne({ username });

    if (!user) {
      throw this.httpErrorsService.notFound('User not found');
    }

    return new UserDto(user);
  }

  async createUser(payload: CreateUserDto) {
    const hashedPassword = await this.helpersService.hashPassword(
      payload.password
    );

    return this.userRepository.insertOne({
      ...payload,
      password: hashedPassword,
    });
  }
}