import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger();

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const method = req.method;
    const url = req.url;
    const now = Date.now();
    const ipAddress = req.ip;
    const source = req.headers['user-agent'];

    return next.handle().pipe(
      tap(() =>
        this.logger.log(
          `${method} ${url} ${Date.now() - now}ms, Accessed from: ${ipAddress}, Source: ${source}`,
          context.getClass().name,
        ),
      ),
    );
  }
}
