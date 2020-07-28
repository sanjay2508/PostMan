import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.css']
})
export class UserprofileComponent implements OnInit {

  userInfo: any;
  userId: any;

  constructor(private activatedRoute: ActivatedRoute, private userService: UserService) { }

  async ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.userId = params.userId;
      console.log(this.userId);
    });
    this.userInfo = await this.userService.getUserInfo(this.userId);
    console.log(this.userInfo);
  }
}
