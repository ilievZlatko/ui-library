import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import { createTestHarness } from 'leanplum-lib-testing';
import { DateTime, Settings } from 'luxon';
import PortalVue from 'portal-vue';
import Vue from 'vue';
import { AnchoredPopup } from '../AnchoredPopup/AnchoredPopup';
import { Calendar } from '../Calendar/Calendar';
import { Icon } from '../icon/Icon';
import { StargateTarget } from '../Stargate/StargateTarget';
import { TextInput } from '../TextInput/TextInput';
import { WrappedTextInput } from '../WrappedTextInput/WrappedTextInput';
import { DatePicker } from './DatePicker';

describe(DatePicker, (): void => {
  let wrapper: Wrapper<Vue>;

  const label = 'Date';
  const propDate = DateTime.fromObject({ year: 2019, month: 6, day: 1 });
  const differentDate = DateTime.fromObject({ year: 2019, month: 6, day: 5 });
  const excludeDatesBefore = DateTime.fromObject({ year: 2019, month: 5, day: 1 });
  const excludeDatesAfter = DateTime.fromObject({ year: 2019, month: 7, day: 1 });
  const propagatedTextInputProps = {
    error: 'error',
    warning: 'warning',
    autoFocus: true
  };

  beforeAll(() => {
    Settings.now = () => propDate.plus({ day: 1 }).toMillis();
  });

  beforeEach(() => {
    wrapper = renderHarness({ value: propDate, excludeDatesAfter, excludeDatesBefore });
  });

  afterEach(() => {
    wrapper.destroy();
  });

  context('default', () => {
    it('renders', () => {
      expect(wrapper.exists()).toBe(true);
    });

    it('renders TextInput with formatted date', () => {
      expect(wrapper.contains(TextInput)).toBe(true);
      expectDisplayedDate(propDate);
    });

    it('renders WrappedTextInput with formatted date and label when it is provided', () => {
      wrapper.setProps({ label });

      expectDisplayedDate(propDate);
      expect(wrapper.find<WrappedTextInput>(WrappedTextInput).vm.label).toBe(label);
    });

    it('renders empty string with null values', () => {
      wrapper.setProps({ value: null });

      expect(wrapper.find<TextInput>(TextInput).vm.value).toEqual('');
    });

    it('does not render Calendar by default', () => {
      expect(wrapper.find<AnchoredPopup>(AnchoredPopup).vm.opened).toBe(false);
      expect(wrapper.contains(Calendar)).toBe(false);
    });

    it('propagates props to TextInput', () => {
      wrapper.setProps(propagatedTextInputProps);
      expect(wrapper.find(TextInput).props()).toMatchObject(propagatedTextInputProps);
    });

    it('propagates props to WrappedTextInput', () => {
      wrapper.setProps({ ...propagatedTextInputProps, label });
      expect(wrapper.find(WrappedTextInput).props()).toMatchObject(propagatedTextInputProps);
    });

    it('renders Icon', () => {
      expect(wrapper.contains(Icon)).toBe(true);
    });
  });

  context('disabled', () => {
    beforeEach(() => {
      wrapper.setProps({ disabled: true });
    });

    it('does not open AnchoredPopup when disabled', () => {
      focusInput();

      expect(wrapper.find<AnchoredPopup>(AnchoredPopup).vm.opened).toBe(false);
      expect(wrapper.contains(Calendar)).toBe(false);
    });

    it('propagates disabled to TextInput', () => {
      expect(wrapper.find<TextInput>(TextInput).vm.disabled).toBe(true);
    });

    it('propagates disabled to WrappedTextInput', () => {
      wrapper.setProps({ label });
      expect(wrapper.find<WrappedTextInput>(WrappedTextInput).vm.disabled).toBe(true);
    });
  });

  context('with focused input', () => {
    beforeEach(focusInput);
    // Wait for AnchoredPopup to open
    beforeEach(Vue.nextTick);

    // AnchoredPopup needs to be opened to render the Calendar
    describe('Calendar & AnchoredPopup', () => {
      it('opens AnchoredPopup & renders Calendar on input focus', () => {
        expect(wrapper.find<AnchoredPopup>(AnchoredPopup).vm.opened).toBe(true);
        expect(wrapper.contains(Calendar)).toBe(true);
      });

      it(`closes AnchoredPopup on AnchoredPopup ${AnchoredPopup.EVENT_TOGGLE}`, async () => {
        await closePopup();
        expect(wrapper.find<AnchoredPopup>(AnchoredPopup).vm.opened).toBe(false);
      });

      it(`blurs input on AnchoredPopup ${AnchoredPopup.EVENT_TOGGLE}`, async () => {
        await closePopup();
        expect(wrapper.find<TextInput>(TextInput).emitted()[TextInput.EVENT_BLUR]).toHaveLength(1);
      });

      it('passes the correct props to Calendar', () => {
        expect(wrapper.find(Calendar).props()).toMatchObject({
          selected: [propDate],
          excludeDatesBefore,
          excludeDatesAfter,
          currentMonth: propDate
        });
      });

      it('passes today as value to Calendar if prop value is null', () => {
        wrapper.setProps({ value: null });

        expect(wrapper.find(Calendar).props()).toMatchObject({
          selected: [DateTime.local()],
          currentMonth: DateTime.local()
        });
      });

      it(`updates displayed Calendar month on ${Calendar.EVENT_UPDATE_MONTH}`, () => {
        const month = DateTime.fromObject({ year: 2019, month: 12 });
        wrapper.find(Calendar).vm.$emit(Calendar.EVENT_UPDATE_MONTH, month);

        expect(wrapper.find<Calendar>(Calendar).vm.currentMonth).toEqual(month);
      });
    });

    describe('parsing', () => {
      it('parses input and passes the value to Calendar', () => {
        inputDate(differentDate);

        expect(wrapper.find<Calendar>(Calendar).vm.selected).toContainEqual(differentDate);
        expectNoError();
      });

      it('shows an error when the text value is date after the excludeDatesAfter', () => {
        inputDate(excludeDatesAfter.plus({ day: 1 }));

        expectErrorContains(`before ${excludeDatesAfter.toFormat(DatePicker.DEFAULT_FORMAT)}`);
        expect(wrapper.find<Calendar>(Calendar).vm.selected).toEqual([propDate]);
      });

      it('shows an error when the text value is date before the excludeDatesBefore', () => {
        inputDate(excludeDatesBefore.minus({ day: 1 }));

        expectErrorContains(`after ${excludeDatesBefore.toFormat(DatePicker.DEFAULT_FORMAT)}`);
        expect(wrapper.find<Calendar>(Calendar).vm.selected).toEqual([propDate]);
      });

      context('not a date input', () => {
        beforeEach(inputInvalid);

        it('shows an error when the text value is invalid', () => {
          expectErrorContains('Date should match one of the supported formats');
          expect(wrapper.find<Calendar>(Calendar).vm.selected).toEqual([propDate]);
        });

        it(`resets input value and clears error on input ${TextInput.EVENT_BLUR}`, () => {
          wrapper.find(TextInput).vm.$emit(TextInput.EVENT_BLUR);

          expectDisplayedDate(propDate);
          expectNoError();
        });

        it(`resets input value and clears error on AnchoredPopup ${AnchoredPopup.EVENT_TOGGLE}`, async () => {
          await closePopup();

          expectDisplayedDate(propDate);
          expectNoError();
        });
      });
    });

    describe(`events`, () => {
      it(`emits ${DatePicker.EVENT_CHANGE} on Calendar ${Calendar.EVENT_UPDATE}`, () => {
        wrapper.find(Calendar).vm.$emit(Calendar.EVENT_UPDATE, differentDate);
        expectEmittedDateEquals(differentDate);
      });

      it(`emits ${DatePicker.EVENT_FOCUS_OUT} on Calendar ${Calendar.EVENT_UPDATE}`, () => {
        wrapper.find(Calendar).vm.$emit(Calendar.EVENT_UPDATE, propDate);
        expectEmittedFocusOut();
      });

      it(`emits ${DatePicker.EVENT_CHANGE} on input ${TextInput.EVENT_BLUR}`, () => {
        inputDate(differentDate);
        wrapper.find(TextInput).vm.$emit(TextInput.EVENT_BLUR);
        expectEmittedDateEquals(differentDate);
      });

      it(`emits ${DatePicker.EVENT_FOCUS_OUT} on input ${TextInput.EVENT_BLUR}`, () => {
        wrapper.find(TextInput).vm.$emit(TextInput.EVENT_BLUR);
        expectEmittedFocusOut();
      });

      it(`emits ${DatePicker.EVENT_CHANGE} on input ${TextInput.EVENT_SUBMIT}`, () => {
        inputDate(differentDate);
        wrapper.find(TextInput).vm.$emit(TextInput.EVENT_SUBMIT);
        expectEmittedDateEquals(differentDate);
      });

      it(`emits ${DatePicker.EVENT_FOCUS_OUT} on input ${TextInput.EVENT_SUBMIT}`, () => {
        wrapper.find(TextInput).vm.$emit(TextInput.EVENT_SUBMIT);
        expectEmittedFocusOut();
      });

      it(`emits ${DatePicker.EVENT_CHANGE} on AnchoredPopup ${AnchoredPopup.EVENT_TOGGLE}`, async () => {
        inputDate(differentDate);
        await closePopup();
        expectEmittedDateEquals(differentDate);
      });

      it(`emits ${DatePicker.EVENT_FOCUS_OUT} on AnchoredPopup ${AnchoredPopup.EVENT_TOGGLE}`, async () => {
        inputDate(differentDate);
        await closePopup();
        expectEmittedFocusOut();
      });

      it(`does not emit ${DatePicker.EVENT_CHANGE} if value is the same`, () => {
        inputDate(propDate);
        expect(wrapper.emitted()[DatePicker.EVENT_CHANGE]).toBeUndefined();
      });
    });
  });

  function renderHarness(propsData: DatePicker.Props): Wrapper<Vue> {
    const localVue = createLocalVue();
    localVue.use(PortalVue);

    const harness = createTestHarness(DatePicker, StargateTarget, [
      DatePicker.EVENT_CHANGE,
      DatePicker.EVENT_FOCUS_OUT
    ]);

    return mount(harness, {
      propsData,
      localVue
    });
  }

  function inputDate(date: DateTime): void {
    wrapper.find(TextInput).vm.$emit(TextInput.EVENT_INPUT, date.toFormat(DatePicker.DEFAULT_FORMAT));
  }

  function inputInvalid(): void {
    wrapper.find(TextInput).vm.$emit(TextInput.EVENT_INPUT, '--NOT__A__DATE--');
  }

  function focusInput(): void {
    // workaround for jsdom(v16) bug with focus: https://github.com/jsdom/jsdom/issues/2586
    document.body.appendChild(wrapper.vm.$el);
    wrapper.find('input').element.focus();
  }

  function closePopup(): Promise<void> {
    wrapper.find(AnchoredPopup).vm.$emit(AnchoredPopup.EVENT_TOGGLE);

    // Wait for AnchoredPopup to close
    return wrapper.vm.$nextTick();
  }

  function expectErrorContains(message: string): void {
    expect(wrapper.find<TextInput>(TextInput).vm.error).toContain(message);
  }

  function expectNoError(): void {
    expect(wrapper.find<TextInput>(TextInput).vm.error).toBeNull();
  }

  function expectDisplayedDate(date: DateTime): void {
    expect((wrapper.find('input').element as HTMLInputElement).value).toEqual(date.toFormat(DatePicker.DEFAULT_FORMAT));
  }

  function expectEmittedDateEquals(date: DateTime): void {
    const emits = wrapper.emitted()[DatePicker.EVENT_CHANGE];

    expect(emits).toHaveLength(1);
    expect(emits[0][0]).toEqual(date);
  }

  function expectEmittedFocusOut(): void {
    expect(wrapper.emitted()[DatePicker.EVENT_FOCUS_OUT]).toHaveLength(1);
  }
});
