import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

export interface ExtendedPost {
  id: number,
  comments: Comment[],
  author: string,
  city: string,
  title: string,
  text: string,
}

export interface Post {
  body: string,
  id: number,
  title: string,
  userId: number,
}

export interface User {
  email: string,
  id: number,
  name: string
  username: string,
  address: {
    city: string;
  };
}

export interface Comment {
  body: string,
  email: string,
  id: number
  name: string,
  postId: number
}


@Injectable({
  providedIn: 'root'
})
export class GetService {

  constructor(private http: HttpClient) {
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>('https://jsonplaceholder.typicode.com/users')
  }

  getPosts(limit: number = 20): Observable<Post[]> {
    return this.http.get<Post[]>(`https://jsonplaceholder.typicode.com/posts?_limit=${limit}`)
  }

  getComments(id: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`https://jsonplaceholder.typicode.com/posts/${id}/comments`)
  }

}
