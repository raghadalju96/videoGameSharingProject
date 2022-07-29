import { Component, OnChanges, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore/';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from 'src/app/services/auth.service';
import IUser from 'src/app/models/user.model';
import { RegisterValidators } from '../validators/register-validators';
import { EmailTaken } from '../validators/email-taken';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  showAlert: boolean = false;
  alertMsg: string = 'You have registed successfully';
  alertColor: string = 'blue';
  inSubmission: boolean = false;

  registerForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email],[this.emailTaken.validate]),
    age: new FormControl<number |null>(null, [
      Validators.required,
      Validators.min(18),
      Validators.max(120),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.pattern(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm
      ),
    ]),
    confirmPassword: new FormControl('', [Validators.required]),
    phoneNumber: new FormControl('', [
      Validators.required,
      Validators.minLength(13),
      Validators.maxLength(13),
    ]),
  },[RegisterValidators.match('password','confirmPassword')]);

  constructor(private auth: AuthService, private emailTaken:EmailTaken) {
    console.log(this.registerForm.controls.age.errors?.min);
  }

  async register() {
    this.showAlert = true;
    this.alertMsg = 'You have registed successfully';
    this.alertColor = 'blue';

    try { this.auth.createUser(this.registerForm.value as IUser)
    } catch (e) {
      console.error(e);
      this.alertMsg = 'unexpected error occurred. please try again';
      this.alertColor = 'red';
      this.inSubmission = true;
      return;
    }
    this.alertMsg = 'Success! Your account has been created';
    this.alertColor = 'green';
    this.inSubmission = false;
  }
}
