import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '@app-shared/services';

@Component({
  selector: 'app-verify',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './verify.component.html',
  styleUrl: './verify.component.scss',
})
export default class VerifyComponent {
  private readonly authSerivce = inject(AuthService);

  logOut() {
    this.authSerivce.logOut();
  }
}
