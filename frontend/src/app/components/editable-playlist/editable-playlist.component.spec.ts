import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditablePlaylistComponent } from './editable-playlist.component';

describe('EditablePlaylistComponent', () => {
  let component: EditablePlaylistComponent;
  let fixture: ComponentFixture<EditablePlaylistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditablePlaylistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditablePlaylistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
