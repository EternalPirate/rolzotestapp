import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService, User } from '@app/core/services/auth/auth.service';


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

  /**
   * Check if user already in, and if so then redirect him to home page
   */
  private async checkIfUserAlreadyIn(): Promise<void> {
    const user: User = await this.authService.getUser();

    if (user) {
      await this.router.navigate(['/home']);
    }
  }
}
