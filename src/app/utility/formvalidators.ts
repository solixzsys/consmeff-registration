import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function passwordValidator(passw: string): ValidatorFn {

  return (control: AbstractControl): { [key: string]: any } | null => {
      const equal = passw===control.value;
      return equal ?  null : { 'passwordQuality': { value: control.value } };
  }
}
export function passwordComplexity(): ValidationErrors | null {
  return (control: AbstractControl): ValidationErrors | null => {
    // Password validation logic
    if (control.value) {
      const hasUpperCase = /[A-Z]/.test(control.value);
      const hasLowerCase = /[a-z]/.test(control.value);
      const hasNumber = /\d/.test(control.value);
      const hasSymbol = /\W/.test(control.value) && !/\s/.test(control.value);
      const minimumLength = 8;

      if (
        control.value.length < minimumLength ||
        !hasUpperCase ||
        !hasLowerCase ||
        !hasNumber ||
        !hasSymbol
      ) {
        return {
          password: {
            message:
              'Password must be at least 8 characters and include uppercase, lowercase, number, and symbol (excluding whitespace)',
          },
        };
      }
    }
    return null;
  };
}
export function passwordStrength(): ValidatorFn {

  return (control: AbstractControl): { [key: string]: any } | null => {
    let password: string=control.value;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSymbol = /\W/.test(password) && !/\s/.test(password); // Exclude whitespace

    const minimumLength = 8;

    const equal=
      password.length >= minimumLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumber &&
      hasSymbol

      return equal ?  null : { 'passwordStrength': { value: control.value } };
  }
}
export function emailValidator(email: string): ValidatorFn {

  return (control: AbstractControl): { [key: string]: any } | null => {
      const equal = email===control.value;
      return equal ?  null : { 'emailQuality': { value: control.value } };
  }
}
