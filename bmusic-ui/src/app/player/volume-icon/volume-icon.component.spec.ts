import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VolumeIconComponent } from './volume-icon.component';

describe('VolumeIconComponent', () => {
  let component: VolumeIconComponent;
  let fixture: ComponentFixture<VolumeIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VolumeIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VolumeIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
