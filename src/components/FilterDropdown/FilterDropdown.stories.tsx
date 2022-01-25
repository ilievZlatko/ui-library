import { action } from '@storybook/addon-actions';
import { boolean, text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/vue';
import { withReadme } from 'storybook-readme';
import Vue, { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { Decorator, selectKnob, StorybookSection } from '../../utils/storybookUtils';
import { Icon } from '../icon/Icon';
import { StargateTarget } from '../Stargate/StargateTarget';
import { FilterDropdown } from './FilterDropdown';
import FilterDropdownReadme from './FilterDropdown.md';

@Component({ name: 'FilterDropdownStory' })
class FilterDropdownStory extends Vue {
  private static readonly FILTER_OPTIONS: Array<FilterDropdown.Item> = [
    { label: 'Campaigns', value: 'campaigns', icon: Icon.Type.CAMPAIGNS },
    { label: 'Messages', value: 'messages', icon: Icon.Type.MESSAGES },
    { label: 'A/B Tests', value: 'abTests', icon: Icon.Type.LAB }
  ];

  @Prop({ type: String, required: true, default: () => text('text', 'Events') })
  readonly text: string;

  @Prop({ type: String, required: true, default: () => text('textAll', 'All Events') })
  readonly textAll: string;

  @Prop({ type: String, required: true, default: () => selectKnob('badgeMode', FilterDropdown.BadgeMode, FilterDropdown.BadgeMode.NOT_ALL) })
  readonly badgeMode: FilterDropdown.BadgeMode;

  @Prop({ type: Boolean, required: false, default: () => boolean('disabled', false) })
  readonly disabled: boolean;

  private onChangeAction: Function = action(FilterDropdown.EVENT_CHANGE);
  private selected: Array<FilterDropdown.Item> = [FilterDropdownStory.FILTER_OPTIONS[0]];

  render(): VNode {
    return (
      <div>
        <FilterDropdown
          options={FilterDropdownStory.FILTER_OPTIONS}
          text={this.text}
          textAll={this.textAll}
          badgeMode={this.badgeMode}
          selected={this.selected}
          disabled={this.disabled}
          onChange={this.onChange}
        />
        <StargateTarget />
      </div>
    );
  }

  private onChange(selected: Array<FilterDropdown.Item>): void {
    this.selected = selected;
    this.onChangeAction();
  }
}

storiesOf(`${StorybookSection.DROPDOWN}/FilterDropdown`, module)
  .addDecorator(withKnobs)
  .addDecorator(Decorator.centered)
  .addDecorator(withReadme(FilterDropdownReadme))
  .add('Filter Dropdown', () => FilterDropdownStory);
