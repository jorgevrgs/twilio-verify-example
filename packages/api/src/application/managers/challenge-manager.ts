import { Twilio } from 'twilio';
import type {
  ChallengeChallengeStatuses,
  ChallengeListInstanceCreateOptions,
} from 'twilio/lib/rest/verify/v2/service/entity/challenge';
import type { WebSocket } from 'ws';
import type { UserDto } from '../../domain/dtos';

export class ChallengeManager {
  private challenges: Map<
    string,
    {
      status: ChallengeChallengeStatuses;
      socket?: WebSocket;
    }
  >;

  constructor(private readonly twilioClient: Twilio) {
    this.challenges = new Map();
  }

  async create(user: UserDto, fields?: object | Array<object>) {
    console.log('identity: ', user.id);

    const opts: ChallengeListInstanceCreateOptions = {
      details: {
        message: 'Please approve the login request',
        fields: fields,
      },
      factorSid: user.factor?.sid as string,
    };

    const challenge = await this.twilioClient.verify
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .entities(user.id)
      .challenges.create(opts);

    this.challenges.set(challenge.sid, {
      status: challenge.status,
      socket: undefined,
    });

    return challenge;
  }

  async fetch(user: UserDto, sid: string) {
    const challenge = await this.twilioClient.verify
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .entities(user.id)
      .challenges(sid)
      .fetch();
    this.challenges.set(challenge.sid, {
      status: challenge.status,
      socket: undefined,
    });

    return challenge;
  }

  get(sid: string) {
    return this.challenges.get(sid);
  }

  update(sid: string, status: ChallengeChallengeStatuses) {
    const found = this.challenges.get(sid);

    if (!found) {
      return;
    }

    this.challenges.set(sid, { socket: found.socket, status });

    found.socket && found.socket.send(JSON.stringify({ status: status }));
  }

  registerSocket(sid: string, socket: WebSocket) {
    const found = this.challenges.get(sid);

    if (!found) {
      return;
    }

    this.challenges.set(sid, { status: found.status, socket });
  }
}
