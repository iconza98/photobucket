import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  MatInputModule,
  MatCardModule,
  MatButtonModule,
  MatToolbarModule,
  MatExpansionModule,
  MatProgressSpinnerModule,
  MatDividerModule, MatGridListModule,
} from '@angular/material';

import { AppComponent } from './app.component';
import { PhotosCreateComponent } from './photo/photos-create/photos-create.component';
import { HeaderComponent } from './header/header.component';
import { PhotosListComponent } from './photo/photos-list/photos-list.component';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './auth/login/login.component';
import { SignUpComponent } from './auth/signup/signup.component';
import { ProfileViewComponent } from './profile/profile-view/profile-view.component';
import { AuthInterceptor } from './auth/auth-interceptor';
import { ErrorInterceptor } from './error-interceptor';
import { ProfileEditComponent } from './profile/profile-edit/profile-edit.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    PhotosCreateComponent,
    PhotosListComponent,
    LoginComponent,
    SignUpComponent,
    PhotosCreateComponent,
    ProfileViewComponent,
    ProfileEditComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatDividerModule,
    MatGridListModule,
    MatProgressSpinnerModule,
    HttpClientModule,
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
