import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/vue';
import Vue, { VNode } from 'vue';
import { Component } from 'vue-property-decorator';
import { Decorator, StorybookSection } from '../../utils/storybookUtils';
import { Radio } from './Radio';

@Component({ name: 'DefaultRadioStory' })
class DefaultRadioStory extends Vue {
  num: number = 1;

  onSelect(value: number): void {
    this.num = value;
    action('onSelect')(value);
  }

  render(): VNode {
    return (
      <div class="lp-storybook-wrapper" style={this.wrapperStyles}>
        <div class="lp-storybook-wrapper" style="padding: 8px 16px;">
          <h5>On a white background</h5>
          <Radio text="Checked enabled" name="white" checked={true} />
          <Radio text="Checked disabled" name="white" checked={true} disabled={true}/>
          <Radio text="Unchecked enabled" name="white" checked={false} />
          <Radio text="Unchecked disabled" name="white" checked={false} disabled={true}/>
        </div>

        <div class="lp-storybook-wrapper" style="background-color: #F6F9FB; padding: 8px 16px;">
          <h5>On a gray background</h5>
          <Radio text="Checked enabled" name="gray" checked={true} />
          <Radio text="Checked disabled" name="gray" checked={true} disabled={true}/>
          <Radio text="Unchecked enabled" name="gray" checked={false} />
          <Radio text="Unchecked disabled" name="gray" checked={false} disabled={true}/>
        </div>

        <Radio text="With Description" name="num" checked={this.num === 1} onSelect={() => this.onSelect(1)}>
          <template slot="description">
            Paired with <em>the one below</em>.
          </template>
        </Radio>

        <Radio text="With Description" name="num" checked={this.num === 2} onSelect={() => this.onSelect(2)}>
          <template slot="description">
            Click <em>to toggle on</em>.
          </template>
        </Radio>
      </div>
    );
  }

  private get wrapperStyles(): Partial<CSSStyleDeclaration> {
    return {
      maxWidth: '400px'
    };
  }
}

storiesOf(`${StorybookSection.INPUT}/Radio`, module)
  .addDecorator(Decorator.centered)
  .add('Default', () => DefaultRadioStory);
