import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/vue';
import Vue, { VNode } from 'vue';
import { Component } from 'vue-property-decorator';
import { Decorator, StorybookSection } from '../../utils/storybookUtils';
import { Button } from '../Button/Button';
import { Icon } from '../icon/Icon';
import { FloatingIconButton } from './FloatingIconButton';

const margin = 'margin: 1em 0';

@Component({ name: 'FloatingIconButtonStory' })
class FloatingIconButtonStory extends Vue {
  onClick: Function = action('onClick');

  render(): VNode {
    return (
      <div class="lp-storybook-wrapper">
        <FloatingIconButton
          style={margin}
          color={Button.Color.LIGHT}
          text="Light Default"
          onClick={this.onClick}
        />

        <FloatingIconButton
          style={margin}
          color={Button.Color.LIGHT}
          text="Light Outline"
          onClick={this.onClick}
          appearance={Button.Appearance.OUTLINE}
        />

        <FloatingIconButton
          style={margin}
          color={Button.Color.PRIMARY}
          text="Primary Default"
          onClick={this.onClick}
        />

        <FloatingIconButton
          style={margin}
          color={Button.Color.PRIMARY}
          text="Primary Outline"
          onClick={this.onClick}
          appearance={Button.Appearance.OUTLINE}
        />
        <FloatingIconButton
          style={margin}
          color={Button.Color.PRIMARY}
          text="Primary Lightened"
          onClick={this.onClick}
          appearance={Button.Appearance.LIGHTEN}
        />

        <FloatingIconButton
          style={margin}
          color={Button.Color.DANGER}
          text="Danger Default"
          onClick={this.onClick}
        />

        <FloatingIconButton
          style={margin}
          color={Button.Color.DANGER}
          text="Danger Outline"
          onClick={this.onClick}
          appearance={Button.Appearance.OUTLINE}
        />

        <FloatingIconButton
          style={margin}
          color={Button.Color.DANGER}
          text="Danger Lightened"
          onClick={this.onClick}
          appearance={Button.Appearance.LIGHTEN}
        />

        <FloatingIconButton
          style={margin}
          color={Button.Color.SUCCESS}
          text="Success Default"
          onClick={this.onClick}
        />

        <FloatingIconButton
          style={margin}
          color={Button.Color.SUCCESS}
          text="Success Outline"
          onClick={this.onClick}
          appearance={Button.Appearance.OUTLINE}
        />

        <FloatingIconButton
          style={margin}
          icon={Icon.Type.USER}
          text="Custom Icon: User"
          onClick={this.onClick}
        />
      </div>
    );
  }
}

storiesOf(`${StorybookSection.BUTTONS}/FloatingIconButton`, module)
  .addDecorator(Decorator.centered)
  .add('Default', () => FloatingIconButtonStory);
