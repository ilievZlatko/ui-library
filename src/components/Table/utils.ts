import { Comparable, Filterable } from './types';

export function isComparableValue(value: unknown): value is Comparable {
  switch (typeof value) {
    case 'string':
    case 'number':
    case 'boolean':
    case 'undefined':
      return true;
    case 'object':
      return value === null;
    default:
      return false;
  }
}

export function isFilterableValue(value: unknown): value is Filterable {
  switch (typeof value) {
    case 'string':
    case 'number':
    case 'boolean':
      return true;
    default:
      return false;
  }
}
