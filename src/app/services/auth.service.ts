import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import IUser from '../models/user.model';
import {delay, map, Observable} from 'rxjs'
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private usersCollection: AngularFirestoreCollection<IUser>;
  public isAuthenticated$: Observable<Boolean>
  public isAuthenticatedWithDelay$: Observable<Boolean>
  
  constructor(private auth: AngularFireAuth, private db: AngularFirestore, private router:Router){
    this.usersCollection = db.collection('users')
    this.isAuthenticated$ = auth.user.pipe(
      map(user => !!user)
    )
    this.isAuthenticatedWithDelay$ = this.isAuthenticated$.pipe(
      delay(1000)
    )
    auth.user.subscribe(console.log)
    
  }


  public async createUser(userData: IUser) {
    const userCard = await this.auth.createUserWithEmailAndPassword(
      userData.email as string,
      userData.password as string
    );

    if (!userData.password) {
      throw new Error('password not provided');
    }

    if(!userCard.user){
      throw new Error ('User can not be found')
    }

    await this.usersCollection.doc(userCard.user?.uid).set({
      name: userData.name,
      email: userData.email,
      age: userData.age,
      phoneNumber: userData.phoneNumber,
    });


    await userCard.user.updateProfile({
      displayName:userData.name
    })
  }

 public async logout(event?:Event){
  if(event){
    event.preventDefault()
  }
    await this.auth.signOut()
    await this.router.navigateByUrl('/')
  }
}
