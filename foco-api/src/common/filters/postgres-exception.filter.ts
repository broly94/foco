import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  ConflictException,
  BadRequestException,
  InternalServerErrorException,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { PostgresErrorCode } from '@app/common/enums/postgres-error-codes.enum';

@Catch()
export class PostgresExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let handledException: HttpException;

    // Si es un error de Postgres → traducimos
    switch (exception?.code) {
      case PostgresErrorCode.UNIQUE_VIOLATION:
        handledException = new ConflictException('Registro duplicado');
        break;

      case PostgresErrorCode.NOT_NULL_VIOLATION:
        handledException = new BadRequestException('Falta un campo obligatorio');
        break;

      case PostgresErrorCode.FOREIGN_KEY_VIOLATION:
        handledException = new BadRequestException('Clave foránea inválida');
        break;

      case PostgresErrorCode.CHECK_VIOLATION:
        handledException = new BadRequestException('Violación de restricción CHECK');
        break;

      case PostgresErrorCode.EXCLUSION_VIOLATION:
        handledException = new ConflictException('Violación de restricción EXCLUDE');
        break;

      default:
        // Si ya es HttpException → la dejamos pasar
        if (exception instanceof HttpException) {
          handledException = exception;
        } else {
          handledException = new InternalServerErrorException('Error interno del servidor');
        }
    }

    const status = handledException.getStatus();
    const responseBody = handledException.getResponse();
    console.log(handledException);
    response.status(status).json({
      success: false,
      statusCode: status != undefined ? status : 500,
      timestamp: new Date().toISOString(),
      ...(typeof responseBody === 'string' ? { message: responseBody } : responseBody),
    });
  }
}
