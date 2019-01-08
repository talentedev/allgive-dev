import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase';
import { Observable } from '../../node_modules/rxjs';
import { PaymentsService } from './payments.service';

@Injectable()
export class AuthService {

  stripeCustomer;
  apiUrl: string = 'http://localhost:3000';

  authState: any = null;

  constructor(
    private afAuth: AngularFireAuth,
    private http: HttpClient,
    private router: Router,
    private db: AngularFireDatabase,
    private pmt: PaymentsService
  ) {
    this.afAuth.authState.subscribe((auth) => {
      this.authState = auth;
    });
  }

  // Returns true if user is authenticated
  isAuthenticated(): boolean {
    return this.authState !== null;
  }

  // Returns current user data
  currentUser(): any {
    return this.isAuthenticated ? this.authState : null;
  }

  // Returns observable with current user data
  currentUserObservable(): any {
    return this.afAuth.authState;
  }

  // Returns current user UID
  currentUserId(): string {
    return this.isAuthenticated ? this.authState.uid : '';
  }

  currentUserDisplayName(): string {
    if (!this.authState) { return '' }
    else { return this.authState['displayName'] || 'Current User' }
  }

  currentDbUser(): any {
    let id = this.currentUserId();
    return this.db.list('/users', ref => ref.orderByChild('authId')).query.equalTo(id);
  }

  // Email & Password Auth //

  // Create Stripe customer
  createStripeCustomer(email): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/customer', email);
  }

  // Sign up
  emailSignUp(firstName: string, lastName: string, email: string, password: string) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then((user) => {

        // Write user's name and email to Firebase auth
        this.authState = user;
        let authUser = this.afAuth.auth.currentUser;

        let fullName = firstName + ' ' + lastName;

        // Create Stripe customer
        this.createStripeCustomer(email)
          .subscribe(result => {

            const customer = result;
            // Write user's info to db
            const usersRef = this.db.list('users');
            usersRef.push({
              authId: authUser.uid,
              email: authUser.email,
              firstName: firstName,
              lastName: lastName,
              fullName: fullName,
            })
              .then(function (newUserRef) {
                // Write user's id to customer ref in db
                console.log(newUserRef);
                const updates = {};
                updates[`/customers/${customer.id}/authId`] = authUser.uid;
                updates[`/users/${newUserRef.key}/customerId`] = customer.id;
                firebase.database().ref().update(updates);
              });
          });


      })
      .catch(error => console.log(error));
  }


  // Log in with email
  emailLogin(email: string, password: string) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then((user) => {
        this.authState = user;
      })
      .catch(error => console.log(error));
  }

  // Reset password
  resetPassword(email: string) {
    let auth = firebase.auth();

    return auth.sendPasswordResetEmail(email)
      .then(() => console.log('email sent'))
      .catch((error) => console.log(error));
  }

  // Sign out
  signOut(): void {
    this.afAuth.auth.signOut();
    this.router.navigate(['/main']);
  }

}
