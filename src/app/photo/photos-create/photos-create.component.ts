import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { PhotoService } from '../photo.service';
import { Photo } from '../photo.model';
import { mimeType } from './mime-type.validator';

@Component({
  templateUrl: './photos-create.component.html',
  selector: 'app-post-create',
  styleUrls: ['./photos-create.component.css']
})
export class PhotosCreateComponent implements OnInit {
  isLoading = false;
  photo: Photo;
  imageForm: FormGroup;
  imagePreview: String | ArrayBuffer;
  private mode = 'create';
  private photoId: string;

  constructor(public photoService: PhotoService, public route: ActivatedRoute) {}

  ngOnInit() {

    this.imageForm = new FormGroup({
      image: new FormControl( null, { validators: [Validators.required], asyncValidators: [mimeType]})
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if ( paramMap.has('postId')) {
        this.mode = 'edit';
        this.photoId = paramMap.get('postId');
        // start spinner
        this.isLoading = true;
        this.photoService
          .getPhoto(this.photoId)
          .subscribe(photoData => {
            // stop spinner
            this.isLoading = false;
            this.photo = {
              id: photoData._id,
              imagePath: photoData.imagePath
            };
            this.imageForm.setValue({
              'image': this.photo.imagePath
            });
          });
      } else {
        this.mode = 'create';
        this.photoId = null;
      }
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.imageForm.patchValue({image : file});
    const fileReader = new FileReader();
    fileReader.onload = () => {
      this.imagePreview = fileReader.result;
    };
    fileReader.readAsDataURL(file);
    this.imageForm.get('image').updateValueAndValidity();
  }

  onSavePost() {
    console.log('SAVING POST HIT');
    if ( this.imageForm.invalid) { return; }
    // start spinner
    this.isLoading = true;
    if ( this.mode === 'create' ) {
      this.photoService.addPost(this.imageForm.value.title, this.imageForm.value.content, this.imageForm.value.image);
    } else {
      this.photoService.updatePhoto(
        this.photoId,
        this.imageForm.value.image
      );
    }
    this.imageForm.reset();
  }
}

