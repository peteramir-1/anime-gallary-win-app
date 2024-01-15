import { Component, DebugElement, Renderer2 } from '@angular/core';
import { AppSnackbarOverlayOriginDirective } from './app-snackbar-origin.directive';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OverlayContainer } from '@angular/cdk/overlay';
import { AppSnackbarOverlayContainer } from './custom-overlay-container.service';
const renderer2Mock = jasmine.createSpyObj('renderer2Mock', [
  'destroy',
  'createElement',
  'createComment',
  'createText',
  'destroyNode',
  'appendChild',
  'insertBefore',
  'removeChild',
  'selectRootElement',
  'parentNode',
  'nextSibling',
  'setAttribute',
  'removeAttribute',
  'addClass',
  'removeClass',
  'setStyle',
  'removeStyle',
  'setProperty',
  'setValue',
  'listen',
]);

const rootRendererMock = {
  renderComponent: () => {
    return renderer2Mock;
  },
};
@Component({
  template: `<article appSnackbarOverlayOrigin></article>`,
})
class TestingAppSnackbarOverlayOriginComponent {}

describe('AppSnackbarOverlayOriginDirective', () => {
  let component: TestingAppSnackbarOverlayOriginComponent;
  let fixture: ComponentFixture<TestingAppSnackbarOverlayOriginComponent>;
  let articleEl: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppSnackbarOverlayOriginDirective,
        TestingAppSnackbarOverlayOriginComponent,
      ],
      providers: [
        { provide: Renderer2, useValue: rootRendererMock },
        {
          provide: OverlayContainer,
          useValue: AppSnackbarOverlayContainer,
        },
      ],
    });

    fixture = TestBed.createComponent(TestingAppSnackbarOverlayOriginComponent);
    component = fixture.componentInstance;
    articleEl = fixture.debugElement;
  });
});
