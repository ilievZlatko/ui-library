import { mount, Wrapper } from '@vue/test-utils';
import Vue, { VNode } from 'vue';
import { Component } from 'vue-property-decorator';
import { LegendWrapper } from '../LegendWrapper/LegendWrapper';
import { NumberInput } from './NumberInput';

@Component({ name: 'NumberInputHarness' })
class NumberInputHarness extends Vue {
  render(): VNode {
    return (
      <NumberInput label="abc">
        <template slot="before">
          <p>--before-slot--</p>
        </template>
        <template slot="after">
          <p>--after-slot--</p>
        </template>
      </NumberInput>
    );
  }
}

describe('NumberInput', () => {
  it('renders without error', () => {
    const wrapper = renderComponent({ label: 'abc' });
    expect(wrapper.contains(NumberInput)).toBeTruthy();
    expect(wrapper.contains(LegendWrapper)).toBeTruthy();
    expect(wrapper.find(LegendWrapper).props().label).toEqual('abc');
  });

  it('renders collapsed if value is null', () => {
    const wrapper = renderComponent({ label: 'abc', value: null });

    expect(wrapper.find(LegendWrapper).props().expanded).toBeFalsy();
  });

  it('renders expanded if value is not null', () => {
    const wrapper = renderComponent({ label: 'abc', value: 20 });

    expect(wrapper.find(LegendWrapper).props().expanded).toBeTruthy();
  });

  it('renders all the slots', () => {
    const wrapper = mount(NumberInputHarness);

    expect(wrapper.contains(NumberInput)).toBeTruthy();
    expect(wrapper.text()).toContain('before-slot');
    expect(wrapper.text()).toContain('after-slot');
  });

  it('correctly parses integer values after user input', () => {
    const wrapper = renderComponent({ label: 'Integer Value', value: null });

    expect(wrapper.emitted().input).not.toBeDefined();

    const inputWrapper = wrapper.find('input');
    const inputEl = inputWrapper.element as HTMLInputElement;

    expect(inputEl.value).toEqual('');

    inputEl.value = 'abc';
    inputWrapper.trigger('change');
    expect(wrapper.emitted().change[0][0]).toBe(null);

    inputEl.value = '20';
    inputWrapper.trigger('change');
    expect(wrapper.emitted().change[1][0]).toBe(20);

    inputEl.value = '30.1';
    inputWrapper.trigger('change');
    expect(wrapper.emitted().change[2][0]).toBe(30);

    inputEl.value = '40.05';
    inputWrapper.trigger('change');
    expect(wrapper.emitted().change[3][0]).toBe(40);
  });

  it('correctly parses floating point values after user input', () => {
    const wrapper = renderComponent({ label: 'Floating Point Value', allowFloat: true, value: null });

    expect(wrapper.emitted().input).not.toBeDefined();

    const inputWrapper = wrapper.find('input');
    const inputEl = inputWrapper.element as HTMLInputElement;

    expect(inputEl.value).toEqual('');

    inputEl.value = 'abc';
    inputWrapper.trigger('change');
    expect(wrapper.emitted().change[0][0]).toBe(null);

    inputEl.value = '20';
    inputWrapper.trigger('change');
    expect(wrapper.emitted().change[1][0]).toBe(20.0);

    inputEl.value = '30.1';
    inputWrapper.trigger('change');
    expect(wrapper.emitted().change[2][0]).toBe(30.1);

    inputEl.value = '40.05';
    inputWrapper.trigger('change');
    expect(wrapper.emitted().change[3][0]).toBe(40.05);
  });

  it('supports unlabeled inputs', () => {
    const wrapper = renderComponent({ value: null });

    expect(wrapper.contains('input')).toBe(true);
  });

  it('does not allow value to get more than max', () => {
    const wrapper = renderComponent({ value: null, max: 89 });

    const inputWrapper = wrapper.find('input');
    const input = inputWrapper.element as HTMLInputElement;

    input.value = '378738';
    inputWrapper.trigger('change');

    expect(wrapper.emitted().change[0][0]).toBe(89);
  });

  it('does not allow value to get less than min', () => {
    const wrapper = renderComponent({ value: null, min: 89 });

    const inputWrapper = wrapper.find('input');
    const input = inputWrapper.element as HTMLInputElement;

    input.value = '3';
    inputWrapper.trigger('change');

    expect(wrapper.emitted().change[0][0]).toBe(89);
  });

  it('shows placeholder if set and value is null', () => {
    const wrapper = renderComponent({ value: null, placeholder: 'No cap' });

    expect(wrapper.find('input').attributes('placeholder')).toBe('No cap');
  });

  it('does not allow non-number input', () => {
    const wrapper = renderComponent({ value: null, placeholder: 'No cap' });
    const inputWrapper = wrapper.find('input');
    const input = inputWrapper.element as HTMLInputElement;

    input.value = '1';
    inputWrapper.trigger('input');
    expect(input.value).toBe('1');

    input.value = '-1';
    inputWrapper.trigger('input');
    expect(input.value).toBe('-1');

    input.value = 'a';
    inputWrapper.trigger('input');
    expect(input.value).toBe('');
  });

  it('gives time for user to type number before validates the value', () => {
    const wrapper = renderComponent({
      value: null,
      min: 2,
      shakeOnValidate: true
    });
    const inputWrapper = wrapper.find('input');
    const input = inputWrapper.element as HTMLInputElement;

    input.value = '1';
    inputWrapper.trigger('input');

    setTimeout(() => {
      input.value += '2';
      inputWrapper.trigger('input');
    }, 300);

    setTimeout(() => {
      expect(input.value).toBe('12');
    }, 1300);
  });

  it('validates value with delay after user input', () => {
    const wrapper = renderComponent({
      value: null,
      min: 2,
      max: 20,
      shakeOnValidate: true
    });
    const inputWrapper = wrapper.find('input');
    const input = inputWrapper.element as HTMLInputElement;

    input.value = '1';
    inputWrapper.trigger('input');

    setTimeout(() => {
      expect(input.value).toBe('2');
    }, 800); // 800 comes from @Debounced(800)
  });

  it('validates value with delay after user input', () => {
    const wrapper = renderComponent({
      value: null,
      min: 1,
      max: 20,
      shakeOnValidate: true
    });
    const inputWrapper = wrapper.find('input');
    const input = inputWrapper.element as HTMLInputElement;

    input.value = '22';
    inputWrapper.trigger('input');

    setTimeout(() => {
      expect(input.value).toBe('2');
    }, 800); // 800 comes from @Debounced(800)
  });

  function renderComponent(propsData: NumberInput.Props): Wrapper<NumberInput> {
    return mount(NumberInput, {
      propsData
    });
  }
});
