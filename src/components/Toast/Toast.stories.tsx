import { action } from '@storybook/addon-actions';
import { text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/vue';
import Vue, { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { Decorator, StorybookSection } from '../../utils/storybookUtils';
import { Button } from '../Button/Button';
import { StargateTarget } from '../Stargate/StargateTarget';
import { Toast } from './Toast';

const onClose = action('on close');

@Component({ name: 'DefaultStory' })
class DefaultStory extends Vue {
  @Prop({ type: String, required: true, default: () => text('message', 'Link copied to clipboard') }) message: string;

  private opened: boolean = true;

  render(): VNode {
    return (
      <div>
        <StargateTarget />
        <Button text="Open" disabled={this.opened} onClick={this.open} />
        {this.opened && <Toast message={this.message} onClose={this.onClose} />}
      </div>
    );
  }

  private onClose(): void {
    onClose();
    this.opened = false;
  }

  private open(): void {
    this.opened = true;
  }
}

storiesOf(`${StorybookSection.FEEDBACK}/Toast`, module)
  .addDecorator(withKnobs)
  .addDecorator(Decorator.centered)
  .add('Default', () => DefaultStory);
