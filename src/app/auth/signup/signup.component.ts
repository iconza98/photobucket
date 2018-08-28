import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignUpComponent implements OnInit, OnDestroy {

  isLoading = false;
  private authStatusSubscriber: Subscription;

  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.authStatusSubscriber = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
  }

  onSignup(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.createUser(form.value.firstName, form.value.email, form.value.password);
  }

  ngOnDestroy() {
    this.authStatusSubscriber.unsubscribe();
  }
}
