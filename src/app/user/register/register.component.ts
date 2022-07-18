import { Component, OnChanges, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore/';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/compat/firestore';

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
    email: new FormControl('', [Validators.required, Validators.email]),
    age: new FormControl('', [
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
  });

  constructor(
    private auth: AngularFireAuth,
    private db: AngularFirestoreModule,
    private db2: AngularFirestore
  ) {
    console.log(this.registerForm.controls.age.errors?.min);
  }

  async register() {
    this.showAlert = true;
    this.alertMsg = 'You have registed successfully';
    this.alertColor = 'blue';

    try {
      const { email, password } = this.registerForm.value;
      const userCard = await this.auth.createUserWithEmailAndPassword(
        email as string,
        password as string
      );
      console.log(this.registerForm.controls.name);

     await this.db2.collection('users').add({
        name: this.registerForm.controls.name.value,
        email: this.registerForm.controls.email.value,
        age: this.registerForm.controls.age.value,
        phoneNumber: this.registerForm.controls.phoneNumber.value,
      });
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
