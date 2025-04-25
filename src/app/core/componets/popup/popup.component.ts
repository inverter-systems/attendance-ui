import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss'],
})
export class PopupComponent {
  @Input() title = 'Mensagem';
  @Input() message = '';
  @Input() show = false;
  @Input() redirectTo = '';

  constructor(private router: Router) {}

  close() {
    this.show = false;
    this.message = '';

    if (this.redirectTo) {
      this.router.navigate(['/auth/login']);
    }
  }
}
