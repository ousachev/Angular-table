import {Component, OnInit} from '@angular/core';
import {Comment, ExtendedPost, GetService, Post, User} from "../../services/get.service";
import {forkJoin, Subscription} from "rxjs";

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {
  cells = [
    {value: 'author', title: 'Имя пользователя'},
    {value: 'city', title: ' Название города'},
    {value: 'title', title: 'Название публикации'},
    {value: 'comments', title: 'Количество комментариев'}
  ]
  subscriptions: any[] = [];
  users: User[] = []
  posts: Post[] = []
  comments: Comment[] = []
  loading = false
  search: string = ''
  activePost: number = 0
  isModal = false
  filteredPosts: ExtendedPost[] = []
  activeSort: string | undefined
  sortDir: string = 'up'

  constructor(private getService: GetService) {
  }

  ngOnInit(): void {
    this.getData()
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  getData(): Subscription {
    this.subscriptions.push(this.getService.getUsers());
    this.subscriptions.push(this.getService.getPosts());
    return forkJoin(...this.subscriptions).subscribe((data: [User[], Post[]]) => {
      const [users, posts] = data;
      this.users = users;
      this.posts = posts;

      posts.forEach((post: Post): Subscription => {
        return this.getService.getComments(post.id).subscribe((comments: Comment[]) => {
            this.comments = comments;

            this.filteredPosts.push(
              <ExtendedPost>{
                title: post.title,
                text: post.body,
                id: post.id,
                comments,
                author: this.filterUsers(post, this.users)?.username,
                city: this.filterUsers(post, this.users)?.address.city
              });
            this.filteredPosts.length === posts.length ? this.loading = true : null
          }
        )
      })
    })
  }

  filterUsers(post: Post, allUsers: User[]): User | undefined {
    return allUsers.find(user => user.id === post.userId)
  }

  onChange(event: Event) {
    this.search = (event.target as HTMLInputElement).value;
  }

  toggleModal(index?: number): void {
    this.isModal = !this.isModal
    if (index) {
      this.activePost = index
    }
  }

  sortHandler(index: number): ExtendedPost[] {
    const sortValue: string = this.cells[index].value;
    if (this.activeSort === sortValue) {
      this.sortDir === 'up' ? this.sortDir = 'down' : this.sortDir = 'up'
      return this.filteredPosts.reverse();
    }
    this.activeSort = sortValue;
    if (sortValue === 'comments') {
      return this.filteredPosts.sort((a, b) => (a[sortValue].length > b[sortValue].length ? 1 : -1));
    }
    return this.filteredPosts.sort((a, b) => (a[sortValue as keyof ExtendedPost] > b[sortValue as keyof ExtendedPost] ? 1 : -1));
  }


}
