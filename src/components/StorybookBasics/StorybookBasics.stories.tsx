import { storiesOf } from '@storybook/vue';
import Vue, { VNode } from 'vue';
import { Component } from 'vue-property-decorator';
import { StorybookSection } from '../../utils/storybookUtils';
import { StorybookBasics } from './StorybookBasics';

@Component({ name: 'LayoutStory' })
class LayoutStory extends Vue {

  render(): VNode {
    return <StorybookBasics mode={StorybookBasics.Mode.LAYOUT}/>;
  }
}

@Component({ name: 'TypographyStory' })
class TypographyStory extends Vue {

  render(): VNode {
    return <StorybookBasics mode={StorybookBasics.Mode.TYPOGRAPHY}/>;
  }
}

@Component({ name: 'ColorsStory' })
class ColorsStory extends Vue {

  render(): VNode {
    return <StorybookBasics mode={StorybookBasics.Mode.COLORS}/>;
  }
}

storiesOf(StorybookSection.BASICS, module)
  .add('Layout', () => LayoutStory)
  .add('Typography', () => TypographyStory)
  .add('Colors', () => ColorsStory);
