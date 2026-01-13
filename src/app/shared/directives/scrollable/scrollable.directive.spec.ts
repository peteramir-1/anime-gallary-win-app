import { CommonModule } from '@angular/common';
import {
  Component,
  ViewChild,
  DebugElement,
  CUSTOM_ELEMENTS_SCHEMA,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScrollableDirective } from './scrollable.directive';
import { ScrollableModule } from './scrollable.module';

@Component({
    selector: 'test-element',
    template: `<div [appScrollable]></div>`,
    standalone: false
})
class testComponent {
  @ViewChild(ScrollableDirective) directive: ScrollableDirective;
  constructor() {}
}

describe('ScrollableDirective', () => {
  let fixture: ComponentFixture<testComponent>;
  let component: testComponent;
  let element: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [testComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [CommonModule, ScrollableModule],
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

  it('should create an instance', () => {
    const directive = new ScrollableDirective();
    expect(directive).toBeTruthy();
  });

  describe('padding class', () => {
    it('should be p-8 by default', () => {
      fixture.detectChanges();
      const isPadding8ClassExists = element.classes['px-8'];
      expect(isPadding8ClassExists).toBe(true);
    });

    it('should be p-20 then change it to p-12', () => {
      component.directive.paddingX = 20;
      fixture.detectChanges();

      const isPadding20ClassExists = element.classes['px-20'];
      expect(isPadding20ClassExists).toBe(true);

      component.directive.paddingX = 12;
      fixture.detectChanges();

      const isPadding12ClassExists = element.classes['px-12'];
      expect(isPadding12ClassExists).toBe(true);
    });
  });
});
