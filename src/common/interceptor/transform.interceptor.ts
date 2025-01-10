import { CallHandler, Injectable } from '@nestjs/common';

import { ExecutionContext } from '@nestjs/common';

import { NestInterceptor } from '@nestjs/common';
import { Request } from 'express';
import { map, Observable } from 'rxjs';

@Injectable()
export class TransformInterceptor<T, R> implements NestInterceptor<T, R> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<R> {
    return next.handle().pipe(
      map((response) => {
        const http = context.switchToHttp();
        const request = http.getRequest<Request>();
        const { page = 1, limit = 10 } = request.query;
        if (Array.isArray(response)) {
          return { items: response };
        }
        if (request.query['page']) {
          return {
            page: Number(page),
            limit: Number(limit),
            total: response.total,
            total_page: response.totalPage,
            items: response.items,
          };
        }
        return response;
      }),
    );
  }
}
