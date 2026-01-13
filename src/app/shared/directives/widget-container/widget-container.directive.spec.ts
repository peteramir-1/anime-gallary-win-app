import {
  CUSTOM_ELEMENTS_SCHEMA,
  ChangeDetectionStrategy,
  Component,
  DebugElement,
  ViewChild,
} from '@angular/core';
import { WidgetContainerDirective } from './widget-container.directive';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WidgetContainerModule } from './widget-container.module';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'test-element',
    template: `<div [appWidgetContainer]></div>`,
    standalone: false
})
class testComponent {
  @ViewChild(WidgetContainerDirective) directive: WidgetContainerDirective;
  constructor() {}
}

describe('WidgetContainerDirective', () => {
  let fixture: ComponentFixture<testComponent>;
  let component: testComponent;
  let element: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [testComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [CommonModule, WidgetContainerModule],
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

  it('should create a component', () => {
    expect(component).toBeTruthy();
  });

  it('should only satisfy input types correctly and error other than that', () => {
    fixture.detectChanges();

    if (component.directive.paddingY) {
      expect(component.directive.paddingY).toEqual(jasmine.any(Number));
    }
    expect(component.directive.width).toEqual(jasmine.any(String));
    expect(component.directive.height).toEqual(jasmine.any(String));
  });

  describe('padding class', () => {
    it('should be py-7 by default', () => {
      fixture.detectChanges();
      const isPadding8ClassExists = element.classes['py-7'];
      expect(isPadding8ClassExists).toBe(true);
    });

    it('should be py-19 then change it to py-11', () => {
      component.directive.paddingY = 20;
      fixture.detectChanges();

      const isPadding20ClassExists = element.classes['py-19'];
      expect(isPadding20ClassExists).toBe(true);
      
      component.directive.paddingY = 12;
      fixture.detectChanges();
  
      const isPadding12ClassExists = element.classes['py-11'];
      expect(isPadding12ClassExists).toBe(true);
    });
  });

  describe('width class', () => {
    it('should be auto by default', () => {
      fixture.detectChanges();

      const isWidthAutoClassExists = element.classes['w-full'];
      expect(isWidthAutoClassExists).toBe(true);
    });

    it('should be full', () => {
      component.directive.width = 'full';
      fixture.detectChanges();

      const isWidthFullClassExists = element.classes['w-full'];
      expect(isWidthFullClassExists).toBe(true);
    });

    it('should be fit', () => {
      component.directive.width = 'fit';
      fixture.detectChanges();

      const isWidthFitClassExists = element.classes['w-fit'];
      expect(isWidthFitClassExists).toBe(true);
    });

    it('should be screen', () => {
      component.directive.width = 'screen';
      fixture.detectChanges();

      const isHeightFitClassExists = element.classes['w-screen'];
      expect(isHeightFitClassExists).toBe(true);
    });

  });

  describe('height class', () => {
    it('should be auto by default', () => {
      fixture.detectChanges();

      const isHeightAutoClassExists = element.classes['h-full'];
      expect(isHeightAutoClassExists).toBe(true);
    });

    it('should be full', () => {
      component.directive.height = 'full';
      fixture.detectChanges();

      const isHeightFullClassExists = element.classes['h-full'];
      expect(isHeightFullClassExists).toBe(true);
    });

    it('should be fit', () => {
      component.directive.height = 'fit';
      fixture.detectChanges();

      const isHeightFitClassExists = element.classes['h-fit'];
      expect(isHeightFitClassExists).toBe(true);
    });
    
    it('should be screen', () => {
      component.directive.height = 'screen';
      fixture.detectChanges();

      const isHeightFitClassExists = element.classes['h-screen'];
      expect(isHeightFitClassExists).toBe(true);
    });
  });
});
