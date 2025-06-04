import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { User } from '../models/user.model';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

interface RegisterResponse {
  data: User | null;
  errors?: string[];
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  private isFullRegisteredUserSubject = new BehaviorSubject<boolean>(false);
  public isFullRegisteredUser$ = this.isFullRegisteredUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    // Check if user is already authenticated by making a validation request to the API
    this.validateSession().subscribe();
  }

  login(username: string, password: string): Observable<RegisterResponse> {
    return this.http
      .post<any>(
        `${this.apiUrl}/auth`,
        { username, password },
        {
          withCredentials: true, // Important: ensures cookies are sent with the request
        },
      )
      .pipe(
        tap((response) => {
          // The JWT is now stored in an HTTP-only cookie by the server
          // We only need to store the user information
          this.currentUserSubject.next(response.data);
          this.isAuthenticatedSubject.next(true);
        }),
      );
  }

  isFullRegisteredUser(): boolean {
    return this.isFullRegisteredUserSubject.value;
  }

  isAuthenticated(): boolean {
    // Verifica se o BehaviorSubject de autenticação está como true
    // E se há um usuário atual definido
    return this.isAuthenticatedSubject.value && this.currentUserSubject.value !== null;
  }

  validateSession(): Observable<RegisterResponse> {
    return this.http
      .get<any>(`${this.apiUrl}/auth/validate`, {
        withCredentials: true,
      })
      .pipe(
        tap((resp) => {
          this.currentUserSubject.next(resp.data);
          this.isAuthenticatedSubject.next(true);
        }),
        catchError((e) => {
          // If validation fails, ensure user is logged out locally
          this.currentUserSubject.next(null);
          this.isAuthenticatedSubject.next(false);

          // Retorne um objeto RegisterResponse indicando falha
          return of({
            data: null,
            errors: [e.message || 'Falha na validação da sessão'],
          });
        }),
      );
  }

  register(userData: any): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/auth/user/create`, userData);
  }

  logout(): Observable<any> {
    return this.http
      .post<any>(
        `${this.apiUrl}/auth/logout`,
        {},
        {
          withCredentials: true,
        },
      )
      .pipe(
        tap(() => {
          this.currentUserSubject.next(null);
          this.isAuthenticatedSubject.next(false);
        }),
        catchError((error) => {
          // Even if the API call fails, we want to clear the local state
          this.currentUserSubject.next(null);
          this.isAuthenticatedSubject.next(false);
          this.isFullRegisteredUserSubject.next(false);
          return throwError(() => error);
        }),
      );
  }

  refreshToken(): Observable<any> {
    return this.http
      .post<any>(
        `${this.apiUrl}/auth/refresh-token`,
        {},
        {
          withCredentials: true,
        },
      )
      .pipe(
        tap((response) => {
          if (response && response.user) {
            this.currentUserSubject.next(response.user);
            this.isAuthenticatedSubject.next(true);
          }
        }),
      );
  }

  setIsFullRegisteredUser() {
    this.isFullRegisteredUserSubject.next(true);
  }

  /* logout(): Observable<any> {
    return this.http
      .post<any>(
        `${this.apiUrl}/auth/logout`,
        {},
        {
          withCredentials: true,
        }
      )
      .pipe(
        tap(() => {
          this.currentUserSubject.next(null);
          this.isAuthenticatedSubject.next(false);
        }),
        catchError((error) => {
          // Even if the API call fails, we want to clear the local state
          this.currentUserSubject.next(null);
          this.isAuthenticatedSubject.next(false);
          return throwError(() => error);
        })
      );
  }
 */
  /* private completeLogout(): void {
    this.currentUserSubject.next(null);
    this.router.navigate(["/auth/login"]);
  } */

  /* getUserProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/profile`).pipe(
      tap((user) => this.currentUserSubject.next(user)),
      catchError((error) => {
        console.error("Error fetching user profile:", error);
        if (error.status === 401) {
          this.completeLogout();
        }
        return throwError(() => new Error("Falha ao obter perfil do usuário."));
      })
    );
  }

  refreshToken(): Observable<any> {
    return this.http
      .post<any>(
        `${this.apiUrl}/auth/refresh-token`,
        {},
        {
          withCredentials: true,
        }
      )
      .pipe(
        tap((response) => {
          if (response && response.user) {
            this.currentUserSubject.next(response.user);
            this.isAuthenticatedSubject.next(true);
          }
        })
      );
  }

  isAuthenticated(): boolean {
    // Verifica se o BehaviorSubject de autenticação está como true
    // E se há um usuário atual definido
    return (
      this.isAuthenticatedSubject.value &&
      this.currentUserSubject.value !== null
    );
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  hasPermission(permission: string): boolean {
    const user = this.currentUserSubject.value;
    if (!user || !user.roles) {
      return false;
    }

    return user.roles.some(
      (role) =>
        role.permissions && role.permissions.some((p) => p.name === permission)
    );
  }

  hasRole(role: string): boolean {
    const user = this.currentUserSubject.value;
    if (!user || !user.roles) {
      return false;
    }

    return user.roles.some((r) => r.name === role);
  } */
}
