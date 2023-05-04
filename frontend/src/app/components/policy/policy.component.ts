import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-policy',
  templateUrl: './policy.component.html',
  styleUrls: ['./policy.component.css'],
})
export class PolicyComponent {
  constructor(private router: Router) {}

  skipPolicy() {
    this.router.navigateByUrl('policy');
  }
}
