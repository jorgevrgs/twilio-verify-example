import { FastifyMongoObject } from '@fastify/mongodb';
import type { Filter, UpdateFilter } from 'mongodb';
import { UserSchemaDto } from '../../domain/dtos';

export class UserRepository {
  constructor(private readonly dbClient: FastifyMongoObject['db']) {}

  findOne(query: Filter<UserSchemaDto>) {
    return this.dbClient?.collection<UserSchemaDto>('users').findOne(query);
  }

  updateOne(query: Filter<UserSchemaDto>, update: UpdateFilter<UserSchemaDto>) {
    return this.dbClient
      ?.collection<UserSchemaDto>('users')
      .updateOne(query, update);
  }
}
