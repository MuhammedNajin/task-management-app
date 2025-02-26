import { HttpStatusCode } from '../types/HttpStatusCode';
import { ResponseData } from '../types/ReponseData';


export class SuccessResponse<T = any> {
  public readonly status: HttpStatusCode;
  public readonly success: boolean;
  public readonly message: string;
  public readonly data?: T;

  constructor({
    status = HttpStatusCode.OK,
    message = 'Operation successful',
    data,
  }: {
    status?: HttpStatusCode;
    message?: string;
    data?: T;
  }) {
    this.status = status;
    this.success = true;
    this.message = message;
    if (data !== undefined) this.data = data;
  }

  toJSON(): ResponseData<T> {
    return {
      status: this.status,
      success: this.success,
      message: this.message,
      ...(this.data !== undefined && { data: this.data }),
    };
  }
}
