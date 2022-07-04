import { Component, OnChanges, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnChanges{
  registerForm = new FormGroup({
    name: new FormControl('', [Validators.required,
    Validators.minLength(3)]),
    email: new FormControl('',[
      Validators.required,
      Validators.email
    ]),
    age: new FormControl('',[
      Validators.required,
      Validators.min(18),
      Validators.max(120)
    ]),
    password: new FormControl('',[
      Validators.required,
      Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm), ]),
    confirmPassword: new FormControl('',[
      Validators.required
    ]),
    phoneNumber: new FormControl(''),
  });



  constructor(){

    console.log(this.registerForm.controls.age.errors?.min);
  }

  ngOnChanges()	{
  //  console.log(this.registerForm.controls.age.errors?.min);


  }

 
  
}
