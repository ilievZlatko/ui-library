import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/vue';
import Vue, { VNode } from 'vue';
import { Component } from 'vue-property-decorator';
import { StorybookSection } from '../../utils/storybookUtils';
import { StargateTarget } from '../Stargate/StargateTarget';
import { NumberInput } from './NumberInput';

const onInput = action('on input');
const onChange = action('on change');
const onSubmit = action('on submit');

@Component({ name: 'DefaultNumberInputStory' })
class DefaultNumberInputStory extends Vue {
  render(): VNode {
    return (
      <div class="lp-storybook-wrapper" style={this.wrapperStyles}>
        <NumberInput
          onInput={onInput}
          onChange={onChange}
          onSubmit={onSubmit}
        />

        <NumberInput
          label="With label"
          placeholder="...and placeholder (0-5)"
          onInput={onInput}
          onChange={onChange}
          onSubmit={onSubmit}
          min={0}
          max={5}
        />

        <NumberInput
          placeholder="Integer"
          onInput={onInput}
          onChange={onChange}
          onSubmit={onSubmit}
        />

        <NumberInput
          placeholder="Float"
          allowFloat={true}
          onInput={onInput}
          onChange={onChange}
          onSubmit={onSubmit}
        />

        <NumberInput
          placeholder="0-5"
          min={0}
          max={5}
          onInput={onInput}
        />

        <NumberInput
          placeholder="With multiple errors"
          error={['I have an error', 'And another', 'And a third one']}
          onInput={onInput}
          onChange={onChange}
          onSubmit={onSubmit}
        />

        <NumberInput
          placeholder="With multiple warnings and border"
          warning={['I have a warning', 'And another', 'And a third one']}
          onInput={onInput}
          onChange={onChange}
          onSubmit={onSubmit}
        />

        <NumberInput
          placeholder="With shaky animation validation"
          min={5}
          max={10}
          shakeOnValidate={true}
          onInput={onInput}
          onChange={onChange}
          onSubmit={onSubmit}
        />

        {/** For validation tooltips */}
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

storiesOf(`${StorybookSection.INPUT}/NumberInput`, module)
  .add('Default', () => DefaultNumberInputStory);
