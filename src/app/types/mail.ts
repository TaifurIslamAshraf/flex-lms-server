export type IEmailOption = {
  email: string;
  subject: string;
  templete: string;
  data: { [key: string]: unknown };
};
