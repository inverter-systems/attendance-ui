import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

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
}
