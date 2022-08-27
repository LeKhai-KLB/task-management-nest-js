import {
  NestInterceptor,
  ExecutionContext,
  Injectable,
  CallHandler,
} from "@nestjs/common";
import { classToPlain } from "class-transformer";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(map((data) => classToPlain(data)));
  }
}
