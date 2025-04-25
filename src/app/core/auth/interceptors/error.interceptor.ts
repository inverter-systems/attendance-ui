import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Token expirado ou inválido
        authService.logout();
        router.navigate(['/auth/login'], { 
          queryParams: { returnUrl: router.url },
          replaceUrl: true 
        });
      }
      
      if (error.status === 403) {
        // Usuário não tem permissão
        router.navigate(['/forbidden']);
      }
      
      if (error.status === 404) {
        // Recurso não encontrado
        router.navigate(['/not-found']);
      }
      
      if (error.status === 500) {
        // Erro do servidor
        router.navigate(['/error'], { 
          queryParams: { message: 'Ocorreu um erro no servidor. Tente novamente mais tarde.' } 
        });
      }
      
      // Mensagem padrão ou personalizada
      const errorMessage = error.error?.message || 'Ocorreu um erro inesperado';
      
      // Redireciona para página de erro para erros não tratados acima
      if (![401, 403, 404, 500].includes(error.status)) {
        // Opcionalmente, para erros não tratados
        console.error('Erro não tratado:', error);
      }
      
      // Retorna o erro para que possa ser tratado pelo componente
      return throwError(() => new Error(errorMessage));
    })
  );
};