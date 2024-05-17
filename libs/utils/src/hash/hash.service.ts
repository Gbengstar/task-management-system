import { BadRequestException } from '@nestjs/common';
import { randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

const asyncScript = promisify(scrypt);

export class HashService {
  /**
   *
   * @param value the string to be hashed
   * @returns returns string
   */

  static hash = async (value: string): Promise<string> => {
    if (!value) throw new BadRequestException('no value supplied for hashing');
    const salt = randomBytes(8).toString('hex');
    const hashedPass = (await asyncScript(value, salt, 64)) as Buffer;
    return `${hashedPass.toString('hex')}.${salt}`;
  };

  /**
   *
   * @param hash hashed value
   * @param value value to compare with the hash
   * @returns returns a boolean
   */
  static verifyHash = async (hash: string, value: string) => {
    if (!(hash && value))
      throw new BadRequestException('No password supplied for authentication');
    const [storedHashPass, salt] = hash.split('.');
    const hashedPass = (await asyncScript(value, salt, 64)) as Buffer;

    return hashedPass.toString('hex') === storedHashPass;
  };
}
