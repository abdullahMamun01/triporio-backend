import { USER_ROLE } from "./user.constants"

export type TUser = {
    firstName: string ,
    lastName: string ,
    email: string ,
    password:string ,
    phone?: string ,
    role: 'user' | 'admin',
    address: string ,
    image?: string 
    isVerified?: boolean
}

export type TLogin = {
    email: string,
    password: string
}

export type TUserRole  = keyof typeof USER_ROLE
