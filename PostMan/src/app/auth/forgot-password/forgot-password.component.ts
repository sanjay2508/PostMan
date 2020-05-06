import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  public message: string;
  status = false;
  isLoading = false;
  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  async onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.isLoading = true;
    const res: any = await this.authService.changePassword(form.value.email);
    this.isLoading = false;
    this.status = true;
    this.message = 'Password sent to email ' + form.value.email;
    if (res.status === 'true') {

    }
  }

}
