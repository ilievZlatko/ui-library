import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import { createTestHarness } from 'leanplum-lib-testing';
import { DateTime, Settings } from 'luxon';
import PortalVue from 'portal-vue';
import Vue from 'vue';
import { AnchoredPopup } from '../AnchoredPopup/AnchoredPopup';
import { Icon } from '../icon/Icon';
import { StargateTarget } from '../Stargate/StargateTarget';
import { TextInput } from '../TextInput/TextInput';
import { WrappedTextInput } from '../WrappedTextInput/WrappedTextInput';
import { TimeInput } from './TimeInput/TimeInput';
import { TimePicker } from './TimePicker';

describe(TimePicker, () => {
  let wrapper: Wrapper<Vue>;

  const label = 'Time';
  const today = DateTime.local().set({ millisecond: 0, second: 0 });
  const propTime = today.set({ hour: 4, minute: 20 });
  const differentTime = today.set({ hour: 16, minute: 22 });
  const propagatedTextInputProps = {
    error: 'error',
    warning: 'warning',
    autoFocus: true
  };

  beforeAll(() => {
    Settings.now = () => today.toMillis();
  });

  beforeEach(() => {
    wrapper = renderHarness({ value: propTime });
  });

  afterEach(() => {
    wrapper.destroy();
  });

  context('default', () => {
    it('renders', () => {
      expect(wrapper.exists()).toBe(true);
    });

    it('renders closed AnchoredPopup & no TimeInput', () => {
      expect(wrapper.find<AnchoredPopup>(AnchoredPopup).vm.opened).toBe(false);
      expect(wrapper.contains(TimeInput)).toBe(false);
    });

    it('renders TextInput component with formatted time', () => {
      expect(wrapper.contains(TextInput)).toBe(true);
      expectDisplayedTime(propTime);
    });

    it('renders WrappedTextInput when with label', () => {
      wrapper.setProps({ label });

      expect(wrapper.find<WrappedTextInput>(WrappedTextInput).vm.label).toBe(label);
      expectDisplayedTime(propTime);
    });

    it('renders Icon', () => {
      expect(wrapper.contains(Icon)).toBe(true);
    });

    it('propagates props to TextInput', () => {
      wrapper.setProps(propagatedTextInputProps);
      expect(wrapper.find(TextInput).props()).toMatchObject(propagatedTextInputProps);
    });

    it('propagates props to WrappedTextInput', () => {
      wrapper.setProps({ ...propagatedTextInputProps, label });
      expect(wrapper.find(WrappedTextInput).props()).toMatchObject(propagatedTextInputProps);
    });
  });

  context('disabled', () => {
    beforeEach(() => {
      wrapper.setProps({ disabled: true });
    });

    it('does not open AnchoredPopup when disabled', () => {
      focusInput();

      expect(wrapper.find<AnchoredPopup>(AnchoredPopup).vm.opened).toBe(false);
      expect(wrapper.contains(TimeInput)).toBe(false);
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

    describe('TimeInput & AnchoredPopup', () => {
      it('opens AnchoredPopup on focus of input & renders TimeInput', async () => {
        expect(wrapper.contains(TimeInput)).toBe(true);
        expect(wrapper.find<AnchoredPopup>(AnchoredPopup).vm.opened).toBe(true);
      });

      it(`closes AnchoredPopup on AnchoredPopup ${AnchoredPopup.EVENT_TOGGLE}`, async () => {
        await closePopup();
        expect(wrapper.find<AnchoredPopup>(AnchoredPopup).vm.opened).toBe(false);
      });

      it(`blurs input on AnchoredPopup ${AnchoredPopup.EVENT_TOGGLE}`, async () => {
        await closePopup();
        expect(wrapper.find<TextInput>(TextInput).emitted()[TextInput.EVENT_BLUR]).toHaveLength(1);
      });

      it('passes the correct props to the TimeInput component', () => {
        expect(wrapper.find(TimeInput).props()).toMatchObject({
          value: propTime
        });
      });

      it('passes 12:00 AM as value to TimeInput if prop value is null', () => {
        wrapper.setProps({ value: null });

        expect(wrapper.find(TimeInput).props()).toMatchObject({
          value: today.startOf('day')
        });
      });
    });

    describe('parsing', () => {
      it('parses input and passes the value to TimeInput', () => {
        inputTime(differentTime);

        expect(wrapper.find<TimeInput>(TimeInput).vm.value).toMatchObject(differentTime);
        expectNoError();
      });

      context('not a time input', () => {
        beforeEach(inputInvalid);

        it('shows an error when the text value is invalid', () => {
          expectErrorContains('Time should match one of the supported formats');
          expect(wrapper.find<TimeInput>(TimeInput).vm.value).toMatchObject(propTime);
        });

        it(`resets input value and clears error on AnchoredPopup ${AnchoredPopup.EVENT_TOGGLE}`, async () => {
          await closePopup();

          expectDisplayedTime(propTime);
          expectNoError();
        });
      });
    });

    describe(`events`, () => {
      it(`emits ${TimePicker.EVENT_CHANGE} on input ${TextInput.EVENT_BLUR} when AnchoredPopup is closed`, async () => {
        await closePopup();
        inputTime(differentTime);
        wrapper.find(TextInput).vm.$emit(TextInput.EVENT_BLUR);
        expectEmittedTimeEquals(differentTime);
      });

      it(`emits ${TimePicker.EVENT_FOCUS_OUT} on input ${TextInput.EVENT_BLUR} when AnchoredPopup is closed`, async () => {
        await closePopup();
        wrapper.find(TextInput).vm.$emit(TextInput.EVENT_BLUR);
        expectEmittedFocusOut();
      });

      it(`emits ${TimePicker.EVENT_CHANGE} on input ${TextInput.EVENT_SUBMIT}`, () => {
        inputTime(differentTime);
        wrapper.find(TextInput).vm.$emit(TextInput.EVENT_SUBMIT);
        expectEmittedTimeEquals(differentTime);
      });

      it(`emits ${TimePicker.EVENT_FOCUS_OUT} on input ${TextInput.EVENT_SUBMIT}`, () => {
        wrapper.find(TextInput).vm.$emit(TextInput.EVENT_SUBMIT);
        expectEmittedFocusOut();
      });

      it(`emits ${TimePicker.EVENT_CHANGE} on AnchoredPopup ${AnchoredPopup.EVENT_TOGGLE}`, async () => {
        inputTime(differentTime);
        await closePopup();
        expectEmittedTimeEquals(differentTime);
      });

      it(`emits ${TimePicker.EVENT_FOCUS_OUT} on AnchoredPopup ${AnchoredPopup.EVENT_TOGGLE}`, async () => {
        inputTime(differentTime);
        await closePopup();
        expectEmittedFocusOut();
      });

      it(`does not emit ${TimePicker.EVENT_CHANGE} if value is the same`, () => {
        inputTime(propTime);
        expect(wrapper.emitted()[TimePicker.EVENT_CHANGE]).toBeUndefined();
      });
    });
  });

  function inputTime(time: DateTime): void {
    wrapper.find(TextInput).vm.$emit(TextInput.EVENT_INPUT, time.toFormat(TimePicker.DEFAULT_FORMAT));
  }

  function inputInvalid(): void {
    wrapper.find(TextInput).vm.$emit(TextInput.EVENT_INPUT, '--NOT__A__TIME--');
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

  function expectDisplayedTime(time: DateTime): void {
    expect((wrapper.find('input').element as HTMLInputElement).value).toEqual(time.toFormat(TimePicker.DEFAULT_FORMAT));
  }

  function expectEmittedTimeEquals(time: DateTime): void {
    const emits = wrapper.emitted()[TimePicker.EVENT_CHANGE];

    expect(emits).toHaveLength(1);
    expect(emits[0][0]).toEqual(time);
  }

  function expectEmittedFocusOut(): void {
    expect(wrapper.emitted()[TimePicker.EVENT_FOCUS_OUT]).toBeDefined();
  }

  function renderHarness(propsData: TimePicker.Props): Wrapper<Vue> {
    const localVue = createLocalVue();
    localVue.use(PortalVue);

    const harness = createTestHarness(TimePicker, StargateTarget, [
      TimePicker.EVENT_CHANGE,
      TimePicker.EVENT_FOCUS_OUT
    ]);

    return mount(harness, {
      propsData,
      localVue
    });
  }
});
