import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class RefreshBodyFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const body = exception.getResponse() as string | { [k: string]: any };

    const message = typeof body === 'object' && 'message' in body ? body.message : null;
    let error = typeof body === 'object' && 'error' in body ? body.error : null;
    let modifiedStatus = status;

    if (status === 400) {
      modifiedStatus = 401;
      error = 'Unauthorized';
    }

    type Body = { statusCode: number; message?: any; error?: any };
    const modifiedBody: Body = { statusCode: modifiedStatus };
    if (message) modifiedBody.message = message;
    if (error) modifiedBody.error = error;

    response.status(modifiedStatus).json(modifiedBody);
  }
}
