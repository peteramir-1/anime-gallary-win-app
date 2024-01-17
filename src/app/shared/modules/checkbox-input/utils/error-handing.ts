import { option } from '../checkbox-input.interface';

export function handleDuplicateError(
  options: option[],
  callback: (option: string) => void
) {
  const duplicateError = checkForDuplicates(options);
  if (duplicateError !== undefined) {
    const optionsValues = options.map(option => option.value);

    const duplicateValues = optionsValues.filter(
      (value, index) => optionsValues.indexOf(value) !== index
    );
    duplicateValues.forEach(option => callback(option));
    console.error(duplicateError);
  }
}
function checkForDuplicates(options: option[]): Error | undefined {
  const optionsValues = Object.values(options.map(option => option.value));
  const isOptionsHaveDuplicateValue =
    new Set(optionsValues).size !== optionsValues.length;
  if (isOptionsHaveDuplicateValue) {
    const e = new Error('Checkbox have duplicate options');
    e.name = 'DuplicateError';
    return e;
  } else return undefined;
}

export function handleMaximumAllowedOptionsError(
  max: number,
  options: option[],
  callback: (option: string) => void
): any {
  const MaximumError = checkForMaxmiumAllowedOptionsError(max, options);
  if (MaximumError !== undefined) {
    options.forEach((option, index) => {
      if (index >= 5) callback(option.value);
    });
    console.error(MaximumError);
  }
}
function checkForMaxmiumAllowedOptionsError(
  max: number,
  options: option[]
): Error | undefined {
  const isExceededMaxmiumAllowedOptions =
    options.filter(option => !option.hidden).length > max;
  if (isExceededMaxmiumAllowedOptions) {
    const e = new Error(
      'Exceeded Maximum Allowed Options inside the checkbox store service'
    );
    e.name = 'MaximumError';
    return e;
  } else return undefined;
}
