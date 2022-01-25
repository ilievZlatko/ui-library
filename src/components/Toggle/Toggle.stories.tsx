import { action } from '@storybook/addon-actions';
import { boolean, text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/vue';
import Vue, { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { Decorator, StorybookSection } from '../../utils/storybookUtils';
import { Toggle } from './Toggle';

const onToggle = action('on toggle');

@Component({ name: 'DefaultStory' })
class DefaultStory extends Vue {
  render(): VNode {
    return (
      <div class="lp-storybook-wrapper">
        <div class="lp-storybook-wrapper" style="padding: 8px 16px;">
          <h5>On white background</h5>
          <Toggle label="Active   enabled" active={true} />
          <Toggle label="Active   disabled" active={true} disabled={true} />
          <Toggle label="Inactive enabled" active={false} />
          <Toggle label="Inactive disabled" active={false} disabled={true} />
        </div>

        <div class="lp-storybook-wrapper" style="background-color: #F6F9FB; padding: 8px 16px;">
          <h5>On gray background</h5>
          <Toggle label="Active   enabled" active={true} />
          <Toggle label="Active   disabled" active={true} disabled={true} />
          <Toggle label="Inactive enabled" active={false} />
          <Toggle label="Inactive disabled" active={false} disabled={true} />
        </div>
      </div>
    );
  }
}

@Component({ name: 'KnobStory' })
class KnobStory extends Vue {
  @Prop({ type: String, required: true, default: () => text('label', 'Toggle me') }) label: string;
  @Prop({ type: Boolean, required: true, default: () => boolean('active', true) }) active: boolean;
  @Prop({ type: Boolean, required: true, default: () => boolean('disabled', false) }) disabled: boolean;

  render(): VNode {
    return <Toggle label={this.label} active={this.active} disabled={this.disabled} onToggle={onToggle} />;
  }
}

storiesOf(`${StorybookSection.INPUT}/Toggle`, module)
  .addDecorator(withKnobs)
  .addDecorator(Decorator.centered)
  .add('Default', () => DefaultStory)
  .add('Knob Story', () => KnobStory);
