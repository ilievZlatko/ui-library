import { action } from '@storybook/addon-actions';
import { text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/vue';
import Vue, { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { StorybookSection } from '../../utils/storybookUtils';
import { StargateTarget } from '../Stargate/StargateTarget';
import { DropdownInput } from './DropdownInput';

@Component({ name: 'ItemsStory' })
class ItemsStory extends Vue {
  @Prop({ default: () => text('label', 'DropdownInput label') }) public label: string;

  private numericItem: number = 1;
  private stringItem: string = 'one';

  updateStringItem(value: string): void {
    action('update string item')(value);
    this.stringItem = value;
  }

  updateNumericItem(value: number): void {
    action('update numeric item')(value);
    this.numericItem = value;
  }

  render(): VNode {
    return (
      <div class="lp-storybook-wrapper" style={this.wrapperStyles}>
        <DropdownInput
          style="width: 100%"
          label="With numeric items"
          value={this.numericItem}
          onInput={this.updateNumericItem}
          items={[
            { label: 'None', value: null },
            { label: 'Zero', value: 0 },
            { label: 'One', value: 1 },
            { label: 'Two', value: 2 },
            { label: 'Three', value: 3 }
          ]}
        />
        <DropdownInput
          style="width: 100%"
          label="With string items"
          value={this.stringItem}
          onInput={this.updateStringItem}
          items={[
            { label: 'One', value: 'one' },
            { label: 'Two', value: 'two' },
            { label: 'Three', value: 'three' }
          ]}
        />

        <DropdownInput style="width: 100%" label={this.label} value={null} />

        <DropdownInput style="width: 100%" label="Is marked as required" required={true} value={null} />

        <DropdownInput style="width: 100%" label="With placeholder" placeholder="This is a placeholder" value={null} />

        <DropdownInput style="width: 100%" label="With outline" outline={true} placeholder="This is a placeholder" value={null} />

        <DropdownInput
          style="width: 100%"
          outline={true}
          label="With outline and label"
          value="one"
          items={[
            { label: 'One', value: 'one' },
            { label: 'Two', value: 'two' },
            { label: 'Three', value: 'three' }
          ]}
        />

        <DropdownInput
          style="width: 100%"
          label="With placeholder, always expanded"
          placeholder="This is a placeholder"
          expanded={true}
          value={null}
        />

        <DropdownInput
          style="width: 100%"
          label="With search"
          enableSearch={true}
          items={[
            { label: 'Without label', value: 5 },
            { label: 'Zero', value: 0 },
            { label: 'One', value: 1 },
            { label: 'Two', value: 2 },
            { label: 'Three', value: 3 }
          ]}
        />

        <DropdownInput
          style="width: 100%"
          value={5}
          items={[
            { label: 'Without label', value: 5 },
            { label: 'Zero', value: 0 },
            { label: 'One', value: 1 },
            { label: 'Two', value: 2 },
            { label: 'Three', value: 3 }
          ]}
        />

        <DropdownInput
          style="width: 100%"
          enableSearch={true}
          value={5}
          items={[
            { label: 'Without label with search', value: 5 },
            { label: 'Zero', value: 0 },
            { label: 'One', value: 1 },
            { label: 'Two', value: 2 },
            { label: 'Three', value: 3 }
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

storiesOf(`${StorybookSection.DROPDOWN}/DropdownInput`, module)
  .addDecorator(withKnobs)
  .add('Items', () => ItemsStory);
