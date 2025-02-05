import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaylistsettingsComponent } from './playlistsettings.component';

describe('PlaylistsettingsComponent', () => {
  let component: PlaylistsettingsComponent;
  let fixture: ComponentFixture<PlaylistsettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlaylistsettingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlaylistsettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
