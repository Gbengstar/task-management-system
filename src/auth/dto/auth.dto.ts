import { Auth } from '../model/auth.model';

export type AuthDto = Pick<Auth, 'password' | 'username'>;
