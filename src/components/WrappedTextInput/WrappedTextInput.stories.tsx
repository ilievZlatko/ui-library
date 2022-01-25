import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/vue';
import { LegendWrapper } from 'leanplum-lib-ui';
import { withReadme } from 'storybook-readme';
import Vue, { VNode } from 'vue';
import { Component } from 'vue-property-decorator';
import { StorybookSection } from '../../utils/storybookUtils';
import { AnchoredPopup } from '../AnchoredPopup/AnchoredPopup';
import { Icon } from '../icon/Icon';
import { StargateTarget } from '../Stargate/StargateTarget';
import { WrappedTextInput } from './WrappedTextInput';
import WrappedTextInputReadme from './WrappedTextInput.md';

@Component({ name: 'DefaultWrappedWrappedTextInputStory' })
class DefaultWrappedTextInputStory extends Vue {
  onClick: Function = action('onClick');

  render(): VNode {
    return (
      <div class="lp-storybook-wrapper" style={this.wrapperStyles}>
        <WrappedTextInput label="Without placeholder and no value" />
        <WrappedTextInput label="With placeholder and no value" placeholder="This is a placeholder" />
        <WrappedTextInput
          label="With placeholder and always expanded"
          placeholder="This is a placeholder"
          expanded={true}
        />
        <WrappedTextInput label="With Value" value="with value" />
        <WrappedTextInput label="Disabled" value="When disabled" disabled={true} />
        <WrappedTextInput label="Warning Value" value="with value and warning" warning="Warning message" />
        <WrappedTextInput label="Error Value" value="with value and error" error="Error message" />
        <WrappedTextInput label="With LABEL slot">
          <Icon
            slot={LegendWrapper.Slot.LABEL}
            type={Icon.Type.DELETE}
            tooltip="This icon should appear at all times!"
          />
          <Icon
            slot={LegendWrapper.Slot.LABEL}
            type={Icon.Type.FILTER}
            tooltip="This icon should appear at all times, and have BOTTOM placement!"
            tooltipPlacement={AnchoredPopup.Placement.BOTTOM}
          />
        </WrappedTextInput>
        <WrappedTextInput label="With LABEL_ACTIVE slot">
          <Icon
            slot={LegendWrapper.Slot.LABEL_ACTIVE}
            type={Icon.Type.DELETE}
            tooltip="This icon should appear only when expanded!"
          />
        </WrappedTextInput>
        <WrappedTextInput label="With LABEL_HOVER slot">
          <Icon
            slot={LegendWrapper.Slot.LABEL_HOVER}
            type={Icon.Type.DELETE}
            tooltip="This icon should appear only when hovered!"
          />
        </WrappedTextInput>
        <WrappedTextInput label={'password'} type={WrappedTextInput.Type.PASSWORD} value="SECRET" />
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

storiesOf(`${StorybookSection.INPUT}/WrappedTextInput`, module)
  .addDecorator(withReadme(WrappedTextInputReadme))
  .add('Default', () => DefaultWrappedTextInputStory);
