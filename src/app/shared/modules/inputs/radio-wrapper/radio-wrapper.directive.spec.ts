import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadioWrapperDirective } from './radio-wrapper.directive';

describe('RadioWrapperDirective', () => {
  let component: RadioWrapperDirective;
  let fixture: ComponentFixture<RadioWrapperDirective>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RadioWrapperDirective ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RadioWrapperDirective);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
