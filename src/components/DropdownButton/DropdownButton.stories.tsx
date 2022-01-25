import { action } from '@storybook/addon-actions';
import { text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/vue';
import Vue, { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { StorybookSection } from '../../utils/storybookUtils';
import { Dropdown } from '../Dropdown/Dropdown';
import { StargateTarget } from '../Stargate/StargateTarget';
import { DropdownButton } from './DropdownButton';

@Component({ name: 'DefaultStory' })
class DefaultStory extends Vue {
  @Prop({ default: () => text('label', 'DropdownButton label') }) public label: string;

  private numericItem: Dropdown.Item = { label: 'One', value: 1 };
  private stringItem: Dropdown.Item = { label: 'One', value: 'one' };

  updateStringItem(value: Dropdown.Item): void {
    action('update string item')(value.value);
    this.stringItem = value;
  }

  updateNumericItem(value: Dropdown.Item): void {
    action('update numeric item')(value.value);
    this.numericItem = value;
  }

  render(): VNode {
    return (
      <div class="lp-storybook-wrapper" style={this.wrapperStyles}>
        <span>With numeric: </span>
        <DropdownButton
          style="width: 150px"
          activeItem={this.numericItem}
          onSelect={this.updateNumericItem}
          items={[
            { label: 'None', value: null },
            { label: 'Zero', value: 0 },
            { label: 'One', value: 1 },
            { label: 'Two', value: 2 },
            { label: 'Three', value: 3 }
          ]}
        />
        <span>With string items (and caret): </span>
        <DropdownButton
          style="width: 150px"
          activeItem={this.stringItem}
          onSelect={this.updateStringItem}
          hasIcon={true}
          items={[
            { label: 'One', value: 'one' },
            { label: 'Two with a long name that will cause issues', value: 'two' },
            { label: 'Three', value: 'three' }
          ]}
        />
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

storiesOf(`${StorybookSection.DROPDOWN}/DropdownButton`, module)
  .addDecorator(withKnobs)
  .add('Default', () => DefaultStory);
