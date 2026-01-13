import { CUSTOM_ELEMENTS_SCHEMA, ChangeDetectionStrategy, Component, DebugElement, ViewChild } from '@angular/core';
import { InputDirective } from './input.directive';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { InputModule } from './inputs.module';

@Component({
    selector: 'test-element',
    template: `<input type="text" [appInput] />`,
    standalone: false
})
class testComponent {
  @ViewChild(InputDirective) directive: InputDirective;
  constructor() {}
}

describe('InputDirective', () => {
  let fixture: ComponentFixture<testComponent>;
  let component: testComponent;
  let element: DebugElement;

  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [testComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [CommonModule, InputModule],
    })
      .overrideComponent(testComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();

    fixture = TestBed.createComponent(testComponent);
    component = fixture.componentInstance;
    fixture.autoDetectChanges();
    fixture.detectChanges();
    element = fixture.debugElement.children[0];
  });

  it('should create component successfully', () => {
    expect(component).toBeTruthy();
  });
});
