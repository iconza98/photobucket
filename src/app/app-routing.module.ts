import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PhotosListComponent } from './photo/photos-list/photos-list.component';
import { PhotosCreateComponent } from './photo/photos-create/photos-create.component';
import { LoginComponent } from './auth/login/login.component';
import { SignUpComponent } from './auth/signup/signup.component';
import { AuthGuard } from './auth/auth.guard';
import { ProfileViewComponent } from './profile/profile-view/profile-view.component';
import { ProfileEditComponent } from './profile/profile-edit/profile-edit.component';

const routes: Routes  = [
  { path: '', component: PhotosListComponent },
  { path: 'create', component: PhotosCreateComponent, canActivate: [AuthGuard] },
  { path: 'edit/:postId', component: PhotosCreateComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignUpComponent },
  { path: 'profile', component: ProfileViewComponent, canActivate: [AuthGuard]},
  { path: 'profile/edit', component: ProfileEditComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {

}
