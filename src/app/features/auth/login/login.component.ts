import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/auth/services/auth.service';
import { PersonService } from '../../services/person.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  returnUrl: string;
  message = '';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private personService: PersonService,
  ) {
    // Redirecionar para a home se já estiver logado
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/']);
    }

    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });

    // Captura a URL de retorno dos query params ou define a página inicial
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  ngOnInit(): void {}

  // Getter de conveniência para acesso fácil aos campos do formulário
  get f() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    // Para a validação se o formulário for inválido
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.authService.login(this.f['username'].value, this.f['password'].value).subscribe({
      next: () => {
        this.checkRegistrationIsFull(this.f['username'].value);
      },
      error: (e) => {
        this.error = e?.errors?.[0] ? e.errors[0] : e;
        this.loading = false;
      },
    });
  }

  private checkRegistrationIsFull(username: string) {
    this.personService.checkRegistrationIsFull(username).subscribe({
      next: (isRegistrationFull) => {
        if (isRegistrationFull) {
          this.authService.setIsFullRegisteredUser();
          this.router.navigate([this.returnUrl]);
        } else {
          this.router.navigate(['/auth/full-register']);
        }
      },
    });
  }
}
