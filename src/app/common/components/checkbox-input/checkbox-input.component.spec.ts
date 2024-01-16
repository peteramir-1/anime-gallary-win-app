import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsSelectComponent } from './checkbox-input.component';

describe('SettingsSelectComponent', () => {
  let component: SettingsSelectComponent;
  let fixture: ComponentFixture<SettingsSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettingsSelectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingsSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
