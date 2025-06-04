import {
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
  HttpEvent,
  HttpErrorResponse,
} from "@angular/common/http";
import { inject, Injector } from "@angular/core";
import { Observable, throwError, BehaviorSubject } from "rxjs";
import { catchError, filter, take, switchMap, finalize } from "rxjs/operators";
import { AuthService } from "../services/auth.service";

// Variable for refresh token handling
let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<any>(null);

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  // With HTTP-only cookies, we don't need to manually add the JWT token
  // The browser will automatically include the cookies in the request
  // Just ensure credentials are included
  req = req.clone({
    withCredentials: true,
  });

  return next(req).pipe(
    catchError((error) => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        const injector = inject(Injector);
        const authService = injector.get(AuthService);
        return handle401Error(req, next, authService);
      }
      return throwError(() => error);
    })
  );
};

function handle401Error(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
  authService: AuthService // AuthService is now passed as an argument
): Observable<HttpEvent<unknown>> {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    return authService.refreshToken().pipe(
      switchMap(() => {
        refreshTokenSubject.next(true);
        // No need to modify the request as cookies are handled by the browser
        return next(request);
      }),
      catchError((error) => {
        // If refresh fails, redirect to login
        authService.logout().subscribe();
        return throwError(() => error);
      }),
      finalize(() => {
        isRefreshing = false;
      })
    );
  } else {
    return refreshTokenSubject.pipe(
      filter((token) => token !== null),
      take(1),
      switchMap(() => next(request))
    );
  }
}
