import { shallowMount, Wrapper } from '@vue/test-utils';
import { createSelectorFactory, Selector } from 'leanplum-lib-testing';
import { Dropdown } from '../Dropdown/Dropdown';
import { NumberInput } from '../NumberInput/NumberInput';
import { Pill } from '../Pill/Pill';
import { PartialDatePicker } from './PartialDatePicker';

describe(PartialDatePicker, () => {
  const value = { day: 12, month: 10 };
  const dayInputError = 'day error';
  const monthInputError = 'month error';
  const disabled = true;

  let wrapper: Wrapper<PartialDatePicker>;

  let numberInput: Selector<NumberInput>;
  let pill: Selector<Pill>;
  let dropdown: Selector<Dropdown>;

  beforeEach(() => {
    wrapper = shallowMount(PartialDatePicker);

    const selectorFactory = createSelectorFactory(wrapper);

    numberInput = selectorFactory(NumberInput);
    pill = selectorFactory(Pill);
    dropdown = selectorFactory(Dropdown);
  });

  it('renders', () => {
    expect(wrapper.exists()).toBe(true);
  });

  describe('day input', () => {
    it('renders NumberInput', () => {
      expect(wrapper.contains(NumberInput)).toBe(true);
    });

    it('passes day value from value prop to NumberInput', () => {
      wrapper.setProps({ value });
      expect(numberInput().value).toBe(value.day);
    });

    it('passes dayInputError to NumberInput', () => {
      wrapper.setProps({ dayInputError });
      expect(numberInput().error).toBe(dayInputError);
    });

    it('passes disabled to NumberInput', () => {
      wrapper.setProps({ disabled });
      expect(numberInput().disabled).toBe(disabled);
    });

    it('emits change on NumberInput input', () => {
      numberInput().$emit(NumberInput.EVENT_INPUT, 22);
      expect(wrapper.emitted(PartialDatePicker.EVENT_CHANGE)).toMatchObject([[expect.objectContaining({ day: 22 })]]);
    });

    it('propagates focusOut', () => {
      numberInput().$emit(NumberInput.EVENT_FOCUSOUT);
      expect(wrapper.emitted(PartialDatePicker.EVENT_FOCUS_OUT)).toMatchObject([[]]);
    });
  });

  describe('month dropdown', () => {
    it('renders Dropdown', () => {
      expect(wrapper.contains(Dropdown)).toBe(true);
    });

    it('renders Pill', () => {
      expect(wrapper.contains(Pill)).toBe(true);
    });

    it('passes formatted month value from value prop to Pill', () => {
      wrapper.setProps({ value });
      expect(pill().text).toBe(PartialDatePicker.MONTH_OPTIONS[value.month - 1].label);
    });

    it('passes monthInputError to Pill', () => {
      wrapper.setProps({ monthInputError });
      expect(pill().error).toBe(monthInputError);
    });

    it('passes disabled to Pill & Dropdown', () => {
      wrapper.setProps({ disabled });
      expect(pill().disabled).toBe(disabled);
      expect(dropdown().disabled).toBe(disabled);
    });

    it('emits change on Dropdown select', () => {
      const month = 9;
      dropdown().$emit('select', { value: month });
      expect(wrapper.emitted(PartialDatePicker.EVENT_CHANGE)).toMatchObject([[expect.objectContaining({ month: 9 })]]);
    });

    it('emits focusOut on Dropdown select', () => {
      dropdown().$emit('select', { value: 9 });
      expect(wrapper.emitted(PartialDatePicker.EVENT_FOCUS_OUT)).toMatchObject([[]]);
    });
  });

  describe('day validation', () => {
    const max = 29;
    const invalidValue = { day: 30, month: 2 };

    beforeEach(() => {
      wrapper.setProps({ value: invalidValue });
    });

    it('sets appropriate max value to day input in regard to month value', () => {
      expect(numberInput().max).toBe(max);
    });

    it('passes error to day input when invalid value is provided', () => {
      expect(numberInput().error).toContain(max.toString());
    });
  });
});
