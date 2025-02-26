import { HttpStatusCode } from "./HttpStatusCode";

export interface ResponseData<T = any> {
  status: HttpStatusCode;
  success: boolean;
  message: string;
  data?: T;
  error?: string | Record<string, any>;
}