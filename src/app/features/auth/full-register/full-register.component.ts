import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  AbstractControlOptions,
  ReactiveFormsModule,
} from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../../../core/auth/services/auth.service";
import { CommonModule } from "@angular/common";
// /import { cpfValidator } from "../../../shared/validators/cpf.validator";

@Component({
  selector: "app-complete-register",
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./full-register.component.html",
  styleUrls: ["./full-register.component.scss"],
})
export class FullRegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  error = "";

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.registerForm = this.formBuilder.group(
      {
        personType: ["NATURAL", Validators.required],
        fullName: ["", Validators.required],

        // Pessoa Física
        //ssn: ["", [Validators.required, cpfValidator]],
        ssn: ["", [Validators.required]],
        birthDate: ["", Validators.required],
        gender: ["", Validators.required],
        nationality: ["", Validators.required],
        maritalStatus: ["", Validators.required],
        professionalOccupation: ["", Validators.required],

        // Pessoa Jurídica
        tradeName: [""],
        ein: [""],
        stateRegistration: [""],
        municipalRegistration: [""],
        foundationDate: [""],
        companySize: [""],
        legalNature: [""],
        primaryActivity: [""],
        secondaryActivities: [""],

        // Endereços (FormArray)
        addresses: this.formBuilder.array([this.createAddressFormGroup()]),

        // Contatos (FormArray)
        contacts: this.formBuilder.array([this.createContactFormGroup()]),

        // Dados de usuário
        email: ["", [Validators.required, Validators.email]],
        password: ["", [Validators.required, Validators.minLength(6)]],
        confirmPassword: ["", Validators.required],
      },
      {
        // validator: passwordMatchValidator("password", "confirmPassword"),
      } as AbstractControlOptions
    );
  }

  ngOnInit(): void {
    this.onPersonTypeChange();
  }

  // Convenience getter para acessar os controles do formulário
  get f() {
    return this.registerForm.controls;
  }

  // Getter para acessar o FormArray de endereços
  get addresses(): FormArray<FormGroup> {
    return this.registerForm.get("addresses") as FormArray;
  }

  // Getter para acessar o FormArray de contatos
  get contacts(): FormArray<FormGroup> {
    return this.registerForm.get("contacts") as FormArray;
  }

  // Cria um grupo de formulário para endereço
  createAddressFormGroup(): FormGroup {
    return this.formBuilder.group({
      zipCode: [""],
      addressType: ["RESIDENTIAL"],
      street: [""],
      number: [""],
      complement: [""],
      neighborhood: [""],
      city: [""],
      state: [""],
    });
  }

  // Cria um grupo de formulário para contato
  createContactFormGroup(): FormGroup {
    return this.formBuilder.group({
      contactType: ["PHONE"],
      value: [""],
      description: [""],
    });
  }

  // Adiciona um novo endereço
  addAddress(): void {
    this.addresses.push(this.createAddressFormGroup());
  }

  // Remove um endereço
  removeAddress(index: number): void {
    if (this.addresses.length > 1) {
      this.addresses.removeAt(index);
    }
  }

  // Adiciona um novo contato
  addContact(): void {
    this.contacts.push(this.createContactFormGroup());
  }

  // Remove um contato
  removeContact(index: number): void {
    if (this.contacts.length > 1) {
      this.contacts.removeAt(index);
    }
  }

  // Altera a validação quando o tipo de pessoa muda
  onPersonTypeChange(): void {
    const isNaturalPerson =
      this.registerForm.get("personType")?.value === "NATURAL";

    // Ativa/desativa validadores para campos de pessoa física
    const naturalPersonFields = [
      "ssn",
      "birthDate",
      "gender",
      "nationality",
      "maritalStatus",
      "professionalOccupation",
    ];
    naturalPersonFields.forEach((field) => {
      const control = this.registerForm.get(field);
      if (isNaturalPerson) {
        control?.setValidators([Validators.required]);
      } else {
        control?.clearValidators();
      }
      control?.updateValueAndValidity();
    });

    // Ativa/desativa validadores para campos de pessoa jurídica
    const legalPersonFields = [
      "tradeName",
      "ein",
      "stateRegistration",
      "municipalRegistration",
    ];
    legalPersonFields.forEach((field) => {
      const control = this.registerForm.get(field);
      if (!isNaturalPerson) {
        control?.setValidators([Validators.required]);
      } else {
        control?.clearValidators();
      }
      control?.updateValueAndValidity();
    });
  }

  onSubmit(): void {
    this.submitted = true;

    // Validação do formulário
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;

    // Prepara os dados para envio
    const formData = this.registerForm.value;
    const requestData = {
      personType: formData.personType,
      fullName: formData.fullName,
      addresses: formData.addresses,
      contacts: formData.contacts,
      user: {
        email: formData.email,
        password: formData.password,
      },
      ...(formData.personType === "NATURAL"
        ? {
            ssn: formData.ssn,
            birthDate: formData.birthDate,
            gender: formData.gender,
            nationality: formData.nationality,
            maritalStatus: formData.maritalStatus,
            professionalOccupation: formData.professionalOccupation,
          }
        : {
            tradeName: formData.tradeName,
            ein: formData.ein,
            stateRegistration: formData.stateRegistration,
            municipalRegistration: formData.municipalRegistration,
            foundationDate: formData.foundationDate,
            companySize: formData.companySize,
            legalNature: formData.legalNature,
            primaryActivity: formData.primaryActivity,
            secondaryActivities: formData.secondaryActivities,
          }),
    };

    // Chama o serviço de registro
    /*     this.authService.completeRegister(requestData).subscribe({
      next: () => {
        this.router.navigate(["/registration-success"]);
      },
      error: (error) => {
        this.error = error.message || "Ocorreu um erro durante o cadastro";
        this.loading = false;
      },
    }); */
  }
}
