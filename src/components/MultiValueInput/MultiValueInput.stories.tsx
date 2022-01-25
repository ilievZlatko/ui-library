import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/vue';
import Vue, { VNode } from 'vue';
import { Component } from 'vue-property-decorator';
import { StorybookSection } from '../../utils/storybookUtils';
import { StargateTarget } from '../Stargate/StargateTarget';
import { MultiValueInput } from './MultiValueInput';

const onInput = action('input');
const onChange = action('change');
const onButtonClick = action('buttonClick');
const onFocus = action('focus');
const onFocusOut = action('focusOut');

const pills = ['Sofia', 'London', 'Boston'];
const typeahead = [...pills, 'Paris', 'New York', 'San Francisco', 'Beijing', 'Berlin', 'Moscow'].map((label) => ({ label }));
const veryLongValue = 'testLongOverflowingValueWithErrorThatWillOverflowAndCauseLayoutIssuesAndHasToBeBrokenDown';

@Component({ name: 'DefaultButtonStory' })
class DefaultMultiValueInputStory extends Vue {
  private emptyPills: Array<string> = [];

  private pills: Array<string> = [...pills];
  private errorPills: Array<string> = ['test', veryLongValue, 'test2WithLongOverflowingTextWithoutAnError'];
  private warnPills: Array<string> = ['test', 'testWarn', 'test2'];

  render(): VNode {
    return (
      <div class="lp-storybook-wrapper" style={this.wrapperStyles}>
        <MultiValueInput
          placeholder="Values"
          autoFocus={false}
          pills={this.emptyPills}
          typeaheadOptions={typeahead}
          typeaheadSummary={`${typeahead.length} of 12.3K · Keep typing for definite results.`}
          maxPillCount={5}
          onChange={this.onChangeEmpty}
          onInput={onInput}
          onButtonClick={onButtonClick}
          onFocus={onFocus}
          onFocusOut={onFocusOut}
        />
        <MultiValueInput
          placeholder="Values"
          autoFocus={false}
          pills={this.emptyPills}
          inputErrors="Value is required"
          typeaheadOptions={typeahead}
          typeaheadSummary={`${typeahead.length} of 12.3K · Keep typing for definite results.`}
          maxPillCount={5}
          onChange={this.onChangeEmpty}
          onInput={onInput}
          onButtonClick={onButtonClick}
          onFocus={onFocus}
          onFocusOut={onFocusOut}
        />
        <MultiValueInput
          placeholder="Values"
          pills={this.pills}
          typeaheadOptions={typeahead}
          typeaheadSummary={`${typeahead.length} of 12.3K · Keep typing for definite results.`}
          onChange={this.onChange}
          onInput={onInput}
          onButtonClick={onButtonClick}
          onFocus={onFocus}
          onFocusOut={onFocusOut}
        />
        <MultiValueInput
          placeholder="Values"
          pills={this.warnPills}
          pillWarnings={{ testWarn: 'This is a targetted warning' }}
          onChange={this.onChangeWarn}
          onInput={onInput}
          onButtonClick={onButtonClick}
          onFocus={onFocus}
          onFocusOut={onFocusOut}
        />
        <MultiValueInput
          placeholder="Values"
          pills={this.errorPills}
          pillErrors={{ [veryLongValue]: ['This is a targetted error', 'And another one'] }}
          onChange={this.onChangeError}
          onInput={onInput}
          onButtonClick={onButtonClick}
          onFocus={onFocus}
          onFocusOut={onFocusOut}
        />
        <MultiValueInput placeholder="Values" pills={['Sofia', 'Plovdiv']} disabled={true} />
        <StargateTarget />
      </div>
    );
  }

  private get wrapperStyles(): Partial<CSSStyleDeclaration> {
    return {
      maxWidth: '500px'
    };
  }

  onChangeEmpty(pills: Array<string>): void {
    this.emptyPills = pills;
    onChange(pills);
  }

  onChange(pills: Array<string>): void {
    this.pills = pills;
    onChange(pills);
  }

  onChangeError(pills: Array<string>): void {
    this.errorPills = pills;
    onChange(pills);
  }

  onChangeWarn(pills: Array<string>): void {
    this.warnPills = pills;
    onChange(pills);
  }
}

storiesOf(`${StorybookSection.INPUT}/MultiValueInput`, module).add('Default', () => DefaultMultiValueInputStory);
