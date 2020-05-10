import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public loginStatus: string;
  public isAuthentic = true;
  constructor(public authService: AuthService, public router: Router) { }

  ngOnInit() {
  }

  async onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isAuthentic = true;
    const response = await this.authService.login(form.value.email.toLowerCase(), form.value.password);
    if (response.Status === 'Failed') {
      this.isAuthentic = false;
      this.loginStatus = response.message;
    }
    this.router.navigate(['post']);
  }
  onForgotPassword() {
    this.router.navigate(['forgotPassword']);
  }

}
