declare module 'storybook-readme' {
  import { StoryDecorator } from '@storybook/vue';

  export function withReadme(readmeString: string): StoryDecorator;
}
