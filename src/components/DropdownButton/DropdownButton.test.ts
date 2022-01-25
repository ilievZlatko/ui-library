import { shallowMount, Wrapper } from '@vue/test-utils';
import { Button } from '../Button/Button';
import { Dropdown } from '../Dropdown/Dropdown';
import { DropdownButton } from './DropdownButton';

describe(DropdownButton, (): void => {
  let wrapper: Wrapper<DropdownButton>;
  const items = [{ label: 'one', value: 'one' }];

  function renderComponent(): Wrapper<DropdownButton> {
    return shallowMount(DropdownButton, {
      propsData: {
        items,
        activeItem: items[0]
      }
    });
  }

  beforeEach(() => (wrapper = renderComponent()));

  it('renders', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('emits select event when item selected in dropdown', () => {
    expect(wrapper.emitted().select).not.toBeDefined();
    dropdown().vm.$emit('select', { label: 'TEST', value: 'TEST_VAL' });
    expect(wrapper.emitted().select).toBeDefined();
    expect(wrapper.emitted().select[0][0].value).toBe('TEST_VAL');
  });

  it('passes disabled prop to button & dropdown', () => {
    wrapper.setProps({ disabled: true });

    expect(wrapper.find(Button).props().disabled).toBe(true);
    expect(dropdown().props().disabled).toBe(true);
  });

  it('passes activeItem to Dropdown', () => {
    expect(dropdown().props().selectedItem).toEqual({ label: 'one', value: 'one' });
  });

  it('passes enableSearch to Dropdown', () => {
    expect(dropdown().props().enableSearch).toBe(false);
    wrapper.setProps({ enableSearch: true });
    expect(dropdown().props().enableSearch).toBe(true);
  });

  function dropdown(): Wrapper<Dropdown> {
    return wrapper.find<Dropdown>(Dropdown);
  }
});
