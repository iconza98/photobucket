import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private authListenerSubscription: Subscription;
  isAuthenticated = false;

  constructor(private authService: AuthService) {}

  onLogout() {
    this.authService.logout();
  }

  ngOnInit() {
    this.isAuthenticated = this.authService.getIsAuthenticated();
    this.authListenerSubscription = this.authService.getAuthStatusListener().subscribe( userIsAuthenticated => {
      this.isAuthenticated = userIsAuthenticated;
    });
  }

  ngOnDestroy() {
    this.authListenerSubscription.unsubscribe();
  }
}
