import { action } from '@storybook/addon-actions';
import { array, boolean, text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/vue';
import { withReadme } from 'storybook-readme';
import Vue, { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { Decorator, selectKnob, StorybookSection } from '../../utils/storybookUtils';
import { StargateTarget } from '../Stargate/StargateTarget';
import { Table } from '../Table/Table';
import { SortDropdown } from './SortDropdown';
import SortDropdownReadme from './SortDropdown.md';

@Component({ name: 'SortDropdownStory' })
class SortDropdownStory extends Vue {
  onChangeDirection: Function = action(SortDropdown.EVENT_CHANGE_DIRECTION);
  onChangeOption: Function = action(SortDropdown.EVENT_CHANGE_OPTION);

  @Prop({ type: Array, required: false, default: () => array('options', ['Column 1', 'Column 2', 'Column 3']) })
  readonly options: Array<string>;

  @Prop({ type: String, required: false, default: () => selectKnob('direction', Table.SortDirection, null) })
  readonly direction: Table.SortDirection | null;

  @Prop({ type: String, required: true, default: () => text('sort by', 'Column 1') })
  readonly sortBy: string;

  @Prop({ type: Boolean, required: false, default: () => boolean('disabled', false) })
  readonly disabled: boolean;

  render(): VNode {
    return (
      <div>
        <SortDropdown
          options={this.options}
          direction={this.direction}
          sortBy={this.sortBy}
          disabled={this.disabled}
          onChangeDirection={this.onChangeDirection}
          onChangeOption={this.onChangeOption}
        />
        <StargateTarget />
      </div>
    );
  }
}

storiesOf(`${StorybookSection.DROPDOWN}/SortDropdown`, module)
  .addDecorator(withKnobs)
  .addDecorator(Decorator.centered)
  .addDecorator(withReadme(SortDropdownReadme))
  .add('Sort Dropdown', () => SortDropdownStory);
