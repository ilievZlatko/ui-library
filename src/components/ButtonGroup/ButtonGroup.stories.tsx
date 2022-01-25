import { action } from '@storybook/addon-actions';
import { boolean, text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/vue';
import Vue, { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { Decorator, StorybookSection } from '../../utils/storybookUtils';
import { Icon } from '../icon/Icon';
import { ButtonGroup } from './ButtonGroup';

@Component({ name: 'ButtonGroupStory' })
class ButtonGroupStory extends Vue {
  private readonly onChange: Function = action(ButtonGroup.EVENT_CHANGE);

  readonly options: Array<ButtonGroup.Option<string>> = [
    { label: 'Panel 1', value: '1', icon: Icon.Type.ACTION_APPFUNCTION },
    { label: 'Panel 2', value: '2', icon: Icon.Type.ACTION_APPINBOX },
    { label: 'Panel 3', value: '3', icon: Icon.Type.ACTION_EMAIL }
  ];

  @Prop({ type: Boolean, required: false, default: () => text('selected', '2') })
  readonly selected: string;

  @Prop({ type: Boolean, required: false, default: () => boolean('disabled', false) })
  readonly disabled: boolean;

  @Prop({ type: Boolean, required: false, default: () => boolean('compact', true) })
  readonly compact: boolean;

  render(): VNode {
    return (
      <ButtonGroup
        disabled={this.disabled}
        options={this.options}
        selected={this.options.find((x) => x.value === this.selected)}
        compact={this.compact}
        onChange={this.onChange}
      />
    );
  }
}

storiesOf(`${StorybookSection.INPUT}/ButtonGroup`, module)
  .addDecorator(withKnobs)
  .addDecorator(Decorator.centered)
  .add('Button Group', () => ButtonGroupStory);
