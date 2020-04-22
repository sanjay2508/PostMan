import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { NgForm } from '@angular/forms';
import { PostService } from '../post.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})

export class PostCreateComponent implements OnInit {

  post: Post;
  isLoading = false;
  private mode = 'create';
  private id: string;

  constructor(public postService: PostService, public route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.isLoading = true;
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.isLoading = false;
      if (paramMap.has('id')) {
        this.mode = 'edit';
        this.id = paramMap.get('id');
        this.post = this.postService.getPostById(this.id);
      } else {
        this.mode = 'create';
        this.id = null;
      }
    });
  }

  onSavePost(form: NgForm) {
    /* if (form.invalid) {
      return;
    } */
    if (this.mode === 'create') {
      this.postService.addPost(form.value.title, form.value.content);
    } else {
      this.postService.updatePost(this.id, form.value.title, form.value.content);
    }
    form.resetForm();
    this.router.navigate(['/']);
  }
}
