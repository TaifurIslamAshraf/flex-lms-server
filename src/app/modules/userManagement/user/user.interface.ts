import { Iinstructor } from "../auth/auth.interface";

export type IUserUpdate = {
  name?: string;
  fatherName?: string;
  motherName?: string;
  address?: string;
  phone?: string;
  instructor?: Iinstructor;
  district?: string;
  postCode?: string;
};
