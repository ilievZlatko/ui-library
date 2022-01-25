declare module '@storybook/addon-knobs' {
  import { StoryFunction } from '@storybook/vue';
  import Vue, { Component, ComponentOptions } from 'vue';

  export interface KnobOption<T> {
    value: T;
    type: 'text' | 'boolean' | 'number' | 'color' | 'object' | 'select' | 'date' | 'radios';
  }

  export interface StoryContext {
    kind: string;
    story: string;
  }

  export interface NumberOptions {
    range: boolean;
    min: number;
    max: number;
    step: number;
  }

  export interface EmptyNumberOptions {
    range?: undefined;
    min?: undefined;
    max?: undefined;
    step?: undefined;
  }

  export function knob<T>(name: string, options: KnobOption<T>): T;

  export function text(name: string, value: string | null, groupId?: string): string;

  export function boolean(name: string, value: boolean, groupId?: string): boolean;

  export function files(label: string, accept: string, defaultValue: string[]): string[];

  export function number(
    name: string,
    value: number,
    options?: NumberOptions | EmptyNumberOptions,
    groupId?: string
  ): number;

  export function color(name: string, value: string, groupId?: string): string;

  export function object<T>(name: string, value: T, groupId?: string): T;

  export function radios<T>(name: string, options: { [s: string]: T }, value?: T, groupId?: string): T;

  export function select<T>(name: string, options: { [s: string]: T }, value: T, groupId?: string): T;
  // export function select<T extends Exclude<React.OptionHTMLAttributes<HTMLOptionElement>['value'], undefined>>(
  //   name: string,
  //   options: ReadonlyArray<T>,
  //   value: T,
  //   groupId?: string
  // ): T;

  export function date(name: string, value?: Date, groupId?: string): Date;

  export function array<T>(name: string, value: ReadonlyArray<T>, separator?: string, groupId?: string): T[];

  export function button(name: string, handler: () => any, groupId?: string): void;

  export interface OptionsKnobOptions {
    display?: 'radio' | 'inline-radio' | 'check' | 'inline-check' | 'select' | 'multi-select';
  }

  export function optionsKnob<T>(
    label: string,
    values: {
      [key: string]: T;
    },
    defaultValue?: T,
    options?: OptionsKnobOptions
  ): T;

  export interface WrapStoryProps {
    context?: object;
    storyFn?: StoryFunction;
    channel?: object;
    knobStore?: object;
    initialContent?: object;
  }

  export function withKnobs(storyFn: StoryFunction, context: StoryContext): ComponentOptions<Vue>;
  export function withKnobsOptions(options: {
    debounce: boolean;
    timestamps: boolean;
  }): (storyFn: StoryFunction, context: StoryContext) => Component<Vue>;
}
