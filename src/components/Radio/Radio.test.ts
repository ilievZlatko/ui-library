import { mount, Slots, Wrapper } from '@vue/test-utils';
import { Radio } from './Radio';

describe('Radio', () => {
  it('renders the correct class names', () => {
    assertClassNames({}, 'container', 'unchecked');
    assertClassNames({ checked: true }, 'container', 'checked');
    assertClassNames({ text: 'abc', checked: true }, 'has-text', 'container', 'checked');
    assertClassNames({ disabled: true }, 'container', 'disabled', 'unchecked');
    assertClassNames({ text: 'abc' }, 'container', 'unchecked', 'has-text');

    function assertClassNames(props: Partial<Radio.Props>, ...classNames: Array<string>): void {
      const wrapper = renderComponent({ ...props, name: 'abc' });
      expect(classNames).toEqual(expect.arrayContaining(wrapper.find('label.container').classes()));
    }
  });

  it('renders a radio with no text', () => {
    const wrapper = renderComponent({ name: 'abc' });
    expect(wrapper.contains('span.text')).toBeFalsy();
  });

  it('emits the correct select event', () => {
    const wrapper = renderComponent({ name: 'abc' });
    expect(wrapper.emitted().select).not.toBeDefined();

    wrapper.find('.real-input').trigger('change');
    expect(wrapper.emitted().select[0]).toBeDefined();
  });

  it('renders the description slot', () => {
    const wrapper = renderComponent({ name: 'abc' }, { description: 'An alphabet' });
    expect(wrapper.emitted().select).not.toBeDefined();

    expect(wrapper.find('.description').text()).toEqual('An alphabet');
  });

  function renderComponent(propsData: Radio.Props, slots?: Slots): Wrapper<Radio> {
    return mount(Radio, {
      propsData,
      slots
    });
  }
});
