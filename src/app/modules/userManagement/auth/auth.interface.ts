export type TUserLogin = {
    id: string;
    password: string;
}

export interface TPasswordData {
    oldPassword: string,
    newPassword: string;
}