import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Photo } from './photo.model';

@Injectable({providedIn: 'root'})
export class PhotoService {
  private photos: Photo[] = [];
  private photosUpdated = new Subject<Photo[]>();

  constructor(private httpClient: HttpClient, private router: Router) {}

  getPhotos() {
    this.httpClient
    .get<{message: string, photos: any}>('http://localhost:3000/api/photo')
    .pipe(map((photoData) => {
      return photoData.photos.map(createdPhoto => {
        return {
          id: createdPhoto._id,
          imagePath: createdPhoto.imagePath
        };
      });
    }))
    .subscribe((transformedPhoto => {
      this.photos = transformedPhoto;
      this.photosUpdated.next([...this.photos]);
    }));
  }

  getPhoto(id: string) {
    return this.httpClient.get<{_id: string, imagePath: string}>('http://localhost:3000/api/photo/' + id);
  }

  getPhotosUpdateListener() {
    return this.photosUpdated.asObservable();
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);

    this.httpClient
    .post<{message: string, post: Photo }>('http://localhost:3000/api/photo', postData)
    .subscribe((responseData) => {
      const createdPost: Photo = {
        id: responseData.post.id,
        imagePath: responseData.post.imagePath
      };
      const postId = responseData.post.id;
      createdPost.id = postId;
      this.photos.push(createdPost);
      this.photosUpdated.next([...this.photos]);
      this.router.navigate(['/']);
    });
  }

  updatePhoto(id: string, image: File | string) {
    let photoData: Photo | FormData;
    if (typeof image === 'object') {
      photoData = new FormData();
      photoData.append('id', id);
      photoData.append('image', image);

    } else {
      photoData = { id: id, imagePath: image};
    }
    this.httpClient
      .put('http://localhost:3000/api/photo/' + id, photoData)
      .subscribe( response => {
        const updatedPosts = [...this.photos];
        const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
        const createdPost: Photo = {
          id: id,
          imagePath: ''
        };
        updatedPosts[oldPostIndex] = createdPost;
        this.photos = updatedPosts;
        this.photosUpdated.next([...this.photos]);
        this.router.navigate(['/']);
      });

  }

  deletePhoto(postId: string) {
    this.httpClient
    .delete('http://localhost:3000/api/photo/' + postId)
    .subscribe(() => {
      const updatedPosts = this.photos.filter(p => p.id !== postId);
      this.photos = updatedPosts;
      this.photosUpdated.next([...this.photos]);
    });
  }

}

