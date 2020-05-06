import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class PostService {
    private posts: Post[] = [];
    private postUpdate = new Subject<Post[]>();

    constructor(private httpClient: HttpClient) {

    }

    getPosts() {
        this.httpClient
            .get<{ message: string, posts: any[] }>('http://localhost:3000/api/posts')
            .pipe(map((data => {
                return data.posts.map(p => {
                    return {
                        title: p.title,
                        content: p.content,
                        id: p._id,
                        createrName: p.createrName,
                        createrId: p.createrId
                    };
                });
            })))
            .subscribe((data) => {
                this.posts = data;
                this.postUpdate.next([...this.posts]);
            });
    }

    getPostUpdate() {
        return this.postUpdate.asObservable();
    }

    getPostById(id: string) {
        return { ...this.posts.find(p => p.id === id) };
    }

    addPost(title: string, content: string) {
        const post: Post = {
            id: null,
            title,
            content,
            createrName: null,
            createrId: null
        };
        this.httpClient.post<{ message: string }>('http://localhost:3000/api/posts', post)
            .subscribe((res) => {
                console.log(res.message);
                this.getPosts();
            });
    }
    updatePost(id: string, title: string, content: string) {
        const post: Post = {
            id,
            title,
            content,
            createrName: null,
            createrId: null
        };
        this.httpClient.put<{ message: string }>('http://localhost:3000/api/posts/' + id, post)
            .subscribe((res) => {
                console.log(res.message);
                this.getPosts();
            });
    }
    deletePost(id: string) {
        this.httpClient.delete('http://localhost:3000/api/posts/' + id)
            .subscribe(() => {
                const updatedPosts = this.posts.filter(post => post.id !== id);
                this.posts = updatedPosts;
                this.postUpdate.next([...this.posts]);
            });
    }
}
