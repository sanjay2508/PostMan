import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { LoggedUserInfo } from 'src/app/auth/loggedUserInfo';
import { NgForm } from '@angular/forms';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-friendsearch',
  templateUrl: './friendsearch.component.html',
  styleUrls: ['./friendsearch.component.css']
})
export class FriendsearchComponent implements OnInit {

  public usersEmail: string[] = [];
  public searchUsers: string[] = [];
  selectedOptions: string;
  message: string;
  isRequest = true;
  private userInfo: LoggedUserInfo;



  constructor(public authService: AuthService, private router: Router) { }

  async ngOnInit() {
    const Users = await this.authService.getUsersEmail();
    this.userInfo = this.authService.getLoggedUserInfo();
    console.log(this.userInfo);
    Users.forEach(e => {
      if (this.userInfo.email !== e.email) {
        this.usersEmail.push(e.email);
      }
    });
    console.log(this.usersEmail);
  }

  onUserSearch(email: string) {
    console.log(email);
    this.selectedOptions = null;
    this.searchUsers = null;
    this.message = null;
    if (email !== '') {
      this.searchUsers = this.usersEmail.filter(v => v.toLowerCase().indexOf(email.toLowerCase()) > -1).slice(0, 10);
    }
  }
  async onRequest() {
    const res = await this.authService.sendFriendRequest(this.userInfo.email, this.selectedOptions);
    this.message = 'request send succesfullly';
    this.isRequest = true;
  }
  onUserListControlChanged(list) {
    this.searchUsers = null;
    this.selectedOptions = list.selectedOptions.selected.map(item => item.value);
    console.log(this.selectedOptions);
    this.isRequest = false;
  }

}
