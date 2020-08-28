import { map, take, tap } from 'rxjs/operators';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '@app/core/services/auth/auth.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.checkIfUserAlreadyIn();
  }

  private checkIfUserAlreadyIn(): void {
    this.authService.user$.pipe(
      take(1),
      map(user => Boolean(user)),
      tap(loggedIn => {
        if (!loggedIn) {
          this.router.navigate(['/login']);
        }
      })
    );
  }
}
