import {
  animate,
  keyframes,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

export const CricleAnimation = trigger('circleSlide', [
  state(
    'on',
    style({
      left: '1.75rem',
      width: '1rem',
      backgroundColor: 'rgb(59 130 246)',
    })
  ),
  state(
    'off',
    style({
      left: '0.25rem',
      width: '1rem',
      backgroundColor: '*',
    })
  ),
  transition(
    'off => on',
    animate(
      '0.4s ease-in-out',
      keyframes([
        style({
          backgroundColor: '*',
          width: '1rem',
          left: '0.25rem',
        }),
        style({ width: '1.7rem', left: '1rem' }),
        style({
          backgroundColor: 'rgb(59 130 246)',
          width: '1rem',
          left: '1.75rem',
        }),
      ])
    )
  ),
  transition(
    'on => off',
    animate(
      '0.4s ease-in-out',
      keyframes([
        style({
          backgroundColor: 'rgb(59 130 246)',
          width: '1rem',
          left: '1.75rem',
        }),
        style({ width: '1.7rem', left: '1rem' }),
        style({
          backgroundColor: '*',
          width: '1rem',
          left: '0.25rem',
        }),
      ])
    )
  ),
]);
