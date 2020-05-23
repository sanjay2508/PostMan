import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';
import { LoggedUserInfo } from 'src/app/auth/loggedUserInfo';

@Component({
  selector: 'app-friendrequest',
  templateUrl: './friendrequest.component.html',
  styleUrls: ['./friendrequest.component.css']
})
export class FriendrequestComponent implements OnInit {

  private userInfo: LoggedUserInfo;
  public friendRequest: string[] = [];
  selectedOptions: any;
  message: string;

  constructor(public authService: AuthService, private router: Router) { }

  async ngOnInit() {

    this.userInfo = this.authService.getLoggedUserInfo();
    this.friendRequest = this.userInfo.friendsRequest;
    if (this.friendRequest.length === 0) {
      this.message = 'No Friend Request';
    } else { this.message = null; }
  }
  onAcceptRequest(list) {
    this.selectedOptions = list.selectedOptions.selected.map(item => item.value);
    console.log(this.selectedOptions);
    const res = this.authService.acceptFriendRequest(this.selectedOptions, this.userInfo.email);
    this.userInfo = this.authService.getLoggedUserInfo();
    this.message = 'Request Accepted Successfully';
  }
}
