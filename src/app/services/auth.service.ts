import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import IUser from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private usersCollection!: AngularFirestoreCollection<IUser>;
  
  constructor(private auth: AngularFireAuth, private db: AngularFirestore) {}

  public async createUser(userData: IUser) {
    const userCard = await this.auth.createUserWithEmailAndPassword(
      userData.email as string,
      userData.password as string
    );

    if (!userData.password) {
      throw new Error('password not provided');
    }

    await this.usersCollection.add({
      name: userData.name,
      email: userData.email,
      age: userData.age,
      phoneNumber: userData.phoneNumber,
    });
  }
}
