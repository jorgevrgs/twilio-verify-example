import pick from 'lodash.pick';
import { FactorInstance } from 'twilio/lib/rest/verify/v2/service/entity/factor';

export class CreateFactor {
  'sid': string;
  'type': string;
  'status': string;

  constructor(data?: Partial<FactorInstance>) {
    Object.assign(this, {
      ...pick(data, ['sid', 'status', 'type']),
      createdAt: data?.dateCreated,
      updatedAt: data?.dateUpdated,
    });
  }
}
