import { boolean, text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/vue';
import Vue, { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { selectKnob, StorybookSection } from '../../utils/storybookUtils';
import { Button } from '../Button/Button';
import { InfoPanel } from './InfoPanel';

@Component({ name: 'InfoPanelStory' })
class InfoPanelStory extends Vue {
  render(): VNode {
    return (
      <div class="lp-storybook-wrapper" style="width: 500px;">
        <h5>Success</h5>
        <InfoPanel type={InfoPanel.Type.SUCCESS} message="Hi this is a success info panel." />
        <br />
        <h5>Warning</h5>
        <InfoPanel type={InfoPanel.Type.WARNING} message="Hi this is a warning info panel." />
        <br />
        <h5>Inline</h5>
        <InfoPanel inline={true} type={InfoPanel.Type.SUCCESS} message="Hi this is an inline success info panel." />
        <br />
        <h5>With children</h5>
        <InfoPanel type={InfoPanel.Type.SUCCESS} message="Hi this is an inline success info panel.">
          <Button text="Done" />
        </InfoPanel>
        <br />
      </div>
    );
  }
}

@Component({ name: 'InfoPanelKnobStory' })
class InfoPanelKnobStory extends Vue {
  @Prop({ type: String, required: false, default: () => text('message', 'Hi this is an info panel.') })
  readonly message: string;

  @Prop({ type: Boolean, required: false, default: () => boolean('inline', false) })
  readonly inline: boolean;

  @Prop({ type: String, default: () => selectKnob('type', InfoPanel.Type, InfoPanel.Type.SUCCESS) })
  readonly type: string;

  render(): VNode {
    return (
      <div class="lp-storybook-wrapper" style="width: 500px;">
        <InfoPanel type={this.type} message={this.message} inline={this.inline} />
        <h5>With children</h5>
        <InfoPanel type={this.type} message={this.message} inline={this.inline}>
          <Button text="Done" />
        </InfoPanel>
      </div>
    );
  }
}

storiesOf(`${StorybookSection.FEEDBACK}/InfoPanel`, module)
  .addDecorator(withKnobs)
  .add('Knob Story', () => InfoPanelKnobStory)
  .add('Default', () => InfoPanelStory);
