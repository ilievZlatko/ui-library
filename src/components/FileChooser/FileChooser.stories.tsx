import { boolean, text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/vue';
import Vue, { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { Decorator, selectKnob, StorybookSection } from '../../utils/storybookUtils';
import { Button } from '../Button/Button';
import { StargateTarget } from '../Stargate/StargateTarget';
import { FileChooser } from './FileChooser';

@Component({ name: 'FileChooserStory' })
class FileChooserStory extends Vue {
  private file: File | null = null;

  render(): VNode {
    return (
      <div class="lp-storybook-wrapper" style="width: 500px;">
        <h5>Default</h5>
        <FileChooser />

        <h5>With button styling</h5>
        <FileChooser buttonText="Upload" buttonAppearance={Button.Appearance.OUTLINE} buttonColor={Button.Color.PRIMARY} />

        <h5>With content and clear button</h5>
        <FileChooser buttonText="Upload" showClearButton={true} onChange={(file: File | null) => this.file = file}>
          {this.renderContent()}
        </FileChooser>

        <StargateTarget />
      </div>
    );
  }

  private renderContent(): VNode {
    if (!this.file?.name) {
      return <b>No file chosen</b>;
    }

    return (
      <p>
        <div style="font-weight: bold;">{this.file.name}</div>
        <div style="font-size: 0.75em; color: silver;">Size: {this.file.size} bytes</div>
      </p>
    );
  }
}

@Component({ name: 'FileChooserKnobStory' })
class FileChooserKnobStory extends Vue {
  @Prop({
    type: String,
    required: false,
    default: () => selectKnob('color', Button.Color, Button.Color.LIGHT)
  })
  readonly buttonColor: Button.Color;

  @Prop({
    type: String,
    required: false,
    default: () => selectKnob('appearance', Button.Appearance, Button.Appearance.NORMAL)
  })
  readonly buttonAppearance: Button.Appearance;

  @Prop({ type: String, required: false, default: () => text('text', 'Upload') })
  readonly buttonText: string | null;

  @Prop({ required: false, default: () => boolean('disabled', false) })
  readonly disabled: boolean;

  @Prop({ required: false, default: () => boolean('showClearButton', false) })
  readonly showClearButton: boolean;

  @Prop({ required: false, default: () => boolean('multiple', false) })
  readonly multiple: boolean;

  render(): VNode {
    return (
      <div>
        <FileChooser
          buttonAppearance={this.buttonAppearance}
          buttonColor={this.buttonColor}
          buttonText={this.buttonText}
          multiple={this.multiple}
          disabled={this.disabled}
          showClearButton={this.showClearButton}
        />
        <StargateTarget />
      </div>
    );
  }
}

storiesOf(`${StorybookSection.UTIL}/FileChooser`, module)
  .addDecorator(withKnobs)
  .addDecorator(Decorator.centered)
  .add('Knob Story', () => FileChooserKnobStory)
  .add('Default', () => FileChooserStory);
