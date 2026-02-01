import { UserType } from '@app/interfaces';

export interface PayloadToken {
  id: number;
  email: string;
  avatar: string;
  userType: UserType;
}

export interface UseToken {
  id: number;
  userType: UserType;
  isExpired: boolean;
}

export interface AuthTokenResult {
  id: number;
  userType: UserType;
  iat: number;
  exp: number;
}
