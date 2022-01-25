declare module '@storybook/vue' {
  import Vue, { ComponentOptions, CreateElement } from 'vue';

  export type StoryFunction = (h: CreateElement) => ComponentOptions<Vue> | string | any;

  export interface DecoratorParameters {
    [key: string]: any;
  }
  export type StoryDecorator = (
    story: () => ComponentOptions<Vue>,
    context: { kind: string; story: string }
  ) => ComponentOptions<Vue> | null;

  export interface Story {
    readonly kind: string;
    // add<T extends Vue>(storyName: string, getStory: StoryFunction<T>, parameters?: any): this;
    add(storyName: string, getStory: StoryFunction, parameters?: { notes: { markdown: string } }): this;
    addDecorator(decorator: StoryDecorator): this;
    addParameters(parameters: DecoratorParameters): this;
  }

  export interface Addon {
    [addonName: string]: (storyName: string, storyFn: StoryFunction) => void;
  }

  export interface StoryStore {
    fileName: string | undefined;
    kind: string;
    stories: StoryObject[];
  }

  export interface StoryObject {
    name: string;
    render: StoryFunction;
  }

  export function addDecorator(decorator: StoryDecorator): void;
  export function addParameters(parameters: DecoratorParameters): void;
  export function configure(loaders: () => void, module: NodeModule): void;
  export function getStorybook(): StoryStore[];
  export function setAddon(addon: Addon): void;
  export function storiesOf(kind: string, module: NodeModule): Story;
}
