import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { PostService } from '../post.service';
import { Post } from '../post.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

  posts: Post[] = [];
  isLoading = false;
  private postSub: Subscription;

  constructor(public postService: PostService) {
  }

  ngOnInit() {
    this.isLoading = true;
    this.postService.getPosts();
    this.postSub = this.postService.getPostUpdate()
      .subscribe((data: Post[]) => {
        this.isLoading = false;
        this.posts = data;
      });
  }

  onDelete(postId: string) {
    this.postService.deletePost(postId);
  }

  onEdit() {

  }
  ngOnDestroy() {
    this.postSub.unsubscribe();
  }

}
