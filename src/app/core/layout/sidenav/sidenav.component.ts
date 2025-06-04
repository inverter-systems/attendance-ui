import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth/services/auth.service';
import { User } from '../../auth/models/user.model';

interface NavItem {
  route: string;
  icon: string;
  label: string;
}

@Component({
  selector: 'app-sidenav',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
})
export class SidenavComponent {
  @Input() isOpen = false;
  @Input() isMobile = false;

  isAuthenticated$: Observable<boolean>;
  currentUser$: Observable<User | null>;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {
    this.isAuthenticated$ = this.authService.isAuthenticated$;
    this.currentUser$ = this.authService.currentUser$;
  }

  navItems: NavItem[] = [
    { route: '/', icon: '📊', label: 'Dashboard' },
    { route: '/pages/temp', icon: '📁', label: 'Projetos' },
    { route: '/relatorios', icon: '📈', label: 'Relatórios' },
    { route: '/tarefas', icon: '📝', label: 'Tarefas' },
    { route: '/equipe', icon: '👥', label: 'Equipe' },
    { route: '/calendario', icon: '📅', label: 'Calendário' },
    { route: '/mensagens', icon: '💬', label: 'Mensagens' },
    { route: '/configuracoes', icon: '⚙️', label: 'Configurações' },
  ];

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
    });
  }
}
