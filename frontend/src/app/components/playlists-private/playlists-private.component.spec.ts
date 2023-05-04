import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaylistsPrivateComponent } from './playlists-private.component';

describe('PlaylistsPrivateComponent', () => {
  let component: PlaylistsPrivateComponent;
  let fixture: ComponentFixture<PlaylistsPrivateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlaylistsPrivateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlaylistsPrivateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
