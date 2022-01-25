import { shallowMount, Wrapper } from '@vue/test-utils';
import { TextInput } from '../../TextInput/TextInput';
import { IncrementalInput } from './IncrementalInput';

describe(IncrementalInput, () => {
  let wrapper: Wrapper<IncrementalInput>;

  beforeEach(() => {
    wrapper = renderComponent({ value: '12' });
  });

  it('renders', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('renders up & down buttons', async () => {
    expect(wrapper.findAll('.lp-incremental-input-button').length).toEqual(2);
  });

  it('renders TextInput', () => {
    expect(wrapper.contains(TextInput)).toBe(true);
    expect(wrapper.find(TextInput).props()).toMatchObject({ value: '12', readonly: false });
  });

  it(`emits ${IncrementalInput.EVENT_UP} on clicking up button`, () => {
    wrapper.find('.lp-incremental-input-button').trigger('click');
    expect(wrapper.emitted()[IncrementalInput.EVENT_UP]).toHaveLength(1);
  });

  it(`emits ${IncrementalInput.EVENT_DOWN} on clicking down button`, () => {
    wrapper
      .findAll('.lp-incremental-input-button')
      .at(1)
      .trigger('click');

    expect(wrapper.emitted()[IncrementalInput.EVENT_DOWN]).toHaveLength(1);
  });

  it(`emits ${IncrementalInput.EVENT_CHANGE} on TextInput input`, () => {
    wrapper.find(TextInput).vm.$emit('input', '13');
    expect(wrapper.emitted().change).toEqual([['13']]);
  });

  it('propagates disabled prop', () => {
    wrapper.setProps({ disabled: true });
    expect(wrapper.find<TextInput>(TextInput).vm.disabled).toBe(true);
  });

  it('propagates error', () => {
    wrapper.setProps({ error: 'test' });
    expect(wrapper.find<TextInput>(TextInput).vm.error).toBe('test');
  });

  function renderComponent(propsData?: IncrementalInput.Props): Wrapper<IncrementalInput> {
    return shallowMount(IncrementalInput, { propsData });
  }
});
