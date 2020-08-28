import {AfterViewInit, Component} from '@angular/core';
import { map, take, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

import {AuthService, User} from '@app/core/services/auth/auth.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.checkIfUserAlreadyIn();
  }

  ngAfterViewInit(): void {
  }

  private async checkIfUserAlreadyIn(): Promise<void> {
    const user: User = await this.authService.getUser();

    if (user) {
      this.router.navigate(['/home']);
    }
  }
}
