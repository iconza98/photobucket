import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Profile } from '../profile.model';


@Component({
  templateUrl: './profile-view.component.html',
  selector: 'app-profile-view',
  styleUrls: ['./profile-view.component.css']
})
export class ProfileViewComponent implements OnInit {

  userId: string;
  firstName: string;
  email: string;
  password =  '*************';

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.userId = this.authService.getUserId();
    this.authService.getUser(this.userId).subscribe((response) => {
          this.firstName = response.firstName;
          this.email = response.email;
    });

  }
}

