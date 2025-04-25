import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @Output() toggleSidenavEvent = new EventEmitter();
  
  toggleSidenav() {
    this.toggleSidenavEvent.emit();    
  }
}