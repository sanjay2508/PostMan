import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css']
})
export class FriendsComponent implements OnInit {
  public friends: string[] = [];
  constructor(public authService: AuthService, private router: Router, private userService: UserService) { }

  async ngOnInit() {
    const userInfo = await this.userService.getLoggedInUserInfo();
    this.friends = userInfo.friends;
  }

  onFriendSelect() {
    alert('hi');
  }
}
