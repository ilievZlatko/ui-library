import { mount, Wrapper } from '@vue/test-utils';
import { RelativeDate } from 'leanplum-lib-common';
import { DropdownButton } from '../DropdownButton/DropdownButton';
import { TextInput } from '../TextInput/TextInput';
import { RelativeDateInput } from './RelativeDateInput';

const defaultValue = { offset: -4, unit: RelativeDate.Unit.DAYS };

describe(RelativeDateInput, () => {
  let wrapper: Wrapper<RelativeDateInput>;

  beforeEach(() => {
    wrapper = mount(RelativeDateInput, {
      propsData: { value: { ...defaultValue } }
    });
  });

  afterEach(() => wrapper.destroy());

  it('renders', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('renders DropdownButton', () => {
    expect(wrapper.contains(TextInput)).toBe(true);
  });

  it('renders TextInput', () => {
    expect(wrapper.contains(TextInput)).toBe(true);
  });

  it('renders input direction label by default', () => {
    expect(wrapper.html()).toContain('ago');
  });

  it('can hide the input direction label', () => {
    wrapper.setProps({ showInputDirectionLabel: false });
    expect(wrapper.html()).not.toContain('ago');
  });

  describe('offset input', () => {
    it('passes correct props', () => {
      const propagatedProps = {
        autoFocus: true,
        disabled: true,
        loading: true
      };

      wrapper.setProps(propagatedProps);
      expect(wrapper.find<TextInput>(TextInput).props()).toMatchObject({
        ...propagatedProps,
        value: '4'
      });
    });

    it('emits change when typing a parsable number', () => {
      wrapper.find<TextInput>(TextInput).vm.$emit('input', '123');
      expectEmittedValueToMatch({ offset: -123 });
    });

    it('passes error prop to input component when input is invalid', () => {
      wrapper.find<TextInput>(TextInput).vm.$emit('input', '123e');
      expect(wrapper.find<TextInput>(TextInput).vm.error).toContain('Value');
    });

    it('propagates focusOut', () => {
      wrapper.find<TextInput>(TextInput).vm.$emit(TextInput.EVENT_FOCUS_OUT);
      expect(wrapper.emitted()[RelativeDateInput.EVENT_FOCUS_OUT]).toBeDefined();
    });
  });

  describe('unit dropdown', () => {
    it('passes correct props', () => {
      expect(wrapper.find<TextInput>(TextInput).vm.value).toBe('4');
      expect(wrapper.find<DropdownButton>(DropdownButton).vm.activeItem).toMatchObject({ label: 'days' });
    });

    it('emits change when selecting a new unit', () => {
      wrapper.find(DropdownButton).vm.$emit('select', { value: RelativeDate.Unit.YEARS });
      expectEmittedValueToMatch({ unit: RelativeDate.Unit.YEARS });
    });
  });

  describe('time direction dropdown', () => {
    it('renders DropdownButton', () => {
      expect(directionDropdown().exists()).toBe(true);
    });

    it('sets ago as active item when value is negative', () => {
      wrapper.setProps({ value: { offset: -1, unit: RelativeDate.Unit.DAYS } });
      expect(directionDropdown().vm.activeItem).toMatchObject({ label: RelativeDate.offsetDirection(-1) });
    });

    it('sets ago as active item when value is 0', () => {
      wrapper.setProps({ value: { offset: 0, unit: RelativeDate.Unit.DAYS } });
      expect(directionDropdown().vm.activeItem).toMatchObject({ label: RelativeDate.offsetDirection(0) });
    });

    it('sets in the future as active item when value is negative', () => {
      wrapper.setProps({ value: { offset: 1, unit: RelativeDate.Unit.DAYS } });
      expect(directionDropdown().vm.activeItem).toMatchObject({ label: RelativeDate.offsetDirection(1) });
    });

    it('emits appropriate value on select', () => {
      directionDropdown().vm.$emit('select', { label: 'test', value: 1 });
      expectEmittedValueToMatch({ ...defaultValue, offset: -defaultValue.offset });
    });

    it('disables it when disabled is true', () => {
      wrapper.setProps({ disabled: true });
      expect(directionDropdown().vm.disabled).toBe(true);
    });

    it('disables it when directionDisabled is true', () => {
      wrapper.setProps({ directionDisabled: true });
      expect(directionDropdown().vm.disabled).toBe(true);
    });

    function directionDropdown(): Wrapper<DropdownButton> {
      return wrapper.findAll<DropdownButton>(DropdownButton).at(1);
    }
  });

  function expectEmittedValueToMatch(value: Partial<RelativeDate>): void {
    expect(wrapper.emitted().change[0][0]).toMatchObject(value);
  }
});
