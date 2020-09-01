import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { auth } from 'firebase';


export interface User {
  uid: string;
  email: string;
  photoURL?: string;
  displayName?: string;
  myCustomData?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<User>;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router
  ) {
    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => {
        // Logged in
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          // Logged out
          return of(null);
        }
      })
    );
  }

  /**
   * Get current active user
   * @return User promise
   */
  getUser(): Promise<User> {
    return new Promise(resolve => {
      this.user$.subscribe(user => {
        if (user) {
          resolve(user);
        }
      });
    });
  }

  /**
   * Sign in with firebase google auth
   */
  async googleSignIn(): Promise<void> {
    const googleAuthProvider = new auth.GoogleAuthProvider();

    googleAuthProvider.setCustomParameters({
      prompt: 'select_account' // always show select account popup
    });

    const credential = await this.afAuth.signInWithPopup(googleAuthProvider);
    await this.router.navigate(['/home']);
    return this.updateUserData(credential.user);
  }

  /**
   * Update user
   * @param user - user data
   */
  private updateUserData(user: User): Promise<void> {
    // Update user data to firestore on login
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);
    return userRef.set(user, {merge: true});
  }

  /**
   * Firebase auth logout and go to base page
   */
  async signOut(): Promise<void> {
    await this.afAuth.signOut();
    this.router.navigate(['/']);
  }
}
