import { select } from '@storybook/addon-knobs';
import identity from 'lodash/identity';
import keyBy from 'lodash/keyBy';
import values from 'lodash/values';
import Vue, { ComponentOptions } from 'vue';

// Utils for storybook stories

// tslint:disable:no-any
// tslint:disable:typedef
export function selectKnob<T>(name: string, type: any, value?: T, acceptEmptyValue: boolean = false) {
  let options = keyBy(values(type), identity);

  if (acceptEmptyValue) {
    options = {
      '- none -': '',
      ...options
    };
  }

  return select(name, options, value);
}
// tslint:enable:no-any
// tslint:enable:typedef

export class Decorator {
  static centered(): ComponentOptions<Vue> {
    return {
      template:
        '<div style="display: flex; width: 100vw; height: calc(100vh - 64px); align-items: center; justify-content: center;">\
          <story />\
        </div>'
    };
  }
}

/**
 * Enum for grouping stories into folders.
 */
export enum StorybookSection {
  BASICS = 'Basics',
  BUTTONS = 'Buttons',
  DATE = 'Date & Time',
  DROPDOWN = 'Dropdowns',
  FEEDBACK = 'Feedback & Popups',
  INDICATOR = 'Indicators',
  INPUT = 'Inputs',
  LAYOUT = 'Layout',
  MODAL = 'Modals',
  UTIL = 'Utilities'
}
