import { Component, OnInit } from '@angular/core';
import { NgForOf } from '@angular/common';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  public label: string;
  public email: string;
  public isResponse = false;
  public isPasswordMatched = false;
  public isEmailExist = false;
  public usersEmail: string[] = [];
  constructor(public authService: AuthService, private router: Router) { }

  async ngOnInit() {
    const Users = await this.authService.getUsersEmail();
    Users.forEach(e => {
      this.usersEmail.push(e.email);
    });
  }

  onEmailCheck(email: string, a: any) {
    this.isEmailExist = false;
    if (this.usersEmail.includes(email.toLowerCase())) {
      this.isEmailExist = true;
    }
  }

  onConfirmPassword(confirmPassword: string, password: any) {
    this.isPasswordMatched = false;
    if (password === confirmPassword) {
      this.isPasswordMatched = true;
    }
  }

  async onSignup(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.email = form.value.email;
    const response = await this.authService.createUser(form.value.name, this.email.toLowerCase(), form.value.password);
    this.isResponse = true;
    if (response === 'Success') {
      this.label = 'Registration Completed Successfully';
    } else {
      this.label = 'Registration Failed';
    }
  }
  redirect() {
    this.router.navigate(['login']);
  }
}
