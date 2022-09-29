import bcryptjs from 'bcryptjs';

export class HelpersService {
  hashPassword = async (plainText: string) => {
    const salt = await bcryptjs.genSalt(10);

    return bcryptjs.hash(plainText, salt);
  };

  checkPassword = async (plainText: string, hashedPassword: string) => {
    return bcryptjs.compare(plainText, hashedPassword);
  };
}
