import { ChangeDetectionStrategy, Input, Component } from '@angular/core';

@Component({
    selector: 'app-anime-details-spec',
    templateUrl: './anime-details-spec.component.html',
    styleUrl: './anime-details-spec.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'flex flex-initial flex-col gap-2',
    },
    standalone: false
})
export class AnimeDetailsSpecComponent {
  @Input({ required: true }) title: string;
  @Input({ required: true }) value?: string = '';

  stringify(value?: string | number | null | undefined): string {
    if (value === undefined || value === null) return '-';
    return `${value}`;
  }
}
