import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { Profile } from '../profile.model';


@Component({
  templateUrl: './profile-edit.component.html',
  selector: 'app-profile-edit',
  styleUrls: ['./profile-edit.component.css']
})
export class ProfileEditComponent implements OnInit {

 private userId: string;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.userId = this.authService.getUserId();
  }


  onEditProfile(form: NgForm) {
    if (form.invalid) { return; }
    this.authService.updateUser(this.userId, form.value.firstName, form.value.email, form.value.password);
    this.router.navigate(['/profile']);
  }
}

