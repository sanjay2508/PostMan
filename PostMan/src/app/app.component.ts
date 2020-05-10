import { Component } from '@angular/core';
import { Post } from './posts/post.model';
import { AuthService } from './auth/auth.service';
import { setTheme } from 'ngx-bootstrap/utils';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'PostMan';
  constructor(private authService: AuthService) {
    this.authService.autoAuthUser();
    setTheme('bs3');
  }
}
