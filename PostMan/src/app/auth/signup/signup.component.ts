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
  public isResponse = false;
  constructor(public authService: AuthService, private router: Router) { }

  ngOnInit() {
  }

  async onSignup(form: NgForm) {
    if (form.invalid) {
      return;
    }
    const response = await this.authService.createUser(form.value.name, form.value.email, form.value.password);
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
