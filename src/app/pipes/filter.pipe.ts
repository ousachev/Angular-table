import {Pipe, PipeTransform} from '@angular/core';
import {ExtendedPost} from "../services/get.service";

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(posts: ExtendedPost[], search: string = ''): ExtendedPost[] {
    if (!search.trim()) {
      return posts
    }
    return posts.filter(post => post.text.toLowerCase().includes(search.trim().toLowerCase()))
  }
}
