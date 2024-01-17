import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'filter' })
export class FilterPipe implements PipeTransform {
  constructor() {}

  transform(options: string[] | null | undefined, searchKeyword: string) {
    if (!!options) return [];
    if (searchKeyword === '') return options;
    const result = [];
    options.forEach((value) => {
      if (value.includes(searchKeyword.toLocaleLowerCase())) {
        result.push(value);
      }
    });
    return result;
  }
}
