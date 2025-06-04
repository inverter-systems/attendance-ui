import {
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
  HttpEvent,
  HttpErrorResponse,
} from "@angular/common/http";
import { inject } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { Router } from "@angular/router";

export const errorInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if ([401, 403].includes(error.status)) {
        // Auth error handling
        // For 401 errors, the AuthInterceptor will handle token refresh
        // For 403 errors, redirect to an access denied page or show a message
        if (error.status === 403) {
          router.navigate(["/access-denied"]);
        }
      }

      // For other error types, just pass the error along
      return throwError(() => error.message);
    })
  );
};
