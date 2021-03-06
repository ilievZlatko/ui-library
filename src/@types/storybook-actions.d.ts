declare module '@storybook/addon-actions' {
  export type HandlerFunction = (...args: any[]) => undefined;
  export type DecoratorFunction = (args: any[]) => any[];
  export interface Options {
    depth?: number;
    clearOnStoryChange?: boolean;
    limit?: number;
  }

  export function decorateAction(decorators: DecoratorFunction[]): (name: string, options?: Options) => HandlerFunction;
  export function configureActions(options: Options): undefined;
  export function action(name: string): HandlerFunction;
  export function actions(key: string): { [key: string]: HandlerFunction };
}
