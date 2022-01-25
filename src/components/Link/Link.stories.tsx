import { action } from '@storybook/addon-actions';
import { text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/vue';
import Vue, { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { Decorator, selectKnob, StorybookSection } from '../../utils/storybookUtils';
import { Icon } from '../icon/Icon';
import { Link } from './Link';

@Component({ name: 'DefaultLinkStory' })
class DefaultLinkStory extends Vue {
  onClick: Function = action('onClick');

  render(): VNode {
    return <Link text="Text" onClick={this.onClick} />;
  }
}

@Component({ name: 'IconLinkStory' })
class IconLinkStory extends Vue {
  onClick: Function = action('onClick');

  render(): VNode {
    return <Link text="Icon and Text" icon={Icon.Type.ARROW_LEFT} onClick={this.onClick} />;
  }
}

@Component({ name: 'LinkKnobStory' })
class LinkKnobStory extends Vue {
  onClick: Function = action('onClick');

  @Prop({ type: String, required: true, default: () => text('text', 'Link text') })
  readonly text: string;

  @Prop({ type: String, required: false, default: () => selectKnob('icon', Icon.Type, null) })
  readonly icon: Icon.Type;

  render(): VNode {
    return <Link text={this.text} icon={this.icon} onClick={this.onClick} />;
  }
}

storiesOf(`${StorybookSection.UTIL}/Link`, module)
  .addDecorator(withKnobs)
  .addDecorator(Decorator.centered)
  .add('Knob Story', () => LinkKnobStory)
  .add('Default', () => DefaultLinkStory)
  .add('Icon and Text Link', () => IconLinkStory);
