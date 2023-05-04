import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent {
  constructor(private router: Router) {}

  searchTrack(searchText: string) {
    if (searchText) {
      this.router.navigateByUrl('search/' + searchText);
    }
  }
}
