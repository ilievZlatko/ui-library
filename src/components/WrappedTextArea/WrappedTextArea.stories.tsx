import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/vue';
import { withReadme } from 'storybook-readme';
import Vue, { VNode } from 'vue';
import { Component } from 'vue-property-decorator';
import { StorybookSection } from '../../utils/storybookUtils';
import { StargateTarget } from '../Stargate/StargateTarget';
import { WrappedTextArea } from './WrappedTextArea';
import WrappedTextAreaReadme from './WrappedTextArea.md';

@Component({ name: 'DefaultWrappedWrappedTextInputStory' })
class DefaultWrappedTextInputStory extends Vue {
  onClick: Function = action('onClick');

  render(): VNode {
    return (
      <div class="lp-storybook-wrapper" style={this.wrapperStyles}>
        <WrappedTextArea label="Without placeholder and no value" />
        <WrappedTextArea label="With placeholder and no value" placeholder="This is a placeholder" />
        <WrappedTextArea label="With Value" value="with value" />
        <WrappedTextArea label="Disabled" value="When disabled" disabled={true} />
        <WrappedTextArea label="Error Value" value="with value and error" error="Error message" />

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

storiesOf(`${StorybookSection.INPUT}/WrappedTextArea`, module)
  .addDecorator(withReadme(WrappedTextAreaReadme))
  .add('Default', () => DefaultWrappedTextInputStory);
