import { Observable, defer } from "rxjs";
import { tap } from "rxjs/operators";

/**
 * This Function takes a string and convert it to loop that excutes a function
 * @param styles string
 */
export function loopThroughClasses(
  styles: string,
  fn: (klass: string) => void
): void {
  styles.split(' ').forEach(klass => fn(klass));
}

export function handleError(error: Error): any {
  if (error.name === 'DuplicateError') {
    
  }
  throw error;
}