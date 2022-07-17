import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  showAlert:boolean = false
  alertColor:string = 'blue'
  alertMsg:string = 'you have loged successfully'


  credentials = {
    email :'',
    password: ''
  }
  constructor() { }

  ngOnInit(): void {
  }

  login(){

    this.showAlert = true
    this.alertColor = 'blue'
    this.alertMsg = 'you have loged successfully'
    console.log("login successuflly");
    
  }

}
