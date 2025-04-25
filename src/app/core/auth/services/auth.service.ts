import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { User } from '../models/user.model';
import { TokenService } from './token.service';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

interface LoginResponse {
  data: {
    username: string;
    token: string;
    expiresAt: string;
    user: User;
  };
}

interface RegisterResponse {
  data: {
    id: string;
    username: string;
    email: string;
  };
  errors?: string[];
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private router: Router
  ) {
    // Tenta carregar o usuário do token armazenado ao inicializar o serviço
    this.loadUserFromToken();
  }

  private loadUserFromToken() {
    const token = this.tokenService.getToken();
    if (token) {
      this.getUserProfile().subscribe();
    }
  }

  login(username: string, password: string): Observable<User> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/auth`, { username, password })
      .pipe(
        tap((response) => {
          this.tokenService.saveToken(response.data.token);
          this.tokenService.saveRefreshToken(response.data.expiresAt);
          this.currentUserSubject.next(response.data.user);
        }),
        map((response) => response.data.user),
        catchError((error) => {
          console.error('Login error:', error);
          return throwError(
            () => new Error('Falha ao autenticar. Verifique suas credenciais.')
          );
        })
      );
  }

  logout(): void {
    // Opcional: Informar ao servidor sobre o logout
    this.http.post(`${this.apiUrl}/logout`, {}).subscribe({
      next: () => this.completeLogout(),
      error: () => this.completeLogout(),
    });
  }

  private completeLogout(): void {
    this.tokenService.removeToken();
    this.tokenService.removeRefreshToken();
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  register(userData: any): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(
      `${this.apiUrl}/auth/user`,
      userData
    );
  }

  getUserProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/profile`).pipe(
      tap((user) => this.currentUserSubject.next(user)),
      catchError((error) => {
        console.error('Error fetching user profile:', error);
        if (error.status === 401) {
          this.completeLogout();
        }
        return throwError(() => new Error('Falha ao obter perfil do usuário.'));
      })
    );
  }

  refreshToken(): Observable<{ token: string; refreshToken: string }> {
    const refreshToken = this.tokenService.getRefreshToken();
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http
      .post<{ token: string; refreshToken: string }>(
        `${this.apiUrl}/refresh-token`,
        { refreshToken }
      )
      .pipe(
        tap((tokens) => {
          this.tokenService.saveToken(tokens.token);
          this.tokenService.saveRefreshToken(tokens.refreshToken);
        }),
        catchError((error) => {
          console.error('Error refreshing token:', error);
          this.completeLogout();
          return throwError(
            () => new Error('Failed to refresh authentication.')
          );
        })
      );
  }

  hasPermission(permission: string): boolean {
    const user = this.currentUserSubject.value;
    if (!user || !user.roles) return false;

    return user.roles.some(
      (role) =>
        role &&
        role.permissions &&
        Array.isArray(role.permissions) &&
        role.permissions.some(
          (p: { resource: string; action: string }) =>
            p &&
            p.resource &&
            p.action &&
            `${p.resource}:${p.action}` === permission
        )
    );
  }

  hasRole(roleName: string): boolean {
    const user = this.currentUserSubject.value;
    if (!user) return false;

    return user.roles.some((role) => role.name === roleName);
  }

  isAuthenticated(): boolean {
    return !!this.currentUserSubject.value && !!this.tokenService.getToken();
  }

  public hasAnyRole(requiredRoles: string[]): boolean {
    // Se não há papéis requeridos, permite o acesso
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // Obtém o usuário atual da sessão
    const currentUser = this.currentUserSubject.value;

    // Se não há usuário autenticado, não permite o acesso
    if (!currentUser || !currentUser.roles) {
      return false;
    }

    // Verifica se o usuário possui algum dos papéis requeridos
    const userRoles = currentUser.roles.map((role) => role.name);
    return requiredRoles.some((role) => userRoles.includes(role));
  }
}
