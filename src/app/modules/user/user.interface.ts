import { USER_ROLE } from './user.constants';
type SocialLinks = {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
}


export type TUser = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  role: 'user' | 'admin';
  address: string;
  image?: string;
  isVerified?: boolean;
  bio?: string;
  location?: string;
  website?: string;
  socialLinks?: SocialLinks;
  isDeleted?: boolean,
  isBlocked?:boolean
};

export type TLogin = {
  email: string;
  password: string;
};

export type TUserRole = keyof typeof USER_ROLE;
