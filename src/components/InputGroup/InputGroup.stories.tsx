import { action } from '@storybook/addon-actions';
import { withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/vue';
import Vue, { VNode } from 'vue';
import { Component } from 'vue-property-decorator';
import { Decorator, StorybookSection } from '../../utils/storybookUtils';
import { Button } from '../Button/Button';
import { DatePicker } from '../DatePicker/DatePicker';
import { Dropdown } from '../Dropdown/Dropdown';
import { Icon } from '../icon/Icon';
import { StargateTarget } from '../Stargate/StargateTarget';
import { TextInput } from '../TextInput/TextInput';
import { TimePicker } from '../TimePicker/TimePicker';
import { InputGroup } from './InputGroup';

@Component({ name: 'InputGroupStory' })
class InputGroupStory extends Vue {
  private readonly onSelectAction: Function = action('select');

  private readonly items: Array<Dropdown.Item> = [
    { icon: Icon.Type.PLUS, label: 'Plus', value: '+' },
    { icon: Icon.Type.TIMEWATCH, label: 'Time', value: 't' },
    { icon: Icon.Type.DELETE, label: 'Delete', value: 'd' }
  ];

  private selectedItem: Dropdown.Item = this.items[0];

  render(): VNode {
    return (
      <div>
        <p>Input Group with nested text input and a button</p>
        <InputGroup>
          <TextInput value="test"/>
          <Dropdown options={this.items} selectedItem={this.selectedItem} onSelect={this.onSelect}>
            <Button icon={this.selectedItem.icon}/>
          </Dropdown>
        </InputGroup>

        <p>Input Group with nested text input and date and time pickers</p>
        <InputGroup>
          <TextInput value="test"/>
          <DatePicker/>
          <TimePicker/>
        </InputGroup>

        <StargateTarget/>
      </div>
    );
  }

  private onSelect(item: Dropdown.Item): void {
    this.selectedItem = item;
    this.onSelectAction(item);
  }
}

storiesOf(`${StorybookSection.INPUT}/InputGroup`, module)
  .addDecorator(withKnobs)
  .addDecorator(Decorator.centered)
  .add('Input Group', () => InputGroupStory);
