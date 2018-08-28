import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Photo } from '../photo.model';
import { PhotoService } from '../photo.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './photos-list.component.html',
  styleUrls: ['./photos-list.component.css']
})
export class PhotosListComponent implements OnInit, OnDestroy {
  photos: Photo[] = [];
  isLoading = false;
  isAuthenticated = false;
  private photosSubscription: Subscription;
  private authStatusSubscription: Subscription;
  constructor(public photosService: PhotoService, private authService: AuthService) {}

  ngOnInit() {
    this.isLoading = true;
    this.photosService.getPhotos();
    this.photosSubscription = this.photosService.getPhotosUpdateListener().subscribe((posts: Photo[]) => {
        this.isLoading = false;
        this.photos = posts;
    });
    console.log(this.photos);
    this.isAuthenticated = this.authService.getIsAuthenticated();
    this.authStatusSubscription = this.authService.getAuthStatusListener().subscribe(userIsAuthenticated => {
      this.isAuthenticated = userIsAuthenticated;
    });
  }

  onDelete(id: string ) {
    this.photosService.deletePhoto(id);
  }

  ngOnDestroy() {
    this.photosSubscription.unsubscribe();
    this.authStatusSubscription.unsubscribe();
  }
}
