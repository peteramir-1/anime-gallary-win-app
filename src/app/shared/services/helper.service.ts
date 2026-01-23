import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HelperService {
  /**
   * Recursively compares two objects and returns true if they are equal, false otherwise.
   * Equality is determined by checking if both objects have the same keys and values.
   * If the values are also objects, the function calls itself to compare them recursively.
   * If the values are not objects, the function uses the === operator to compare them.
   *
   * @param {any} obj1 - The first object to be compared.
   * @param {any} obj2 - The second object to be compared.
   * @returns {boolean} True if the objects are equal, false otherwise.
   */
  compareObjectsValues(obj1: any, obj2: any): boolean {
    // Check if both are the same object
    if (obj1 === obj2) return true;

    // Check if either is null or not an object
    if (
      obj1 == null ||
      typeof obj1 !== 'object' ||
      obj2 == null ||
      typeof obj2 !== 'object'
    ) {
      return false;
    }

    // Get object keys
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    // Check if keys length is the same
    if (keys1.length !== keys2.length) return false;

    // Compare keys and values recursively
    for (const key of keys1) {
      if (
        !keys2.includes(key) ||
        !this.compareObjectsValues(obj1[key], obj2[key])
      ) {
        return false;
      }
    }

    return true;
  }
}
