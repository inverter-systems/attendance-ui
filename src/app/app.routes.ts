import { Routes } from '@angular/router';
import { authGuard } from './core/auth/guards/auth.guard';
import { roleGuard } from './core/auth/guards/role.guard';
import { DashboardComponent } from './features/pages/dashboard/dashboard.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'pages/dashboard',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  /* {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
  },*/
  {
    path: 'pages',
    loadChildren: () =>
      import('./features/pages/pages.routes').then((m) => m.PAGES_ROUTES),
    canActivate: [authGuard],
  },
  /* {
    path: 'users', // Define o caminho da URL para acessar esta rota
    loadChildren: () => import('./features/user-management/user-management.routes').then(m => m.USER_MANAGEMENT_ROUTES),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN', 'MANAGER'] }
  },
  {
    path: 'roles',
    loadChildren: () => import('./features/role-management/role-management.routes').then(m => m.ROLE_MANAGEMENT_ROUTES),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN'] }
  },
  {
    path: 'permissions',
    loadChildren: () => import('./features/permission-management/permission-management.routes').then(m => m.PERMISSION_MANAGEMENT_ROUTES),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN'] }
  }, */
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];

/* Esta definição de rota no Angular 19 configura uma rota "users" com várias características:

- path: 'users'
  Define o caminho da URL para acessar esta rota (ex: "www.seusite.com/users")

- loadChildren: () => import('./features/user-management/user-management.routes').then(m => m.USER_MANAGEMENT_ROUTES)  
  Implementa carregamento preguiçoso (lazy loading) para este módulo. Isso significa que o código relacionado ao gerenciamento de usuários só será carregado quando um usuário 
  navegar para esta rota, melhorando o desempenho inicial da aplicação.

- canActivate: [authGuard, roleGuard] 
  Define dois guards que controlam o acesso a esta rota:
    - authGuard: Provavelmente verifica se o usuário está autenticado
    - roleGuard: Verifica se o usuário tem as permissões necessárias
    
- data: { roles: ['ADMIN', 'MANAGER'] } 
  Fornece dados adicionais para os guards, especificando que apenas usuários com papel de 'ADMIN' ou 'MANAGER' podem acessar esta rota.

Em resumo, esta configuração cria uma rota protegida para o gerenciamento de usuários que só pode ser acessada por usuários autenticados com papéis de administrador ou gerente, 
e utiliza carregamento preguiçoso para melhorar a performance. */
