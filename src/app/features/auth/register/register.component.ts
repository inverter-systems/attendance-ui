import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControlOptions,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/auth/services/auth.service';
import { PopupComponent } from '../../../core/componets/popup/popup.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, PopupComponent],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  message = '';
  showPopup = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    // Redirecionar para a home se já estiver logado
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/']);
    }

    this.registerForm = this.formBuilder.group(
      {
        username: ['', [Validators.required, Validators.minLength(4)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      {
        validator: this.passwordMatchValidator,
      } as AbstractControlOptions
    );
  }

  ngOnInit(): void {}

  // Validador personalizado para verificar se as senhas coincidem
  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      formGroup.get('confirmPassword')?.setErrors({ passwordMismatch: true });
    } else {
      formGroup.get('confirmPassword')?.setErrors(null);
    }
  }

  // Getter de conveniência para acesso fácil aos campos do formulário
  get f() {
    return this.registerForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    // Para a validação se o formulário for inválido
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    this.authService
      .register({
        username: this.f['username'].value,
        email: this.f['email'].value,
        password: this.f['password'].value,
      })
      .subscribe({
        next: (resp) => {
          if (resp.errors && resp.errors.length > 0) {
            this.error = resp.errors[0];
          } else {
            this.showPopup = true;
            this.message =
              'Cadastro efetuado com sucesso! \n Valide sua conta antes de realizar login atravez do link enviado para o email:' +
              resp.data.email;
          }
          this.loading = false;
        },
        error: (error) => {
          this.error = error;
          this.loading = false;
        },
      });
  }
}
