import { action } from '@storybook/addon-actions';
import { boolean, text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/vue';
import Vue, { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { StargateTarget } from '../Stargate/StargateTarget';
import { Pill } from './Pill';

@Component({ name: 'DefaultPillStory' })
class DefaultPillStory extends Vue {
  render(): VNode {
    return (
      <div class="lp-storybook-wrapper" style={this.wrapperStyles}>
        <Pill text="Test" onClick={action('click')} onClose={action('close')} />
        <Pill text="Test with a long text that will overflow" onClick={action('click')} onClose={action('close')} />
        <Pill text="Test with a long text that will overflow" error="Some error" onClick={action('click')} onClose={action('close')} />
        <Pill text="Test" warning="Some warning" onClick={action('click')} onClose={action('close')} />
        <Pill text="Selected" selected={true} onClick={action('click')} onClose={action('close')} />
        <Pill text="Disabled" disabled={true} onClick={action('click')} onClose={action('close')} />

        <StargateTarget />
      </div>
    );
  }

  private get wrapperStyles(): Partial<CSSStyleDeclaration> {
    return {
      maxWidth: '400px'
    };
  }
}

@Component({ name: 'PillKnobStory' })
class PillKnobStory extends Vue {
  @Prop({ type: String, required: false, default: () => text('text', 'Change me') })
  readonly text: string;

  @Prop({ type: Boolean, required: false, default: () => boolean('selected', false) })
  readonly selected: boolean;

  @Prop({ type: Boolean, required: false, default: () => boolean('disabled', false) })
  readonly disabled: boolean;

  render(): VNode {
    return (
      <div class="lp-storybook-wrapper">
        <Pill
          text={this.text}
          selected={this.selected}
          disabled={this.disabled}
          onClick={action('click')}
          onClose={action('close')}
        />

        <StargateTarget />
      </div>
    );
  }
}

storiesOf('Pill', module)
  .addDecorator(withKnobs)
  .add('Knobs', () => PillKnobStory)
  .add('Default', () => DefaultPillStory);
