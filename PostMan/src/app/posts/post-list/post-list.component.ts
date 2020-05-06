import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { PostService } from '../post.service';
import { Post } from '../post.model';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

  posts: Post[] = [];
  isLoading = false;
  userId: string;
  isAuthenticated = false;
  private postSub: Subscription;
  authListenerSubscription: Subscription;

  constructor(public postService: PostService, private authService: AuthService) {
  }

  ngOnInit() {
    this.isLoading = true;
    this.postService.getPosts();
    this.userId = this.authService.getUserId();
    this.postSub = this.postService.getPostUpdate()
      .subscribe((data: Post[]) => {
        this.isLoading = false;
        this.posts = data;
      });
    this.isAuthenticated = this.authService.getIsAuth();
    this.authListenerSubscription = this.authService
            .getAuthStatusListener()
            .subscribe(isAuth => {
                this.isAuthenticated = isAuth;
            });
  }

  onDelete(postId: string) {
    this.postService.deletePost(postId);
  }

  onEdit() {

  }
  ngOnDestroy() {
    this.postSub.unsubscribe();
    this.authListenerSubscription.unsubscribe();
  }

}
