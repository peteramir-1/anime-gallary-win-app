import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnOffInputComponent } from './on-off-input.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('OnOffInputComponent', () => {
  let component: OnOffInputComponent;
  let fixture: ComponentFixture<OnOffInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule],
      declarations: [OnOffInputComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OnOffInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#toogle() should toggle #value', () => {
    expect(component.value).toBe(false);
    component.toggle();
    expect(component.value).toBe(true);
    component.toggle();
    expect(component.value).toBe(false);
  });
});
