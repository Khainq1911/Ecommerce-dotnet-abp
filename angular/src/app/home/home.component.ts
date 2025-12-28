import { Component, inject } from '@angular/core';
import { AuthService, LocalizationPipe } from '@abp/ng.core';
import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { FloatLabel } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  providers: [LocalizationPipe],
  imports: [Button, Dialog, FloatLabel, InputTextModule, FormsModule, MessageModule],
})
export class HomeComponent {
  messageService = inject(MessageService);
  private authService = inject(AuthService);
  visible: boolean = false;
  category: { name: string; description?: string } = { name: '' };
  get hasLoggedIn(): boolean {
    return this.authService.isAuthenticated;
  }

  login() {
    this.authService.navigateToLogin();
  }

  showDialog() {
    this.visible = true;
  }

  onSubmit(form: any) {
    if (form.valid) console.log(this.category.name, this.category.description);
  }
}
