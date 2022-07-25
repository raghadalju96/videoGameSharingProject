import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  showAlert:boolean = false
  alertColor:string = 'blue'
  alertMsg:string = 'you have loged successfully'
  inSubmission:boolean = false


  credentials = {
    email :'',
    password: ''
  }
  constructor(private auth:AngularFireAuth) { }

  ngOnInit(): void {
  }

 async login(){

    this.showAlert = true
    this.alertColor = 'blue'
    this.alertMsg = 'Please Wait! We are logging you in.'
    this.inSubmission = true
    console.log("login successuflly");

    try{
      await this.auth.signInWithEmailAndPassword(
        this.credentials.email,this.credentials.password
      )
    }
    catch(e){
     this.inSubmission =false
     this.alertColor = 'red'
     this.alertMsg = 'An unexpected error occurred. Please try again later'
     console.log(e);
     
      return 
    }
    this.alertColor = 'green'
    this.alertMsg = 'Success! You are now logged in.'
    
  }

}
