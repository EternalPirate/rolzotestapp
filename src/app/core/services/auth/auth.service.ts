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

    getUser(): Promise<User> {
        return new Promise(resolve => {
            this.user$.subscribe(user => {
                if (user) {
                    resolve(user);
                }
            });
        });
    }

    async googleSignin(): Promise<void> {
        const provider = new auth.GoogleAuthProvider();
        const credential = await this.afAuth.signInWithPopup(provider);
        this.router.navigate(['/home']);
        return this.updateUserData(credential.user);
    }

    private updateUserData(user): Promise<void> {
        // Sets user data to firestore on login
        const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);

        const data = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL
        };

        return userRef.set(data, {merge: true});

    }

    async signOut(): Promise<void> {
        await this.afAuth.signOut();
        this.router.navigate(['/']);
    }
}
