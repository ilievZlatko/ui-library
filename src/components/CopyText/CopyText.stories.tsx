import { text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/vue';
import Vue, { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { Decorator, StorybookSection } from '../../utils/storybookUtils';
import { StargateTarget } from '../Stargate/StargateTarget';
import { CopyText } from './CopyText';

@Component({ name: 'CopyTextStory' })
class CopyTextStory extends Vue {
  render(): VNode {
    return (
      <div style={this.wrapperStyles}>
        <div>Click on the icon to copy the text 'TEST' to clipboard: </div>
        <CopyText textToCopy="TEST" tooltipText="Click to copy" />
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

@Component({ name: 'CopyTextKnobStory' })
class CopyTextKnobStory extends Vue {
  @Prop({ required: true, default: () => text('textToCopy', 'Your future clipboard :)') })
  textToCopy: string;

  @Prop({ required: false, default: () => text('tooltipText', 'Copy text') })
  tooltipText: string;

  @Prop({ required: false, default: () => text('tooltipTextCopied', 'Copied!') })
  tooltipTextCopied: string;

  render(): VNode {
    return (
      <div>
        <CopyText
          textToCopy={this.textToCopy}
          tooltipText={this.tooltipText}
          tooltipTextCopied={this.tooltipTextCopied}
        />
        <StargateTarget />
      </div>
    );
  }
}

storiesOf(`${StorybookSection.UTIL}/CopyText`, module)
  .addDecorator(withKnobs)
  .addDecorator(Decorator.centered)
  .add('Knob Story', () => CopyTextKnobStory)
  .add('Default', () => CopyTextStory);
