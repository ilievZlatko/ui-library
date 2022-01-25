import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/vue';
import { withReadme } from 'storybook-readme';
import Vue, { VNode } from 'vue';
import { Component } from 'vue-property-decorator';
import { StorybookSection } from '../../utils/storybookUtils';
import { Icon } from '../icon/Icon';
import { StargateTarget } from '../Stargate/StargateTarget';
import { TextInput } from './TextInput';
import TextInputReadme from './TextInput.md';

function onInput(value: string): void {
  action('on input')(value);
}
function onChange(value: string): void {
  action('on change')(value);
}
function onSubmit(value: string): void {
  action('on submit')(value);
}
@Component({ name: 'DefaultTextInputStory' })
class DefaultTextInputStory extends Vue {
  render(): VNode {
    return (
      <div class="lp-storybook-wrapper" style={this.wrapperStyles}>
        <TextInput onInput={onInput} onChange={onChange} onSubmit={onSubmit} />
        <TextInput placeholder="This is a placeholder" onInput={onInput} onChange={onChange} onSubmit={onSubmit} />
        <TextInput
          placeholder="This is a placeholder"
          icon={Icon.Type.COPY}
          onInput={onInput}
          onChange={onChange}
          onSubmit={onSubmit}
        />
        <TextInput
          value="This is a value"
          icon={Icon.Type.COPY}
          onInput={onInput}
          onChange={onChange}
          onSubmit={onSubmit}
        />
        <TextInput value="This is loading" loading={true} onInput={onInput} onChange={onChange} onSubmit={onSubmit} />
        <TextInput value="This is a readonly value" readonly={true} icon={Icon.Type.COPY} />
        <TextInput
          placeholder="Disabled Placeholder"
          disabled={true}
          onInput={onInput}
          onChange={onChange}
          onSubmit={onSubmit}
        />
        <TextInput value="Disabled value" disabled={true} onInput={onInput} onChange={onChange} onSubmit={onSubmit} />
        <TextInput
          value="Disabled with icon"
          disabled={true}
          icon={Icon.Type.COPY}
          onInput={onInput}
          onChange={onChange}
          onSubmit={onSubmit}
        />
        <TextInput
          placeholder="With icon and error"
          icon={Icon.Type.COPY}
          error="I have an error"
          onInput={onInput}
          onChange={onChange}
          onSubmit={onSubmit}
        />
        <TextInput value="With value" hasClear={true} onInput={onInput} onChange={onChange} onSubmit={onSubmit} />
        <TextInput
          value="With clear and error"
          hasClear={true}
          error="I have an error"
          onInput={onInput}
          onChange={onChange}
          onSubmit={onSubmit}
        />
        <TextInput
          value="With multiple errors"
          error={['I have an error', 'And another', 'And a third one']}
          onInput={onInput}
          onChange={onChange}
          onSubmit={onSubmit}
        />
        <TextInput
          value="With multiple warnings and border"
          warning={['I have a warning', 'And another', 'And a third one']}
          onInput={onInput}
          onChange={onChange}
          onSubmit={onSubmit}
        />
        <TextInput
          value="With multiple warnings and no border"
          warning={['I have a warning', 'And another', 'And a third one']}
          showHighlightOnWarning={false}
          onInput={onInput}
          onChange={onChange}
          onSubmit={onSubmit}
        />
        <TextInput type={TextInput.Type.PASSWORD} value="SECRET" />

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

@Component({ name: 'SearchInputStory' })
class SearchInputStory extends Vue {
  render(): VNode {
    return (
      <div class="lp-storybook-wrapper">
        <TextInput icon={Icon.Type.SEARCH} onInput={onInput} onChange={onChange} onSubmit={onSubmit} />
        <TextInput icon={Icon.Type.SEARCH} hasClear={true} onInput={onInput} onChange={onChange} onSubmit={onSubmit} />
        <TextInput
          icon={Icon.Type.SEARCH}
          hasClear={true}
          placeholder="Search..."
          onInput={onInput}
          onChange={onChange}
          onSubmit={onSubmit}
        />
        <TextInput
          icon={Icon.Type.SEARCH}
          hasClear={true}
          placeholder="Search..."
          value="Search Value"
          onInput={onInput}
          onChange={onChange}
          onSubmit={onSubmit}
        />
      </div>
    );
  }
}

storiesOf(`${StorybookSection.INPUT}/TextInput`, module)
  .addDecorator(withReadme(TextInputReadme))
  .add('Default', () => DefaultTextInputStory)
  .add('Search Input', () => SearchInputStory);
