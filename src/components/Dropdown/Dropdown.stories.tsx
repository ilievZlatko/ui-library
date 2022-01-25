import { storiesOf } from '@storybook/vue';
import range from 'lodash/range';
import Vue, { VNode } from 'vue';
import { Component } from 'vue-property-decorator';
import { StorybookSection } from '../../utils/storybookUtils';
import { Button } from '../Button/Button';
import { StargateTarget } from '../Stargate/StargateTarget';
import { Dropdown } from './Dropdown';
@Component({ name: 'DefaultStory' })
class DefaultStory extends Vue {
  private buttonText = 'Click me!';

  render(): VNode {
    return (
      <div class="lp-storybook-wrapper">
        <div>With preselected item: </div>
        <Dropdown
          options={[
            'alpha',
            'beta',
            'gamma',
            'delta',
            'kappa',
            'theta',
            'alpha',
            'beta',
            'gamma',
            'delta',
            'kappa',
            'theta'
          ]}
          selectedItem="gamma"
          onSelect={(value: string) => (this.buttonText = value)}
        >
          <Button text={this.buttonText} />
        </Dropdown>
        <div>
          <p>lots of content</p>
          {range(1, 15).map(() => (
            <p>...</p>
          ))}
        </div>
        <Dropdown
          options={[
            { label: 'alpha' },
            { label: 'beta' },
            { label: 'gamma', disabled: true, disabledReason: 'This is an explanation' },
            { label: 'delta', disabled: true },
            { label: 'kappa' },
            { label: 'theta' }
          ]}
          onSelect={({ label }: Dropdown.Item) => (this.buttonText = label)}
        >
          <Button text={this.buttonText} />
        </Dropdown>
        <div>With headers: </div>
        <Dropdown
          options={[
            { header: 'hello' },
            ...['alpha', 'beta', 'gamma', 'delta', 'kappa', 'theta'].map((x) => ({ label: x })),
            { header: 'hello2' },
            ...['alpha', 'beta', 'gamma', 'delta', 'kappa', 'theta'].map((x) => ({ label: x }))
          ]}
          onSelect={({ label }: Dropdown.Item) => (this.buttonText = label)}
        >
          <Button text={this.buttonText} />
        </Dropdown>
        <StargateTarget />
      </div>
    );
  }
}

storiesOf(`${StorybookSection.DROPDOWN}/Dropdown`, module).add('Default', () => DefaultStory);
